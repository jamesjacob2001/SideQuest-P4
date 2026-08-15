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
  active: [],
  paused: [],
  completed: [],
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
          active: data.active ?? [],
          paused: data.paused ?? [],
          completed: data.completed ?? [],
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
    active,
    paused,
    completed,
  } = dashboard;

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={ui.eyebrow}>Your workspace</p>
          <h1 className={ui.pageTitle}>Dashboard</h1>
          <p className={ui.pageIntro}>
            Review join requests first, then track the projects you are on and
            the ones you own.
          </p>
        </div>

        <Link className={ui.primaryButton} to="/projects/new">
          Create project
        </Link>
      </header>

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
          description="Looking for new teammates. Edit to update roles or status."
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
          description="Work is underway on these owned projects."
          emptyMessage="You have no active projects."
          isEmpty={active.length === 0}
          title="Active"
        >
          <ul className={styles.list}>
            {active.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
                showManageActions
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Temporarily on hold."
          emptyMessage="You have no paused projects."
          isEmpty={paused.length === 0}
          title="Paused"
        >
          <ul className={styles.list}>
            {paused.map((project) => (
              <OwnedProjectListItem
                key={String(project._id)}
                project={project}
                showManageActions
              />
            ))}
          </ul>
        </DashboardSection>

        <DashboardSection
          description="Finished projects you own."
          emptyMessage="You have no completed projects."
          isEmpty={completed.length === 0}
          title="Completed"
        >
          <ul className={styles.list}>
            {completed.map((project) => (
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
