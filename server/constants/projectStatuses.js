export const PROJECT_STATUS_OPTIONS = [
  {
    value: "Recruiting",
    description: "Looking for new teammates",
  },
  {
    value: "In progress",
    description: "Team is working; not taking new people",
  },
  {
    value: "On hold",
    description: "Temporarily stopped",
  },
  {
    value: "Finished",
    description: "Project is done",
  },
];

/** Only Recruiting projects appear on Browse by default. */
export const BROWSEABLE_STATUSES = ["Recruiting"];

export const PROJECT_STATUSES = PROJECT_STATUS_OPTIONS.map(
  (status) => status.value,
);

export const PROJECT_STATUS_DESCRIPTIONS = Object.fromEntries(
  PROJECT_STATUS_OPTIONS.map((status) => [status.value, status.description]),
);
