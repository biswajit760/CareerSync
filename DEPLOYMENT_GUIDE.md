# CareerSync Job Matching Engine - Deployment Guide

## Pre-Deployment Checklist

### Code Review Phase
- [ ] Review `constraintFilter.service.js` for logic correctness
- [ ] Review `jobRanking.service.js` refactoring
- [ ] Verify backward compatibility (API response structure unchanged)
- [ ] Check for any missing error handling
- [ ] Verify all new tech stacks are covered (MERN, PHP, Java, .NET, Python)

### Testing Phase

#### Unit Tests
```bash
# Run constraint filter tests
node server/services/constraintFilter.test.js

# Expected output:
# ✅ PASSED: Test 1 - Seniority Leakage Fix
# ✅ PASSED: Test 2 - Stack Pollution Fix
# ✅ PASSED: Test 3 - Score Distribution
```

#### Integration Tests
- [ ] Test with real user profiles in staging
- [ ] Verify score distributions match expectations
- [ ] Check that hard-gate rejections are working
- [ ] Verify soft constraints apply penalties correctly
- [ ] Test with edge cases (no skills, unknown stack, etc.)

#### Performance Tests
- [ ] Benchmark job matching speed (should be faster)
- [ ] Test with 1000+ jobs per search
- [ ] Monitor memory usage
- [ ] Check for any N+1 query issues

### Data Verification
- [ ] Verify all user profiles have seniority levels
- [ ] Ensure job descriptions have experience ranges
- [ ] Check for any malformed job data that might break parsing

---

## Deployment Steps

### 1. Pre-Production Testing (Day 1-2)

```bash
# Deploy to staging environment
git checkout constraint-based-refactor
npm install
npm run build

# Run full test suite
npm test

# Deploy to staging
npm run deploy:staging

# Monitor logs for errors
tail -f logs/staging.log
```

### 2. Staging Validation (Day 2-3)

- [ ] Create test accounts with different seniority levels
- [ ] Verify Fresher accounts don't see Senior/Lead roles
- [ ] Create MERN/Java/PHP test profiles
- [ ] Verify stack-specific filtering works
- [ ] Check score distributions in database
- [ ] Monitor API response times

**Example Test Queries**:

```javascript
// Test 1: Fresher stack pollution check
GET /api/jobs/personalized
Headers: { userId: 'fresher-test-1' }
Expected: No "Lead" or "Senior" titles

// Test 2: MERN stack check
GET /api/jobs/personalized
Headers: { userId: 'mern-dev-test-1' }
Expected: No Java, PHP, .NET titles

// Test 3: Score distribution check
GET /api/jobs/personalized
Headers: { userId: 'any-user' }
Expected: Most matches 60-100, some <50, none 30-40%
```

### 3. Gradual Rollout (Day 3-7)

#### Phase 1: Canary Deployment (10% of users)
```bash
# Route 10% of traffic to new engine
# Route 90% to old engine (rollback ready)

# Monitor metrics:
# - API response time
# - Error rates
# - User engagement (clicks, applies)
# - Job quality feedback
```

#### Phase 2: Expanded Rollout (50% of users)
```bash
# If Phase 1 metrics are good:
# - Route 50% to new engine
# - Monitor same metrics
# - Collect user feedback
```

#### Phase 3: Full Rollout (100% of users)
```bash
# Once confident:
# - Route 100% to new engine
# - Keep old engine in code for quick rollback
# - Monitor for 24-48 hours
```

### 4. Post-Deployment Monitoring (Day 7+)

#### Key Metrics to Track

1. **Hard Gate Rejections**
   ```
   - Seniority rejections: Should be 10-30% of jobs
   - Stack rejections: Should be 15-40% of jobs
   - Experience rejections: Should be 5-15% of jobs
   ```

2. **Score Distribution**
   ```
   - 90-100: 5-10% of remaining jobs
   - 75-89: 15-25% of remaining jobs
   - 60-74: 20-35% of remaining jobs
   - 50-59: 15-25% of remaining jobs
   - <50: Should be rare (mostly hard-gate rejects)
   ```

3. **User Engagement**
   ```
   - Clicks per job (should increase - better matches)
   - Applications per job (should increase)
   - Job quality feedback (should improve)
   - Time to find suitable job (should decrease)
   ```

4. **API Performance**
   ```
   - Response time: Should be ≤500ms for 100 jobs
   - Error rate: Should be <0.1%
   - P95 latency: Should be <750ms
   ```

---

## Rollback Plan

### If Issues Detected

```bash
# Immediate rollback (under 5 minutes)
git revert <commit-hash>
npm run deploy:production

# Verify old system is active
curl http://api.careersync.com/health
Expected: { engine: "fuzzy-scoring" }
```

### Rollback Triggers

Roll back immediately if:
- [ ] Error rate exceeds 1%
- [ ] API response time exceeds 2 seconds
- [ ] Users report not seeing any jobs
- [ ] Users report seeing clearly wrong jobs (e.g., Fresher seeing Lead roles)
- [ ] Database errors detected
- [ ] Memory/CPU spike beyond normal range

### Rollback Communication

```
1. Alert team on Slack
2. Create incident ticket
3. Communicate with affected users
4. Root cause analysis within 24 hours
```

---

## Runbook for Issues

### Issue: Too Many Jobs Being Rejected (Hard Gates Too Strict)

**Symptoms**: Users seeing 10-20 jobs instead of 50+

**Diagnosis**:
```javascript
const result = constraintFilter._checkConstraints(profile, job);
console.log(result.seniorityReason);
console.log(result.stackReason);
console.log(result.experienceReason);
```

**Solutions**:
1. Adjust hard gate thresholds in `constraintFilter.service.js`
2. Soften seniority boundaries (allow 1 more level)
3. Increase experience flexibility (allow 2 years below minimum)
4. Add more "general" stack jobs

### Issue: Users Still Seeing Wrong Jobs (Hard Gates Too Loose)

**Symptoms**: Freshers still seeing Lead roles; MERN devs seeing Java

**Diagnosis**: Check constraint detection logic
```javascript
const seniorityDetected = constraintFilter._detectJobSeniority(jobText);
const stackDetected = constraintFilter._detectJobStack(jobText);
console.log(`Detected: ${seniorityDetected}, ${stackDetected}`);
```

**Solutions**:
1. Improve keyword detection in job text
2. Add missing seniority keywords
3. Add missing tech stack indicators
4. Check job parser is extracting text correctly

### Issue: Score Clumping Still Present

**Symptoms**: Scores still clustering at 30-40%

**Diagnosis**: Constraints aren't filtering enough
```javascript
const hardGateRejections = ranked_jobs.filter(j => j.constraintFailures.length > 0);
console.log(`${hardGateRejections.length} jobs still passing with failures`);
```

**Solutions**:
1. Verify hard constraints are being applied
2. Check that hard-gate rejections are working
3. Review soft constraint penalties
4. Adjust weight distributions in scoring

---

## Monitoring Dashboard

### Create Grafana Dashboard

**Panels to Add**:

1. **Rejection Rate by Gate**
   ```
   - Seniority gate: % jobs rejected
   - Stack gate: % jobs rejected
   - Experience gate: % jobs rejected
   ```

2. **Score Distribution**
   ```
   - Histogram of match scores
   - Expected: Normal distribution 50-100, peak at 70-80
   - Bad: Bimodal (many rejects + clumping)
   ```

3. **API Performance**
   ```
   - Response time 50th/95th/99th percentile
   - Error rate
   - Jobs per search
   ```

4. **User Satisfaction**
   ```
   - Jobs clicked per user
   - Applications per user
   - User rating of matches (if available)
   ```

---

## Documentation Updates

After deployment, update:

- [ ] API documentation (response fields)
- [ ] Troubleshooting guide
- [ ] User-facing job quality FAQ
- [ ] Admin guide for constraint tuning
- [ ] Team knowledge base

---

## Success Criteria

The deployment is **successful** if:

1. **Seniority Leakage Fixed** ✓
   - Freshers never see Lead roles in results
   - 0 complaints about inappropriate seniority

2. **Stack Pollution Fixed** ✓
   - MERN devs don't see Java/PHP in results
   - 0 complaints about wrong tech stacks

3. **Score Clumping Fixed** ✓
   - Scores distributed 50-100 (not 30-40)
   - Users report better job quality

4. **Performance Maintained** ✓
   - API response time ≤500ms
   - Error rate <0.1%
   - No degradation vs. old system

5. **User Engagement Improved** ✓
   - Clicks per job increase 20%+
   - Applications per job increase 15%+
   - User satisfaction improves

---

## Post-Deployment Optimization

### Week 1-2: Monitor and Stabilize
- Watch metrics daily
- Respond to user feedback
- Fine-tune constraint boundaries

### Week 2-4: Collect Feedback
- Survey users on job quality
- Analyze engagement patterns
- Identify any remaining edge cases

### Month 2: Optimization
- Adjust weights based on user feedback
- Add more tech stacks if needed
- Improve keyword detection
- Consider ML-based learning

---

## Contact & Escalation

**Issues During Deployment**:
- Slack: #careersync-deployment
- On-call: DevOps team
- Escalation: Engineering lead + Product lead

**Questions About Refactoring**:
- Read: `CONSTRAINT_BASED_REFACTOR_GUIDE.md`
- Contact: Architecture team

**Data Issues**:
- Database team: #db-support
- Analytics: #analytics

