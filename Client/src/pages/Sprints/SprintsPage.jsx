import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import SprintsList from "../../components/Sprints/SprintsList";
import CreateSprintForm from "../../components/Sprints/CreateSprintForm";
import SprintsHeader from "../../components/Layout/Header/SprintsHeader/SprintsHeader";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";
import MemberManagement from "../../components/UI/MemberManagement/MemberManagement";
import InviteMembersForm from "../../components/UI/AddMembersForm/InviteMembersForm";
import api from "../../services/api";
import "./SprintsPage.css";

const SprintsPage = ({
  sprints: initialSprints,
  onSprintClick,
  activeProjectId,
  projects = [],
  user = null,
}) => {
  const [sprints, setSprints] = useState(initialSprints || []);
  const [showCreateSprintForm, setShowCreateSprintForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showMemberManagement, setShowMemberManagement] = useState(false);

  const currentProject = projects.find((p) => p.id === activeProjectId);
  const realProjectId = Number(activeProjectId?.replace("project", ""));

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleCreateSprint = async (sprintData) => {
    const fullSprintData = {
      project_id: realProjectId,
      name: sprintData.name,
      description: sprintData.description,
      start_date: formatDate(sprintData.startDate),
      end_date: formatDate(sprintData.endDate),
      color: sprintData.color,
    };

    try {
      const res = await api.post("/sprints", fullSprintData, {
        withCredentials: true,
      });

      const newSprint = {
        id: res.data?.sprint_id,
        name: sprintData.name,
        description: sprintData.description,
        startDate: fullSprintData.start_date,
        endDate: fullSprintData.end_date,
        status: "planned",
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
      };

      setSprints((prev) => [...prev, newSprint]);
      setShowCreateSprintForm(false);
    } catch (err) {
      console.error(" Lỗi tạo Sprint:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeTab="project"
        activeProjectId={activeProjectId}
        showMemberMenu={true}
        onInviteClick={() => setShowInviteForm(true)}
        onManageClick={() => setShowMemberManagement(true)}
        onProjectSelect={(id) => {
          const realId = id?.replace("project", "");
          window.location.href = id
            ? `/dashboard/${realId}/sprints`
            : "/dashboard";
        }}
      />

      <div className="main-content">
        <MainHeader />
        <SprintsHeader project={currentProject} activeTab="project" />

        <div className="content-area">
          {showMemberManagement ? (
            <MemberManagement projectId={realProjectId} />
          ) : (
            <SprintsList
              sprints={sprints}
              onCreateSprint={() => setShowCreateSprintForm(true)}
              onSprintClick={onSprintClick}
              activeProjectId={activeProjectId}
              projectId={realProjectId}
              projectMembers={user ? [user] : []}
              onTaskCreated={(task) => {
                console.log(" Task đã tạo:", task);
              }}
            />
          )}
        </div>
      </div>

      {showCreateSprintForm && (
        <CreateSprintForm
          onClose={() => setShowCreateSprintForm(false)}
          onSubmit={handleCreateSprint}
        />
      )}

      {showInviteForm && (
        <InviteMembersForm
          projectId={realProjectId}
          onClose={() => setShowInviteForm(false)}
        />
      )}
    </div>
  );
};

export default SprintsPage;
