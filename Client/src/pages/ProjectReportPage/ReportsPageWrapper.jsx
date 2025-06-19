import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProjectReportsPage from "./ProjectReportsPage";

const ReportsPageWrapper = () => {
  const { projectId } = useParams(); // từ route /dashboard/:projectId/reports
  const { user } = useAuth();

  return <ProjectReportsPage projectId={projectId} user={user} />;
};

export default ReportsPageWrapper;
