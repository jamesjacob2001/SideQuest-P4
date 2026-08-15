export const PROJECT_STATUS_OPTIONS = [
  {
    value: "Recruiting",
    description: "Looking for new teammates",
  },
  {
    value: "Active",
    description: "Work is underway",
  },
  {
    value: "Paused",
    description: "Temporarily on hold",
  },
  {
    value: "Completed",
    description: "Finished",
  },
];

export const PROJECT_STATUSES = PROJECT_STATUS_OPTIONS.map(
  (status) => status.value,
);

export const PROJECT_STATUS_DESCRIPTIONS = Object.fromEntries(
  PROJECT_STATUS_OPTIONS.map((status) => [status.value, status.description]),
);
