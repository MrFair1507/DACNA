import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";
import SprintsHeader from "../../components/Layout/Header/SprintsHeader/SprintsHeader";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ProjectReportsPage.css";

Chart.register(ArcElement, Tooltip, Legend);

const ProjectReportsPage = ({ projectId, user }) => {
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState("all");
  const [reportData, setReportData] = useState({
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  });
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const fullProjectId = `project${projectId}`;
  const currentProject = projects.find((p) => p.id === fullProjectId);

  useEffect(() => {
    const fetchData = async () => {
      const [sprintsRes, projectsRes] = await Promise.all([
        api.get(`/sprints?project_id=${projectId}`),
        api.get("/projects/my-projects", { withCredentials: true }),
      ]);

      const sprintList = Array.isArray(sprintsRes.data?.sprints)
        ? sprintsRes.data.sprints
        : [];
      const formattedProjects = projectsRes.data.map((p) => ({
        id: `project${p.project_id}`,
        title: p.project_name,
        description: p.project_description,
        color: p.color || "blue",
      }));

      setSprints(sprintList);
      setProjects(formattedProjects);
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    const loadData = async () => {
      let tasks = [];

      const fetchTasksFromSprint = async (sprintId) => {
        const backlogRes = await api.get(`/sprints/${sprintId}/backlog`);
        for (let b of backlogRes.data) {
          const taskRes = await api.get(
            `/tasks/backlog/${b.sprint_backlog_id}/tasks`
          );
          tasks.push(...taskRes.data);
        }
      };

      if (selectedSprintId === "all") {
        for (let sprint of sprints) {
          await fetchTasksFromSprint(sprint.sprint_id);
        }
      } else {
        await fetchTasksFromSprint(selectedSprintId);
      }

      const completed = tasks.filter(
        (t) => t.task_status === "Completed"
      ).length;
      const inProgress = tasks.filter(
        (t) => t.task_status === "In Progress"
      ).length;
      const notStarted = tasks.length - completed - inProgress;

      setReportData({ completed, inProgress, notStarted });
    };

    if (sprints.length) loadData();
  }, [selectedSprintId, sprints]);

  const data = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [
          reportData.completed,
          reportData.inProgress,
          reportData.notStarted,
        ],
        backgroundColor: ["#4ade80", "#fbbf24", "#f87171"],
        borderWidth: 1,
      },
    ],
  };
  const handleExportPDF = () => {
    const target = document.querySelector(".report-container");
    if (!target) return;

    html2canvas(target, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = 210; // A4 width in mm
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save("baocao-tiendo.pdf");
    });
  };
  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeTab="reports"
        activeProjectId={fullProjectId}
        showMemberMenu={false}
        onProjectSelect={(id) => {
          const realId = id?.replace("project", "");
          navigate(`/dashboard/${realId}/reports`);
        }}
        onTabSelect={(id, tab) => {
          const realId = id?.replace("project", "");
          if (tab === "sprints") navigate(`/dashboard/${realId}/sprints`);
          else if (tab === "backlog") navigate(`/dashboard/${realId}/backlog`);
          else if (tab === "reports") navigate(`/dashboard/${realId}/reports`);
        }}
      />

      <div className="main-content">
        <MainHeader />
        <SprintsHeader
          project={currentProject}
          activeTab="reports"
          onTabSelect={(id, tab) => {
            const realId = id?.replace("project", "");
            if (tab === "sprints") navigate(`/dashboard/${realId}/sprints`);
            else if (tab === "backlog")
              navigate(`/dashboard/${realId}/backlog`);
            else if (tab === "reports")
              navigate(`/dashboard/${realId}/reports`);
          }}
        />

        <div className="content-area report-container">
          <div className="reports-header">
            <h2 className="reports-title">Báo cáo tiến độ</h2>
            

            <select
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="reports-dropdown"
            >
              <option value="all">Toàn bộ dự án</option>
              {Array.isArray(sprints) &&
                sprints.map((s) => (
                  <option key={s.sprint_id} value={s.sprint_id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="chart-area">
           
            <Pie
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top", // vẫn nằm trên
                    labels: {
                      boxWidth: 20,
                      padding: 20,
                    },
                  },
                },
                layout: {
                  padding: 10,
                },
              }}
              style={{ maxWidth: 500, maxHeight: 500 }}
            />
             <button onClick={handleExportPDF} className="export-pdf-btn">
              📄 Xuất PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportsPage;
