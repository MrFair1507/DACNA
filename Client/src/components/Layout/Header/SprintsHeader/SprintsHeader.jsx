import React from "react";
import { useAuth } from "../../../../hooks/useAuth";
// eslint-disable-next-line 
import { Link, useNavigate, useParams } from "react-router-dom";
import "./SprintsHeader.css";

const SprintsHeader = ({ project, activeTab }) => {
  // eslint-disable-next-line 
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
// eslint-disable-next-line 
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  };

  const handleTabClick = (tab) => {
    if (!projectId) return;
    if (tab === "sprints") navigate(`/dashboard/${projectId}/sprints`);
    if (tab === "backlog") navigate(`/dashboard/${projectId}/backlog`);
    if (tab === "reports") navigate(`/dashboard/${projectId}/reports`);
  };

  return (
    <>
      <div className="project-header">
        <div className="project-title-header">
          <h2>{project?.title || "Tên dự án"}</h2>
        </div>

        <div className="project-tabs">
          <div
            className={`tab ${activeTab === "sprints" ? "active" : ""}`}
            onClick={() => handleTabClick("sprints")}
          >
            Sprints
          </div>
          <div
            className={`tab ${activeTab === "backlog" ? "active" : ""}`}
            onClick={() => handleTabClick("backlog")}
          >
            Product Backlog
          </div>
          <div
            className={`tab ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => handleTabClick("reports")}
          >
            Reports
          </div>
        </div>
      </div>
    </>
  );
};

export default SprintsHeader;
