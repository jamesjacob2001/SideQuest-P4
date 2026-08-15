import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import styles from "./CurrentTeam.module.css";

function CurrentTeam({ members }) {
  return (
    <section className={styles.team}>
      <h2>Current Team</h2>

      {members.length === 0 ? (
        <p className={styles.empty}>
          No collaborators have joined this project yet.
        </p>
      ) : (
        <ul className={styles.list}>
          {members.map((membership) => (
            <li className={styles.member} key={membership._id}>
              <div>
                <strong>{membership.member?.name ?? "SideQuest member"}</strong>
                <p>{membership.roleTitle}</p>
              </div>

              {membership.member?._id ? (
                <Link to={`/profile/${membership.member._id}`}>
                  View profile
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

CurrentTeam.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      roleTitle: PropTypes.string,
      member: PropTypes.shape({
        _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        name: PropTypes.string,
      }),
    }),
  ).isRequired,
};

export default CurrentTeam;
