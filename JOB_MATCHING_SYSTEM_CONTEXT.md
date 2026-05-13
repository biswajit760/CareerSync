# 🎯 CareerSync Job Matching System - Complete Context

## 📚 Overview

CareerSync has a **complete job matching workflow** that:
1. **Fetches jobs** from Adzuna API based on user role & seniority
2. **Caches jobs** for performance (with TTL expiry)
3. **Ranks jobs** using a sophisticated matching algorithm (5 factors)
4. **Displays jobs** via two different frontend pages (new profile-based + legacy resume-based)

---

## 🏗️ Architecture Layers

### Layer 1: Job Fetching (Backend)

**File:** `server/services/job.service.js`

```javascript
// Fetches live jobs from Adzuna API
exports.fetchJobsFromAdzuna = async (query, seniority) => {
  const simplifiedQuery = query.split(' ').slice(0, 2).join(' ');
  // Example: "MERN Stack Developer" → "MERN Stack"
  
  const response = await axios.get(
    `https://api.adzuna.com/v1/api/jobs/in/search/1`,
    {
      params: {
        app_id: ADZUNA_ID,
        app_key: ADZUNA_KEY,
        what: simplifiedQuery,
        results_per_page: 50
      },
      timeout: 10000
    }
  );
  
  // Transforms & cleans job data
  return response.data.results.map(job => ({
    id: job.id,
    title: job.title.replace(/<\/?[^>]+(>|$)/g, ""),
    company: job.company?.display_name || 'Unknown Company',
    location: job.location?.display_name || 'India',
    salary: formatSalary(job.salary_min),
    description: job.description || "No description",
    link: job.redirect_url,
    source: 'Adzuna',
    posted: new Date(job.created).toLocaleDateString('en-IN'),
    createdAt: new Date(job.created)
  }));
};
```

**What it does:**
- Takes role (e.g., "MERN Stack Developer") and seniority level
- Simplifies query to first 2 words (avoids Adzuna API strictness)
- Fetches up to 50 jobs
- Transforms raw Adzuna data into clean format
- Returns structured job objects

---

### Layer 2: Job Caching

**File:** `server/services/jobCache.service.js`

**Purpose:** Avoid repeated API calls, save costs, improve speed

**Cache Key Generation:**
```javascript
_generateCacheKey(role, seniority) {
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '-');
  const normalizedSeniority = seniority.toLowerCase();
  const stack = this._detectStack(role);  // MERN, PHP, .NET, Java, Python, general
  
  return `${normalizedRole}-${stack}-${normalizedSeniority}`;
  // Example: "mern-developer-mern-junior"
}
```

**Flow:**
1. **Check Cache:** Look for jobs with matching query key that haven't expired
2. **Cache HIT** ✅ → Return cached jobs immediately
3. **Cache MISS** 🔄 → Fetch fresh from Adzuna
4. **Store:** Save fresh jobs in DB with TTL expiry
5. **Fallback** 🚨 → If Adzuna API fails, return expired cache

**Database Model:** `server/model/JobCache.js`
```javascript
{
  jobId: String,
  queryKey: String,              // Cache lookup key
  title: String,
  company: String,
  description: String,
  salary: String,
  location: String,
  link: String,
  cachedAt: Date,
  expiresAt: Date,               // TTL-based expiry
  source: String
}
```

---

### Layer 3: Job Ranking Engine

**File:** `server/services/jobRanking.service.js`

**Purpose:** Calculate match score (0-100) for each job

#### **Algorithm: 5-Factor Weighted Scoring**

```javascript
calculateMatchScore(userProfile, job) {
  // STEP 1: Calculate 5 components
  const scores = {
    roleMatch:        30%  weight → Exact title match
    skillsMatch:      40%  weight → Most important
    experienceMatch:  10%  weight → Years alignment
    seniorityMatch:   10%  weight → Level alignment
    industryMatch:    10%  weight → Preferred industries
  };
  
  // STEP 2: Apply weighted sum
  totalScore = (scores.roleMatch × 0.30) +
               (scores.skillsMatch × 0.40) +
               (scores.experienceMatch × 0.10) +
               (scores.seniorityMatch × 0.10) +
               (scores.industryMatch × 0.10);
  
  // STEP 3: Apply penalties
  if (userStack !== jobStack && both non-general) {
    totalScore -= 25;  // Stack mismatch penalty
  }
  
  // STEP 4: Bound to 0-100
  return Math.max(0, Math.min(100, totalScore));
}
```

#### **Component Details:**

**1. Role Match (30%)**
```javascript
_calculateRoleMatch(profile, job) {
  const jobTitle = job.title.toLowerCase();
  const userRole = profile.primaryRole.toLowerCase();
  
  // Exact match = 100%
  if (jobTitle.includes(userRole)) return 100;
  
  // Variant match = 90%
  // e.g., "frontend developer" matches "react developer"
  for (const [main, variants] of Object.entries(this.roleMap)) {
    if (userRole.includes(main) && variants.some(v => jobTitle.includes(v))) {
      return 90;
    }
  }
  
  // Keyword overlap = percentage
  const keywords = userRole.split(" ");
  const matchCount = keywords.filter(kw => jobTitle.includes(kw)).length;
  return (matchCount / keywords.length) * 100;
}
```

**2. Skills Match (40% - HIGHEST WEIGHT)**
```javascript
_calculateSkillsMatch(profile, job) {
  const jobText = (job.description + " " + job.title).toLowerCase();
  const jobTokens = new Set(jobText.match(/[a-zA-Z0-9+#.\-]+/g) || []);
  const profileSkills = profile.skills.map(s => s.name.toLowerCase());
  
  let totalWeight = 0;
  let matchedWeight = 0;
  
  for (const skill of profileSkills) {
    const variants = this._expandSkill(skill);  // React → [react, react.js, reactjs]
    const weight = this.skillWeights[skill] || 0.6;
    
    totalWeight += weight;
    
    // Check if any variant found in job text
    if (variants.some(v => jobTokens.has(v.toLowerCase()))) {
      matchedWeight += weight;
    }
  }
  
  return (matchedWeight / totalWeight) * 100;
}
```

**Skill Weights:**
```javascript
skillWeights = {
  react: 1.0,
  node: 1.0,
  mongodb: 0.9,
  express: 0.9,
  javascript: 0.9,
  typescript: 0.9,
  nextjs: 0.9,
  html: 0.5,
  css: 0.5,
  git: 0.4
}
```

**3. Experience Match (10%)**
```javascript
_calculateExperienceMatch(profile, job) {
  const { min, max } = this._parseExperienceRange(job.description);
  const userExp = profile.yearsOfExperience;
  
  if (userExp >= min && userExp <= max) return 100;    // Perfect fit
  if (userExp < min) return (userExp / Math.max(min, 1)) * 100;  // Below requirement
  if (userExp > max) return 85;                         // Overqualified
  
  return 70;
}
```

**4. Seniority Match (10%)**
```javascript
_calculateSeniorityMatch(profile, job) {
  const jobText = job.description.toLowerCase();
  
  const levels = {
    intern: 10,
    fresher: 20,
    junior: 40,
    mid: 60,
    senior: 80,
    lead: 100
  };
  
  const userLevel = levels[profile.seniority.toLowerCase()] || 50;
  
  for (const [level, score] of Object.entries(levels)) {
    if (jobText.includes(level)) {
      if (userLevel >= score) return 100;
      return (userLevel / score) * 100;
    }
  }
  
  return 70;
}
```

**5. Industry Match (10%)**
```javascript
_calculateIndustryMatch(profile, job) {
  if (!profile.preferredIndustries?.length) return 0;
  
  const jobText = (job.description + " " + job.company).toLowerCase();
  const matches = profile.preferredIndustries.filter(
    industry => jobText.includes(industry.toLowerCase())
  ).length;
  
  return (matches / profile.preferredIndustries.length) * 100;
}
```

#### **Eligibility Filtering**
```javascript
_isEligible(userProfile, job) {
  const jobText = (job.description + " " + job.title).toLowerCase();
  const userExp = userProfile.yearsOfExperience || 0;
  const { min } = this._parseExperienceRange(jobText);
  
  // Reject: Fresher applying to 3+ years requirement
  if (userExp === 0 && min >= 3) return false;
  
  // Reject: No experience for Senior/Lead roles
  if (userExp === 0 && (jobText.includes("senior") || 
                        jobText.includes("lead") || 
                        jobText.includes("expert"))) {
    return false;
  }
  
  return true;
}
```

#### **Stack Detection & Penalty**
```javascript
stackCategories = {
  mern: ["react", "node", "mongodb", "express", "next.js"],
  php: ["php", "laravel"],
  dotnet: [".net", "c#", "asp.net"],
  java: ["java", "spring"],
  python: ["python", "django", "flask"]
};

// If user is MERN but job is Java → -25 penalty
if (userStack !== "general" && jobStack !== "general" && userStack !== jobStack) {
  totalScore -= 25;
}
```

#### **Match Labels**
```javascript
_getMatchLabel(score) {
  if (score >= 85) return "Excellent Fit";        🟢
  if (score >= 70) return "Strong Match";         🔵
  if (score >= 55) return "Potential Match";      🟠
  if (score >= 40) return "Weak Match";           🟡
  return "Low Relevance";                         🔴
}
```

---

## 🎯 Two Frontend Pages

### Page 1: `/job-match` (NEW - Profile-Based)

**File:** `client/app/job-match/page.tsx`

**Purpose:** Primary job board for authenticated users with complete profile

**Route:** `GET /job-match`

**API Endpoint:** `GET /api/jobs/recommendations` (no resumeId)

**Data Source:** `UserJobProfile` collection (new architecture)

**Key Features:**
- ✅ Force refresh button (with cache bypass)
- ✅ Shows cache status (isCached, lastFetched, expiresAt)
- ✅ Shows profile completeness percentage
- ✅ Shows average match score across all jobs
- ✅ Animated UI with Framer Motion (staggered card animations)
- ✅ Search by both title AND company
- ✅ Sort by best match or newest first
- ✅ Rich header with metrics dashboard

**State:**
```javascript
const [jobs, setJobs] = useState<any[]>([]);
const [userProfile, setUserProfile] = useState<any>(null);
const [cacheInfo, setCacheInfo] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [search, setSearch] = useState("");
const [sort, setSort] = useState("best");
const [isRefreshing, setIsRefreshing] = useState(false);
```

**Fetch Logic:**
```javascript
const fetchPersonalizedJobs = async (forceRefresh = false) => {
  setIsRefreshing(true);
  const result = await jobMatchingAPI.getPersonalizedJobs(forceRefresh);
  
  if (result.success) {
    setJobs(normalizeJobs(result.data.jobs || []));
    setUserProfile(result.data.userProfile);
    setCacheInfo(result.data.cacheInfo);
    setError(null);
  }
  setIsRefreshing(false);
};
```

**Filtering Logic:**
```javascript
const filteredJobs = useMemo(() => {
  const query = search.toLowerCase();
  
  // Search by title OR company
  let filtered = jobs.filter((job) => {
    const title = job?.title?.toLowerCase() || "";
    const company = job?.company?.toLowerCase() || "";
    return title.includes(query) || company.includes(query);
  });
  
  // Sort
  if (sort === "best") {
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } else {
    filtered.reverse();  // Newest first (original order)
  }
  
  return filtered;
}, [jobs, search, sort]);
```

**Metrics:**
```javascript
const avgScore = Math.round(
  jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / jobs.length
);

const bestScore = Math.max(...jobs.map((j) => j.matchScore || 0));
```

**UI Components:**
- Command center header with hero title
- Metrics cards: avg score, role count, profile completeness
- Search input with ⌘K hint
- Sort dropdown (Best Match / Newest First)
- Refresh button with spinner
- Job grid with Framer Motion animations
- Error display with icon
- Empty state message

---

### Page 2: `/job-match/[id]` (LEGACY - Resume-Based)

**File:** `client/app/job-match/[id]/page.tsx`

**Purpose:** Backward compatibility + direct resume sharing (legacy system)

**Route:** `GET /job-match/:resumeId` (where `:resumeId` is URL parameter)

**API Endpoint:** `GET /api/jobs/recommendations/:resumeId` (with resumeId)

**Data Source:** `Resume` collection (legacy architecture)

**Key Features:**
- ❌ No refresh button
- ❌ No cache info display
- ❌ No profile completeness
- ❌ No animations (simpler, faster)
- ✅ Search by title only
- ✅ Sort by best match or by date
- ✅ Back to Dashboard navigation
- ✅ URL-shareable (can send `/job-match/resume_id_here` to others)

**State:**
```javascript
const [jobs, setJobs] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [matchScore, setMatchScore] = useState<number>(0);
const [search, setSearch] = useState("");
const [sort, setSort] = useState("best");
```

**Fetch Logic:**
```javascript
useEffect(() => {
  if (!resumeId || resumeId === "undefined") return;
  
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/api/jobs/recommendations/${resumeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    const result = await response.json();
    if (result.success) {
      setJobs(result.data);
      if (result.matchScore !== undefined) {
        setMatchScore(result.matchScore);
      }
    }
  };
  
  fetchJobs();
}, [resumeId]);
```

**Filtering Logic:**
```javascript
const filteredJobs = useMemo(() => {
  // Search by title only (not company)
  let filtered = jobs.filter((job) =>
    (job.title ?? '').toLowerCase().includes(search.toLowerCase())
  );
  
  // Sort
  if (sort === "best") {
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } else if (sort === "recent") {
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  return filtered;
}, [jobs, search, sort]);
```

**Metrics:**
```javascript
const avgScore = Math.round(
  jobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / jobs.length
);

const bestScore = Math.max(...jobs.map((j) => j.matchScore || 0));
```

**UI Components:**
- Simple header with back navigation
- Title and tagline
- Search input
- Sort dropdown (Best Match / Most Recent)
- Job grid (no animations)
- Error display
- Empty state message

---

## 🔗 Backend Controllers & Routes

### Job Recommendations Route (Legacy)

**File:** `server/routes/job.routes.js`

```javascript
router.get("/recommendations/:resumeId", auth, getRecommendedJobs);
```

**Controller:** `server/controllers/job.controller.js`

```javascript
exports.getRecommendedJobs = asyncHandler(async (req, res, next) => {
  const { resumeId } = req.params;
  
  // 1. Validate & fetch resume
  const resume = await Resume.findById(resumeId);
  
  // 2. Check if analyzed
  if (!resume.extractedProfile) {
    return next(new AppError("Resume not analyzed", 400));
  }
  
  // 3. Extract role & seniority
  const { role, seniority } = resume.extractedProfile;
  
  // 4. Fetch jobs
  const jobs = await fetchJobsFromAdzuna(role, seniority);
  
  // 5. Response
  res.json({
    success: true,
    count: jobs.length,
    matchScore: report?.atsScore || 85,
    data: jobs
  });
});
```

### Personalized Jobs Route (New)

**File:** `server/routes/job.routes.js`

```javascript
router.get("/recommendations", auth, jobMatchingController.getPersonalizedJobs);
```

**Controller:** `server/controllers/jobMatching.controller.js`

```javascript
exports.getPersonalizedJobs = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  const { forceRefresh = false } = req.query;
  
  // 1. Get user profile
  const profile = await UserJobProfile.findOne({ userId });
  
  // 2. Check completeness
  if (profile.profileCompleteness < 30) {
    return next(new AppError("Profile incomplete", 400));
  }
  
  // 3. Fetch jobs (cache-aware)
  const jobs = await jobCacheService.getJobsWithCache(
    profile.primaryRole,
    profile.seniority,
    forceRefresh === "true"
  );
  
  // 4. Rank jobs
  const rankedJobs = jobRankingEngine.rankJobs(profile, jobs);
  
  // 5. Transform (ensure id field)
  const transformedJobs = rankedJobs.map((job) => ({
    ...job,
    id: job._id || job.id || job.jobId,
  }));
  
  // 6. Update metadata
  profile.metadata.lastJobFetch = new Date();
  profile.metadata.totalJobsViewed += transformedJobs.length;
  await profile.save();
  
  // 7. Response
  res.json({
    success: true,
    data: {
      jobs: transformedJobs,
      count: transformedJobs.length,
      userProfile: {
        primaryRole: profile.primaryRole,
        seniority: profile.seniority,
        yearsOfExperience: profile.yearsOfExperience,
        profileCompleteness: profile.profileCompleteness,
      },
      cacheInfo: {
        isCached: !(forceRefresh === "true"),
        lastFetched: transformedJobs[0]?.createdAt,
        expiresAt: transformedJobs[0]?.expiresAt,
      },
    },
  });
});
```

---

## 📊 Data Models

### UserJobProfile Schema

**File:** `server/model/UserJobProfile.js`

```javascript
{
  userId: ObjectId (unique),
  
  // Primary Identity
  primaryRole: String,                    // "MERN Developer"
  seniority: enum['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'],
  yearsOfExperience: Number,
  
  // Skills
  skills: [{
    name: String,
    proficiency: enum['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    yearsUsed: Number,
    frequency: enum['Rarely', 'Sometimes', 'Frequently', 'Daily'],
    lastMentioned: Date
  }],
  
  // Preferences
  preferredRoles: [String],
  preferredIndustries: [String],
  companySize: enum['Any', 'Startup', 'Scale-up', 'Enterprise'],
  workModel: enum['Remote', 'On-site', 'Hybrid', 'Any'],
  targetSeniority: enum['Any', 'Lateral Move', 'Growth', 'Leadership'],
  
  // Metrics
  profileCompleteness: Number (0-100),
  
  // Metadata
  metadata: {
    lastJobFetch: Date,
    totalJobsViewed: Number,
    lastProfileUpdate: Date
  },
  
  // Analysis history
  analysisHistory: [{
    resumeId: ObjectId,
    extractedRole: String,
    matchedSkills: [String],
    newSkills: [String],
    analyzedAt: Date,
    confidence: Number
  }]
}
```

### Resume Schema (Legacy)

**File:** `server/model/Resume.js`

```javascript
{
  userId: ObjectId,
  filename: String,
  fileUrl: String (Cloudinary),
  
  extractedProfile: {
    role: String,
    seniority: String,
    skills: [String],
    experience: Number,
    // ... other extracted fields
  },
  
  uploadedAt: Date,
  analyzedAt: Date
}
```

### JobCache Schema

**File:** `server/model/JobCache.js`

```javascript
{
  jobId: String,
  queryKey: String,           // "mern-developer-mern-junior"
  title: String,
  company: String,
  description: String,
  salary: String,
  location: String,
  link: String,
  cachedAt: Date,
  expiresAt: Date,            // TTL for cache expiry
  source: String              // "Adzuna"
}
```

---

## 🔄 Complete Data Flow Diagram

```
USER FLOW (Page 1 - Authenticated)
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User visits /job-match                                           │
│    ↓                                                                  │
│ 2. useEffect calls fetchPersonalizedJobs()                         │
│    ↓                                                                  │
│ 3. API call: GET /api/jobs/recommendations (no params)             │
│    ↓ (Backend)                                                       │
│ 4. Controller: jobMatchingController.getPersonalizedJobs()         │
│    └─ Get UserJobProfile from DB                                    │
│    └─ Extract primaryRole & seniority                               │
│    └─ Call: jobCacheService.getJobsWithCache()                     │
│       ├─ Check Cache (query key exists? not expired?)              │
│       ├─ HIT: Return cached jobs                                    │
│       └─ MISS: Call fetchJobsFromAdzuna()                           │
│          └─ API call to Adzuna                                      │
│          └─ Cache results in DB                                     │
│    └─ Call: jobRankingEngine.rankJobs()                            │
│       ├─ Filter by eligibility                                      │
│       ├─ Calculate match scores (5 factors)                         │
│       └─ Sort by matchScore DESC                                    │
│    └─ Transform jobs (ensure id field)                              │
│    └─ Update profile metadata                                       │
│    └─ Return response with cache info                               │
│    ↑ (Frontend)                                                      │
│ 5. React: setJobs(result.data.jobs)                                 │
│    ↓                                                                  │
│ 6. useMemo: Filter by search + sort                                 │
│    ↓                                                                  │
│ 7. Render JobCard components with match badges                      │
│    ↓                                                                  │
│ 8. User interactions:                                               │
│    • Search by title/company                                        │
│    • Sort by best match / newest                                    │
│    • Click refresh (forceRefresh=true)                              │
│    • Save/bookmark job                                              │
│    • Apply Now (opens Adzuna link)                                  │
└─────────────────────────────────────────────────────────────────────┘

LEGACY USER FLOW (Page 2 - Resume-Based)
┌─────────────────────────────────────────────────────────────────────┐
│ 1. User visits /job-match/resume_abc123                             │
│    ↓                                                                  │
│ 2. useEffect resolves params and calls fetchJobs()                 │
│    ↓                                                                  │
│ 3. API call: GET /api/jobs/recommendations/resume_abc123           │
│    ↓ (Backend)                                                       │
│ 4. Controller: job.controller.getRecommendedJobs()                 │
│    └─ Fetch Resume from DB by resumeId                             │
│    └─ Extract role & seniority from resume.extractedProfile         │
│    └─ Call: fetchJobsFromAdzuna(role, seniority)                   │
│    └─ Return jobs (no ranking, no caching)                          │
│    ↑ (Frontend)                                                      │
│ 5. React: setJobs(result.data)                                      │
│    ↓                                                                  │
│ 6. useMemo: Filter by search (title only) + sort                    │
│    ↓                                                                  │
│ 7. Render JobCard components                                        │
│    ↓                                                                  │
│ 8. User interactions: Search, sort, apply                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📈 Why Two Pages?

| Aspect | Page 1 (/job-match) | Page 2 (/job-match/[id]) |
|--------|-------------------|----------------------|
| **Architecture** | New (Profile-Based) | Legacy (Resume-Based) |
| **User Type** | Authenticated, full profile | Direct resume access |
| **Use Case** | Primary job board | Backward compatibility |
| **Features** | Rich, interactive | Simple, direct |
| **Caching** | Yes (intelligent) | No (direct fetch) |
| **Ranking** | Yes (5 factors) | No (just fetch) |
| **Sharing** | Not directly URL | Yes (resume link) |
| **Refresh** | Yes (force refresh) | No (static) |
| **Animations** | Framer Motion | Simple |
| **Search Scope** | Title + company | Title only |
| **Status** | Active development | Maintenance mode |

---

## 🎯 Key Insights

1. **Ranking is Critical** - Skills match (40%) + role match (30%) = 70% of score
2. **Stack Detection** - Tech stack mismatch = -25 point penalty
3. **Caching is Smart** - Avoids repeated Adzuna calls, saves costs
4. **Dual Architecture** - Old system (resume) + new system (profile) coexist
5. **Eligibility Matters** - Filters out unsuitable candidates before ranking
6. **Experience Range Parsing** - Extracts min/max years from job description using regex

---

## 🚀 API Endpoints Summary

| Endpoint | Method | Purpose | Data Source |
|----------|--------|---------|------------|
| `/api/jobs/recommendations` | GET | Get personalized jobs for logged-in user | UserJobProfile |
| `/api/jobs/recommendations/:resumeId` | GET | Get jobs for specific resume (legacy) | Resume |
| `/api/jobs/profile` | GET | Get user's career profile | UserJobProfile |
| `/api/jobs/profile/preferences` | PUT | Update job preferences | UserJobProfile |

---

## 🔧 Environment Variables Required

```
ADZUNA_APP_ID=your_adzuna_id
ADZUNA_APP_KEY=your_adzuna_key
```

---

## 📝 Notes

- Both pages fetch from Adzuna API (50 jobs per query)
- Cache expires automatically (TTL-based)
- Match scores are deterministic (same profile = same scores)
- Ranking engine is extensible (easy to add new factors)
- Stack detection helps with tech stack alignment
- UI components (JobCard) shared between both pages
