import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import ProjectForm from "../components/forms/ProjectForm.jsx";
import { createProject } from "../services/projectApi.js";
import ui from "../styles/ui.module.css";
import styles from "./CreateProjectPage.module.css";

function CreateProjectPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateProject(projectData) {
    setIsSubmitting(true);

    try {
      const createdProject = await createProject(projectData);
      navigate(`/projects/${createdProject._id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={ui.eyebrow}>Start a SideQuest</p>
        <h1 className={ui.pageTitle}>Create a Project</h1>
        <p className={ui.pageIntro}>
          Describe your idea, define the contributors you need, and publish the
          project for others to discover.
        </p>
      </header>

      <ProjectForm onSubmit={handleCreateProject} isSubmitting={isSubmitting} />
    </section>
  );
}

CreateProjectPage.propTypes = {
  children: PropTypes.node,
};

export default CreateProjectPage;
