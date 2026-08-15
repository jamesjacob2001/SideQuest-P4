export function getAuthRequiredMessage(pathname) {
  if (pathname === "/projects/new") {
    return "Please log in or create an account to create a project";
  }

  if (pathname === "/dashboard") {
    return "Please log in or create an account to view your dashboard";
  }

  if (/^\/profile\/[^/]+\/edit$/.test(pathname)) {
    return "Please log in or create an account to edit your profile";
  }

  if (/^\/projects\/[^/]+\/edit$/.test(pathname)) {
    return "Please log in or create an account to edit a project";
  }

  return "Please log in or create an account to continue";
}

export function buildAuthRedirectState(location) {
  return {
    from: `${location.pathname}${location.search}`,
    authMessage: getAuthRequiredMessage(location.pathname),
  };
}
