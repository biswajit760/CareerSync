# CareerSync Job Matching Engine - Architectural Refactor

## Overview

This document explains the architectural refactor from **Fuzzy Scoring** to **Constraint-Based Filtering**.

## Problems Solved

### 1. **Seniority Leakage**
**Problem**: Freshers were seeing "Lead" and "Instructor" roles
- **Root Cause**: System only penalized seniority mismatches rather than hard-blocking them
- **Solution**: Implemented **hard seniority gates** that reject jobs above user's seniority boundary

### 2. **Stack Pollution**
**Problem**: MERN developers receiving Java and PHP roles
- **Root Cause**: "Full Stack" was treated as a generic term, not specific tech stacks
- **Solution**: Implemented **tech stack constraints** that only allow jobs matching known stacks

### 3. **Score Clumping**
**Problem**: Most jobs hovering between 30-40%, making "Match" badge meaningless
- **Root Cause**: Fuzzy scoring gave points to almost everything; no aggressive filtering
- **Solution**: Only score jobs that pass hard constraints, leading to meaningful distribution (50-100)

---

## Architecture Changes

### Old System: Fuzzy Scoring
```
Jobs → Penalty-based scoring → All jobs get scored → Results clump at 30-40%
```

### New System: Constraint-Based Filtering
```
Jobs → Hard constraints (block bad matches) → Soft constraints (penalize) → Score (only good matches) → Better distribution
```

---

## How It Works

### Step 1: Hard Constraints (Must Pass)
Jobs are **rejected immediately** if they violate hard constraints:

#### Hard Gate 1: Seniority Boundary
- **Fresher**: Can only see Fresher/Junior roles
- **Junior**: Can see Fresher/Junior/Mid-Level roles
- **Mid-Level**: Can see Junior/Mid-Level/Senior roles
- **Senior**: Can see Mid-Level/Senior/Lead roles
- **Lead**: Can see Senior/Lead roles

**Effect**: Freshers NEVER see "Lead" roles (rejected at gate, never scored)

#### Hard Gate 2: Experience Requirement
- If user has too little experience for the role, reject
- Allow 1 year of flexibility below minimum requirement
- Example: If role requires 3+ years and user has 2, reject

#### Hard Gate 3: Tech Stack Compatibility
- Detect user's primary tech stack (MERN, PHP, Java, .NET, Python, or general)
- Detect job's tech stack
- **MERN users can only see MERN/general jobs** (Java/PHP jobs rejected)
- **Java developers can only see Java/general jobs** (PHP/MERN jobs rejected)

**Effect**: MERN developers NEVER see Java/PHP jobs (rejected at gate)

### Step 2: Soft Constraints (Penalties)
Jobs that pass hard constraints can be penalized (but not rejected):

#### Soft Penalty 1: Role Misalignment
- Looking for "Frontend Developer" but job says "Backend Developer"?
- Penalty: -15 points (but job still scores)

#### Soft Penalty 2: Banned Keywords
- Job requires banned tech for user's stack (e.g., "Some Java" in MERN-specific role)
- Penalty: -20 points (job still scores, but reduced)

### Step 3: Scoring (Only for Jobs That Pass)
Jobs that pass hard constraints get scored based on:

| Component | Weight | Score Range |
|-----------|--------|------------|
| Stack Alignment | 35% | 0-100 |
| Role Match | 25% | 0-100 |
| Skill Match | 20% | 0-100 |
| Experience Match | 12% | 0-100 |
| Seniority Proximity | 8% | 0-100 |

**Weighted Score**: `sum(component_score × weight) - penalties`

### Step 4: Sorting & Distribution
Results sorted by score. Expected distribution:

- **90-100**: Excellent Fit (perfect match)
- **75-89**: Strong Match (very relevant)
- **60-74**: Good Match (relevant, minor gaps)
- **50-59**: Acceptable Match (adequate, some gaps)
- **<50**: Weak Match (should be rare now)

---

## Score Distribution Improvement

### Before (Fuzzy Scoring)
```
All scores clustered at 30-40% range
- Hard to distinguish between jobs
- "Match" badge lost meaning
- Many false positives
```

### After (Constraint-Based)
```
- 0-5% of jobs: Excellent Fit (90-100)
- 10-20% of jobs: Strong Match (75-89)
- 20-30% of jobs: Good Match (60-74)
- 10-20% of jobs: Acceptable (50-59)
- ~50% of jobs: Rejected (hard gates)
```

This is **realistic and meaningful**. Bad matches are hard-blocked, not given mediocre scores.

---

## Implementation Details

### File Structure

#### 1. **constraintFilter.service.js** (NEW)
Main constraint-based filtering engine
- `filterAndScoreJobs()` - Main entry point
- `_checkConstraints()` - Check hard & soft constraints
- `_calculateScore()` - Score jobs that pass constraints
- Tech stack definitions
- Seniority hierarchy definitions

#### 2. **jobRanking.service.js** (REFACTORED)
Now delegates all logic to constraintFilter
- `rankJobs()` - Entry point (delegates to constraintFilter)
- Legacy methods kept as stubs (deprecated but non-breaking)

#### 3. **jobMatching.controller.js** (NO CHANGES)
Uses the same API, works transparently with new engine

---

## Migration Guide

### For Developers

The API is **100% backward compatible**. No code changes needed:

```javascript
// Old API still works
const rankedJobs = jobRankingEngine.rankJobs(userProfile, jobs);

// Output still has same structure
jobs[0] = {
  _id: "...",
  title: "...",
  matchScore: 85,              // 0-100, now meaningful
  matchLabel: "Strong Match",  // Now better distributed
  scoreBreakdown: {            // Detailed breakdown
    stackAlignment: 100,
    roleMatch: 90,
    skillMatch: 85,
    experienceMatch: 90,
    seniorityProximity: 100,
  },
  constraintFailures: [],      // NEW: Why job didn't match better
  detectedStack: "mern",       // NEW: Detected user stack
  jobStack: "mern",            // NEW: Detected job stack
}
```

### For QA

Test cases to verify improvements:

1. **Seniority Leakage Fix**
   - Create Fresher profile
   - Search jobs
   - Verify NO "Lead" or "Senior" roles in results
   - Verify results start at "Junior" roles

2. **Stack Pollution Fix**
   - Create MERN developer profile (React, Node, MongoDB)
   - Search jobs
   - Verify NO Java, PHP, or .NET roles in results
   - Verify results are MERN-specific

3. **Score Distribution Fix**
   - Compare score distribution before/after
   - Before: ~90% of jobs at 30-40%
   - After: ~50% jobs rejected, remaining well-distributed (50-100)

---

## Performance Considerations

### Time Complexity
- Per job: O(n) where n = number of skills in profile
- For 100 jobs × 10 skills ≈ 1000 operations
- **Faster than before** (early filtering prevents unnecessary scoring)

### Memory Usage
- Minimal overhead (constraint definitions are static)
- No additional caching needed (constraint filter is stateless)

---

## Future Enhancements

### Phase 2: User Feedback Loop
- Track which jobs users click/ignore
- Learn better stack definitions per user
- Adjust constraint boundaries based on user acceptance

### Phase 3: Machine Learning
- Train model on accepted/rejected jobs
- Predict which constraint boundaries are optimal
- Personalize scoring weights per user

### Phase 4: Constraint Customization
- Allow users to create custom constraints
- Example: "Exclude startups" or "Require remote"
- Store as part of user profile preferences

---

## Debugging

### Understanding Why a Job Was Rejected

Check the API response:

```javascript
// If job has matchScore = 0 and missing fields:
// → Rejected by hard constraints

// Check the filter function output:
const result = constraintFilter._checkConstraints(profile, job);
console.log(result.seniorityReason);  // Seniority gate failure
console.log(result.stackReason);      // Stack gate failure
console.log(result.experienceReason); // Experience gate failure
```

### Verifying Stack Detection

```javascript
const userStack = constraintFilter._detectUserStack(profile);
const jobStack = constraintFilter._detectJobStack(jobText);

console.log(`User stack: ${userStack}`);  // Should be MERN, Java, etc.
console.log(`Job stack: ${jobStack}`);    // Should be MERN, Java, etc.
```

---

## Maintenance Checklist

- [ ] Monitor score distributions (should be wider than before)
- [ ] Track hard-gate rejection rates (should be 40-60%)
- [ ] Gather user feedback on job quality
- [ ] Adjust hard-gate boundaries if needed
- [ ] Add new tech stacks as they emerge
- [ ] Review seniority hierarchy annually

---

## Questions & Support

For questions about the refactoring:
1. Check constraint definitions in `constraintFilter.service.js`
2. Review score breakdown in API response
3. Debug using `_checkConstraints()` and `_calculateScore()`

