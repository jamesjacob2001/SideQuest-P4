import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../components/auth/useAuth.js";
import ProjectForm from "../components/forms/ProjectForm.jsx";
import { getProjectById, updateProject } from "../services/projectApi.js";
import { getProjectBackNavigation } from "../utils/navigationOrigin.js";
import styles from "./EditProjectPage.module.css";

function EditProjectPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const backNavigation = getProjectBackNavigation(location.state);

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      } catch (error) {
        setErrorMessage(error.message);
        setErrorStatus(error.status);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  async function handleUpdateProject(projectData) {
    setIsSubmitting(true);

    try {
      const updatedProject = await updateProject(projectId, projectData);

      navigate(`/projects/${updatedProject._id}`, {
        state: location.state,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className={styles.message} role="status">
        Loading project...
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className={styles.message} role="alert">
        <h1>
          {errorStatus === 404
            ? "Project not found"
            : "Project could not be loaded"}
        </h1>

        <p>{errorMessage}</p>

        <Link className={styles.link} to={backNavigation.to}>
          {backNavigation.shortLabel}
        </Link>
      </section>
    );
  }

  const isOwner = currentUser?._id?.toString() === String(project.ownerId);

  if (!isOwner) {
    return (
      <Navigate replace state={location.state} to={`/projects/${projectId}`} />
    );
  }

  return (
    <main className={styles.page}>
      <Link
        className={styles.link}
        state={location.state}
        to={`/projects/${projectId}`}
      >
        ← Cancel editing
      </Link>

      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Project management</p>
        <h1>Edit Project</h1>
        <p>
          Update the project information, open roles, and working arrangements.
        </p>
      </header>

      <ProjectForm
        key={project._id}
        initialData={project}
        onSubmit={handleUpdateProject}
        isSubmitting={isSubmitting}
        submitLabel="Save Changes"
        errorTitle="Project could not be updated"
      />
    </main>
  );
}

export default EditProjectPage;
