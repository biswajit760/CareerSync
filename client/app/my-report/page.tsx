"use client";

import { useEffect, useState } from "react";
import { getUserReports } from "@/lib/api";
import ReportsTable from "@/components/report/ReportsTable";

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getUserReports();
        setReports(data?.data || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return <ReportsTable reports={reports} />;
}