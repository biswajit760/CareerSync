# 🔧 Troubleshooting: No Jobs Found Issue

## Problem
The job matching pages show "No matching jobs found" or "0 Roles".

## Root Causes & Solutions

### Cause 1: User Profile Incomplete
**Symptoms**:
- UI shows "0 Roles"
- Message: "Please complete your profile..."

**Solution**:
1. Go to "Analyze Resume" page
2. Upload a resume or fill in your profile manually
3. Ensure you have:
   - ✓ Primary role set (e.g., "Frontend Developer")
   - ✓ Seniority level selected (e.g., "Junior")
   - ✓ Years of experience entered
   - ✓ At least one skill added

**Check in Database**:
```bash
# Connect to MongoDB
db.userjobprofiles.findOne({ userId: "your-user-id" })

# Look for:
# - primaryRole: Should not be empty
# - seniority: Should be one of [Fresher, Junior, Mid-Level, Senior, Lead]
# - yearsOfExperience: Should be a number
# - skills: Should be an array with at least one item
```

### Cause 2: Job Cache Empty
**Symptoms**:
- Message: "No jobs found for your roles. Try adjusting your search..."
- Profile looks complete

**Solution**:
1. Check if Adzuna API is reachable
2. Try "Force Refresh" on the job matching page
3. Check server logs for API errors

**Check in Database**:
```bash
# Check if any jobs are cached
db.jobcaches.count()  # Should be > 0

# Check for specific role
db.jobcaches.find({ queryKey: "frontend-developer-mern-junior" }).count()
```

### Cause 3: Constraint Filter Too Strict
**Symptoms**:
- Profile and jobs exist in database
- But still "No matching jobs found"

**Solution**:
- This is now fixed! The constraint filter now:
  - ✓ Only applies hard gates for complete profiles
  - ✓ Uses fallback scoring for incomplete profiles
  - ✓ Allows "general" and "undetected" stacks through

### Cause 4: Browser Cache Issue
**Symptoms**:
- Fix applied but UI still shows old data

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete on Windows)
2. Or do hard refresh (Ctrl+Shift+R)
3. Or open in new incognito window

---

## Step-by-Step Debugging

### Step 1: Check User Profile
```bash
# In server terminal, check logs when fetching jobs
# Look for lines like:
# "Filtering X jobs for profile: { role: 'Frontend Developer', ... }"
```

### Step 2: Check Job Fetching
```bash
# Look for logs:
# "Fetching jobs for roles: ['Frontend Developer']"
# "Frontend Developer: X jobs fetched"
```

### Step 3: Check Job Cache
```bash
# Connect to MongoDB shell
mongosh

# Check cache
db.jobcaches.find().limit(5)

# Check specific query
db.jobcaches.find({ 
  queryKey: /frontend.*junior/i 
}).count()
```

### Step 4: Check Constraint Filter
```bash
# Look for logs in server:
# "Filtering complete: X total → Y matched"
# This shows how many jobs passed constraints
```

---

## Quick Fixes

### Fix 1: Complete Your Profile
1. Upload a resume on "Analyze Resume" page, OR
2. Fill profile manually:
   - Click your avatar (top-right)
   - Go to Settings/Profile
   - Add role, seniority, years, skills

### Fix 2: Force Refresh Cache
1. On "Job Match" page
2. Look for refresh icon (⟳)
3. Click it to force-fetch fresh jobs

### Fix 3: Check Connectivity
```bash
# In browser console (F12)
fetch('/api/jobs/personalized')
  .then(r => r.json())
  .then(d => console.log(d))

# Check response:
# - success: true/false
# - data.jobs: Should be an array
# - data.count: Should be > 0 if jobs exist
```

### Fix 4: Clear Cache
```bash
# Via MongoDB shell
db.jobcaches.deleteMany({})  # Delete all cached jobs
# Next search will force-fetch fresh jobs
```

---

## How to Read Server Logs

### Good Logs (Jobs Found)
```
Filtering 50 jobs for profile: { role: 'Frontend Developer', seniority: 'Junior', skillsCount: 5 }
Fetching jobs for roles: ['Frontend Developer']
  Frontend Developer: 50 jobs fetched
Total jobs before dedup: 50, after dedup: 45
Filtering complete: 45 total → 28 matched
Ranking complete: 28 jobs ranked from 45 total
✓ Result: 28 jobs shown to user
```

### Bad Logs (No Jobs)
```
Filtering X jobs for profile: { role: undefined, seniority: 'Junior', skillsCount: 0 }
No roles in history, using primaryRole: undefined
No jobs to rank
✗ Result: 0 jobs (profile incomplete)
```

---

## Testing Checklist

- [ ] User profile has primaryRole
- [ ] User profile has seniority level
- [ ] User profile has yearsOfExperience
- [ ] User profile has at least 1 skill
- [ ] Job cache has entries (`db.jobcaches.count()` > 0)
- [ ] API returns jobs (`/api/jobs/personalized` shows jobs array)
- [ ] Constraint filter passes some jobs
- [ ] UI displays results

---

## Rollback if Critical

If new constraint filter causes issues:

```javascript
// In jobRanking.service.js, rankJobs method:
// Temporarily use old system:

rankJobs(userProfile, jobs) {
  // OLD: Use legacy scoring (for testing)
  return jobs
    .map(job => ({
      ...job,
      matchScore: 65, // Dummy score for testing
      matchLabel: "Test Mode",
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
```

---

## Common Issues & Fixes

| Issue | Check | Fix |
|-------|-------|-----|
| 0 Roles shown | Profile complete? | Complete profile on "Analyze Resume" |
| No jobs in cache | Adzuna API working? | Check API logs, retry fetch |
| Constraint filter rejects all | Logs show: filtering 50 → 0 | Check if profile missing fields |
| Old data in UI | Browser cache? | Ctrl+Shift+R hard refresh |
| Error 500 | Server logs | Check database connection |

---

## Getting Help

**Immediate**: Check server console logs (look for "Filtering", "Fetching", "Ranking" messages)
**Database**: Use MongoDB shell to verify data exists
**API**: Test `/api/jobs/personalized` directly in browser
**Code**: Review constraint filter logic in `constraintFilter.service.js`

