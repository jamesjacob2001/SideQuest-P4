import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useParams } from "react-router-dom";

import { useAuth } from "../components/auth/useAuth.js";
import DeleteAccountButton from "../components/profiles/DeleteAccountButton.jsx";
import InterestsList from "../components/profiles/InterestsList.jsx";
import PortfolioLinks from "../components/profiles/PortfolioLinks.jsx";
import ProfileDetails from "../components/profiles/ProfileDetails.jsx";
import ProfileHeader from "../components/profiles/ProfileHeader.jsx";
import ProfileProjectsList from "../components/profiles/ProfileProjectsList.jsx";
import RolePreferencesList from "../components/profiles/RolePreferencesList.jsx";
import SkillsList from "../components/profiles/SkillsList.jsx";
import { getUserById } from "../services/userApi.js";
import { getProjectBackNavigation } from "../utils/navigationOrigin.js";
import ui from "../styles/ui.module.css";
import styles from "./ProfilePage.module.css";

function ProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const backNavigation = getProjectBackNavigation(location.state);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUserById(id);
        setUser(userData);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.message} role="status">
        Loading profile...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.errorMessage} role="alert">
        <h1>Profile could not be loaded</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isOwner = currentUser?._id?.toString() === String(user._id);
  const showBackLink =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/");

  return (
    <article className={styles.page}>
      {showBackLink ? (
        <Link className={ui.accentLink} to={backNavigation.to}>
          {backNavigation.label}
        </Link>
      ) : null}

      <ProfileHeader
        isRecruiting={user.isRecruiting}
        major={user.major}
        name={user.name}
        university={user.university}
        username={user.username}
      />

      {isOwner ? (
        <div className={styles.actions}>
          <Link className={ui.primaryButton} to={`/profile/${id}/edit`}>
            Edit profile
          </Link>
          <DeleteAccountButton userId={String(user._id)} userName={user.name} />
        </div>
      ) : null}

      <div className={styles.sections}>
        <ProfileDetails
          availability={user.availability}
          bio={user.bio}
          experienceLevel={user.experienceLevel}
          graduationYear={user.graduationYear}
          location={user.location}
          yearLabel={user.yearLabel}
        />

        <SkillsList skills={user.technicalSkills} />
        <InterestsList interests={user.interests} />
        <RolePreferencesList roles={user.rolePreferences} />
        <PortfolioLinks portfolioLinks={user.portfolioLinks} />
        <ProfileProjectsList
          navigationState={{
            from: `/profile/${id}`,
            fromLabel: `${user.name}'s profile`,
          }}
          projects={user.ownedProjects}
        />
      </div>
    </article>
  );
}

ProfilePage.propTypes = {
  children: PropTypes.node,
};

export default ProfilePage;
