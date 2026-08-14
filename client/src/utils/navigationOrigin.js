export const PROJECTS_ORIGIN = {
  from: "/projects",
  fromLabel: "projects",
};

export const DASHBOARD_ORIGIN = {
  from: "/dashboard",
  fromLabel: "Dashboard",
};

export function getProjectBackNavigation(locationState) {
  const from = locationState?.from;
  const fromLabel = locationState?.fromLabel;

  if (typeof from === "string" && from.startsWith("/")) {
    const label =
      typeof fromLabel === "string" && fromLabel.trim()
        ? fromLabel.trim()
        : "previous page";

    return {
      to: from,
      label: `← Back to ${label}`,
      shortLabel: `Return to ${label}`,
    };
  }

  return {
    to: PROJECTS_ORIGIN.from,
    label: "← Back to projects",
    shortLabel: "Return to projects",
  };
}
