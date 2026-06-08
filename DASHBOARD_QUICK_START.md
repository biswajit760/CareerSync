# 🚀 Quick Start: Production Dashboard

## What's New

Your CareerSync dashboard is now **completely dynamic** with real data from your database. No more static mock data!

---

## ⚡ Quick Setup

### 1. Backend Setup
```bash
cd server
npm install  # If not already done
npm start    # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install  # If not already done
npm run dev  # Starts on http://localhost:3000
```

### 3. View Dashboard
Navigate to: **http://localhost:3000/dashboard**

---

## 🎯 What You'll See

### Real-Time Stats
- **ATS Score**: Your latest resume score from database
- **Saved Leads**: Count of jobs you've saved
- **AI Scans**: Number of analyses you've run
- **Market Fit**: Calculated from your profile & skills
- **Trends**: Week-over-week performance changes

### Dynamic Charts
- **Performance Trajectory**: 6-month historical data
- **Skill Radar**: Your skills vs. market demands
- **ATS Telemetry**: Score breakdown by category
- **Weekly Activity**: Last 7 days of scan activity

### Real Content
- **Saved Jobs**: Your actual saved job opportunities
- **Score Breakdown**: Keywords, Formatting, Experience, Projects
- **AI Insights**: Personalized recommendations
- **Activity Feed**: Recent scans and analyses

---

## 📊 Backend Endpoints

All endpoints require authentication (JWT token in Authorization header)

### 1. Full Dashboard Data
```
GET /api/dashboard/data
Response: {
  stats, userInfo, performanceTrajectory, 
  skillRadarData, atsBenchmark, weeklyApplications,
  savedJobsList, atsBreakdown, insights, lastUpdated
}
```

### 2. Quick Stats (Lightweight)
```
GET /api/dashboard/stats
Response: { stats }
Refreshes automatically every 30 seconds
```

### 3. Performance History
```
GET /api/dashboard/history?period=6M
Parameters: 1M, 3M, 6M, 1Y
Response: { trajectory, period }
```

---

## 🔧 Architecture

### How Data Flows
```
React Component
  ↓
useDashboardData hook
  ↓
Axios: GET /api/dashboard/data
  ↓
Backend Controller
  ↓
Parallel DB Queries (Promise.all):
  - User model
  - Latest AtsReport
  - Last 12 AtsReports
  - UserJobProfile
  - Recent Resumes
  ↓
Transform & Calculate:
  - Market fit percentage
  - Weekly growth trends
  - Monthly aggregation
  - AI insights generation
  ↓
Return JSON Response
  ↓
Components Render Real Data
```

---

## 📁 Key Files

### Backend Controllers
```
server/controllers/dashboard.controller.js    (NEW - 300+ lines)
  - getDashboardData()
  - getDashboardStats()
  - getPerformanceHistory()
```

### Backend Routes
```
server/routes/dashboard.routes.js             (NEW - 30 lines)
  - GET /api/dashboard/data
  - GET /api/dashboard/stats
  - GET /api/dashboard/history
```

### Frontend Hook
```
client/lib/useDashboardData.ts                (NEW - 100+ lines)
  - Custom React hook
  - Auto-fetch & refresh logic
  - Error handling
```

### Frontend Components
```
client/components/dashboard/StatCard.tsx      (REWRITTEN - 100+ lines)
client/components/dashboard/DashboardChart.tsx (NEW - 200+ lines)
```

### Dashboard Page
```
client/app/dashboard/page.tsx                 (COMPLETELY REWRITTEN - 400+ lines)
  - Uses real data from hook
  - Dynamic greeting
  - Real stats & charts
  - Error handling
```

---

## 🎨 Component Usage Examples

### StatCard
```tsx
<StatCard
  title="ATS Score"
  value={`${data?.stats.atsScore}%`}
  description={`${atsScoreTrend}% this week`}
  icon={Trophy}
  color="text-lime-400"
  backgroundColor="bg-lime-400/10"
  borderColor="group-hover:border-lime-500/30"
  trend={{ direction: 'up', percentage: 12 }}
  loading={loading}
/>
```

### Area Chart
```tsx
<DashboardAreaChart
  title="Performance Trajectory"
  description="Historical ATS pass rate tracking"
  data={data?.performanceTrajectory || []}
  dataKey="score"
  height={300}
  gradient={true}
  loading={loading}
/>
```

### Radar Chart
```tsx
<DashboardRadarChart
  title="Skill Topology"
  description="Your profile vs. market expectations"
  data={data?.skillRadarData || []}
  angleDataKey="skill"
  dataKeys={[
    { key: 'user', color: '#a3e635' },
    { key: 'market', color: '#52525b' }
  ]}
  loading={loading}
/>
```

---

## 🔄 Data Refresh

### Automatic
- Dashboard data loads on page mount
- Stats auto-refresh every 30 seconds
- No manual action needed

### Manual
- Click "Refresh Data" button in dashboard
- Calls `refreshData()` function
- Fetches all data fresh from backend

---

## ⚙️ Configuration

### Auto-Refresh Interval (client/lib/useDashboardData.ts)
```typescript
const statsInterval = setInterval(() => {
  fetchDashboardStats();
}, 30000); // 30 seconds - adjust as needed
```

### API Base URL (client/lib/constants.ts)
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

---

## 🐛 Troubleshooting

### "Error Loading Dashboard"
```
✓ Is backend running on port 5000?
✓ Check browser console for specific error
✓ Verify JWT token in localStorage
✓ Click "Try Again" button
```

### Empty charts/stats
```
✓ Make sure user has ATS reports in database
✓ Run a resume scan first to generate data
✓ Check UserJobProfile exists for logged-in user
✓ Refresh browser (Ctrl+F5)
```

### Slow performance
```
✓ Check network tab in DevTools
✓ Verify API endpoint response times
✓ Consider reducing auto-refresh frequency
✓ Check database indexes are set up
```

---

## 🚀 Next Steps

### To Add Data to Dashboard
1. Go to `/analyze` page
2. Upload your resume
3. Run ATS scan
4. Return to dashboard to see updated data

### To Test Dashboard
1. Create multiple resume scans (different versions)
2. Save several jobs from `/job-match`
3. Watch dashboard charts update with real data
4. Observe trends and insights generate automatically

### Production Deployment
1. Set environment variables (API_BASE_URL, DB_URL, JWT_SECRET)
2. Add database indexes for performance
3. Set up error monitoring (Sentry, LogRocket)
4. Configure CDN for assets
5. Set up automated backups

---

## 📊 Real Data Metrics

### What Gets Calculated
- **ATS Score**: From latest AtsReport.overallScore
- **Saved Leads**: Count of User.savedJobs
- **AI Scans**: User.scanCount value
- **Market Fit**: (atsScore × 0.6) + (skillsMatch × 0.3) + (experience × 0.1)
- **Weekly Growth**: ((latest - previous) / previous) × 100
- **Percentile Rank**: (score / 100) × 100

### What Gets Aggregated
- **Monthly Performance**: Average ATS scores per month
- **Weekly Activity**: Scan count per day of week
- **Skills**: From UserJobProfile with proficiency scores
- **Benchmarks**: By category (keywords, formatting, etc.)

### What Gets Generated
- **Insights**: Based on score thresholds and trends
- **Recommendations**: Tailored to user profile
- **Trends**: Growth patterns and suggestions

---

## 📚 Documentation

For complete details, see: **PRODUCTION_DASHBOARD_GUIDE.md**

Covers:
- Architecture deep dive
- Data aggregation logic
- Component specifications
- Performance optimizations
- Security considerations
- Advanced enhancement ideas
- Troubleshooting guide

---

## ✨ Key Features

✅ **100% Real Data** - No mock data anymore  
✅ **Dynamic Updates** - Auto-refresh every 30 seconds  
✅ **Type-Safe** - Full TypeScript support  
✅ **Error Handling** - Graceful failures & recovery  
✅ **Responsive Design** - Works on all devices  
✅ **Production Ready** - Secure, scalable, optimized  
✅ **Well Documented** - Clear code & comments  
✅ **Easy to Extend** - Reusable components  

---

## 💡 Tips

- Monitor localStorage for authToken validity
- Check browser DevTools Network tab for API timing
- Use React DevTools to inspect component state
- Enable debug logging in dashboard.controller.js for troubleshooting
- Set up proper indexes on userId & createdAt in MongoDB

---

**Your dashboard is now production-grade! 🎉**
