import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardSection from "../components/dashboard/DashboardSection.jsx";
import MembershipListItem from "../components/dashboard/MembershipListItem.jsx";
import OwnedProjectListItem from "../components/dashboard/OwnedProjectListItem.jsx";
import { getDashboard } from "../services/dashboardApi.js";
import {
  updateMembershipStatus,
  withdrawMembership,
} from "../services/membershipApi.js";
import ui from "../styles/ui.module.css";
import styles from "./DashboardPage.module.css";

const EMPTY_DASHBOARD = {
  joined: [],
  pendingOutgoing: [],
  pendingIncoming: [],
  owned: [],
  recruiting: [],
  inProgress: [],
  onHold: [],
  finished: [],
};

function DashboardPage() {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionErrors, setActionErrors] = useState({});

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setDashboard({
          joined: data.joined ?? [],
          pendingOutgoing: data.pendingOutgoing ?? [],
          pendingIncoming: data.pendingIncoming ?? [],
          owned: data.owned ?? [],
          recruiting: data.recruiting ?? [],
          inProgress: data.inProgress ?? [],
          onHold: data.onHold ?? [],
          finished: data.finished ?? [],
        });
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleIncomingDecision(membershipId, status) {
    const id = String(membershipId);
    setUpdatingId(id);
    setActionErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    try {
      await updateMembershipStatus(id, status);
      setDashboard((current) => ({
        ...current,
        pendingIncoming: current.pendingIncoming.filter(
          (membership) => String(membership._id) !== id,
        ),
      }));
    } catch (error) {
      setActionErrors((current) => ({
        ...current,
        [id]: error.message,
      }));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleWithdraw(membershipId) {
    const id = String(membershipId);

    setUpdatingId(id);
    setActionErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    try {
      await withdrawMembership(id);

      setDashboard((current) => ({
        ...current,
        pendingOutgoing: current.pendingOutgoing.filter(
          (membership) => String(membership._id) !== id,
        ),
      }));
    } catch (error) {
      setActionErrors((current) => ({
        ...current,
        [id]: error.message,
      }));
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return (
      <section className={styles.message} role="status">
        Loading dashboard...
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className={styles.errorMessage} role="alert">
        <h1>Dashboard could not be loaded</h1>
        <p>{errorMessage}</p>
      </section>
    );
  }

  const {
    joined,
    pendingOutgoing,
    pendingIncoming,
    owned,
    recruiting,
    inProgress,
    onHold,
    finished,
  } = dashboard;

  const pendingApplications = pendingOutgoing.length;
  const pendingRequests = pendingIncoming.length;
  const ownedProjects = owned.length;
  const joinedProjects = joined.length;

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={ui.eyebrow}>Your workspace</p>
          <h1 className={ui.pageTitle}>Dashboard</h1>
        </div>

        <Link className={ui.primaryButton} to="/projects/new">
          Create project
        </Link>
      </header>

      <section className={styles.summary} aria-label="Dashboard summary">
        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{ownedProjects}</span>
          <span className={styles.summaryLabel}>Projects created</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{joinedProjects}</span>
          <span className={styles.summaryLabel}>Teams joined</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{pendingApplications}</span>
          <span className={styles.summaryLabel}>Pending applications</span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryValue}>{pendingRequests}</span>
          <span className={styles.summaryLabel}>Incoming requests</span>
        </div>
      </section>

      <div className={styles.sections}>
        <DashboardSection
          description="People asking to join projects you own — respond here first."
          emptyMessage="No pending applications on your projects."
          isEmpty={pendingIncoming.length === 0}
          title="Incoming requests"
        >
          <ul className={styles.list}>
            {pendingIncoming.map((membership) => {
              const membershipId = String(membership._id);

              return (
                <MembershipListItem
                  key={membershipId}
                  actionError={actionErrors[membershipId]}
                  isUpdating={updatingId === membershipId}
                  membership={membership}
                  onAccept={() =>
                    handleIncomingDecision(membershipId, "accepted")
                  }
                  onReject={() =>
                    handleIncomingDecision(membershipId, "rejected")
                  }
                  showApplicant
                />
              );
            })}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Join requests you have sent that are still waiting."
          emptyMessage="You have no outgoing requests."
          isEmpty={pendingOutgoing.length === 0}
          title="Outgoing requests"
        >
          <ul className={styles.list}>
            {pendingOutgoing.map((membership) => {
              const membershipId = String(membership._id);

              return (
                <MembershipListItem
                  key={membershipId}
                  actionError={actionErrors[membershipId]}
                  isUpdating={updatingId === membershipId}
                  membership={membership}
                  onWithdraw={() => handleWithdraw(membershipId)}
                />
              );
            })}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Projects where you are an accepted team member."
          emptyMessage="You have not joined any projects yet."
          isEmpty={joined.length === 0}
          title="Joined projects"
        >
          <ul className={styles.list}>
            {joined.map((membership) => (
              <MembershipListItem
                key={String(membership._id)}
                membership={membership}
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Looking for new teammates. These projects appear on Browse."
          emptyMessage="You have no recruiting projects."
          isEmpty={recruiting.length === 0}
          title="Recruiting"
        >
          <ul className={styles.list}>
            {recruiting.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
                showManageActions
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Your team is working and not taking new people."
          emptyMessage="You have no in-progress projects."
          isEmpty={inProgress.length === 0}
          title="In progress"
        >
          <ul className={styles.list}>
            {inProgress.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
                showManageActions
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Temporarily stopped."
          emptyMessage="You have no projects on hold."
          isEmpty={onHold.length === 0}
          title="On hold"
        >
          <ul className={styles.list}>
            {onHold.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
                showManageActions
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Projects you own that are done."
          emptyMessage="You have no finished projects."
          isEmpty={finished.length === 0}
          title="Finished"
        >
          <ul className={styles.list}>
            {finished.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Full list of every project you own."
          emptyMessage="You have not created any projects yet."
          isEmpty={owned.length === 0}
          title="All owned projects"
        >
          <ul className={styles.list}>
            {owned.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
                showManageActions
              />
            ))}
          </ul>
        </DashboardSection>
      </div>
    </section>
  );
}

export default DashboardPage;
