import apiRequest from "./apiClient.js";

const PROJECTS_ENDPOINT = "/api/projects";

export async function getProjects(page = 1, limit = 24, search = "") {
  const searchParameters = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    searchParameters.set("search", trimmedSearch);
  }

  const response = await apiRequest(
    `${PROJECTS_ENDPOINT}?${searchParameters.toString()}`,
  );

  return response.data;
}

export async function getProjectById(projectId) {
  const response = await apiRequest(`${PROJECTS_ENDPOINT}/${projectId}`);
  return response.data;
}

export async function createProject(projectData) {
  const response = await apiRequest(PROJECTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(projectData),
  });

  return response.data;
}

export async function updateProject(projectId, projectUpdates) {
  const response = await apiRequest(`${PROJECTS_ENDPOINT}/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(projectUpdates),
  });

  return response.data;
}

export async function deleteProject(projectId) {
  const response = await apiRequest(`${PROJECTS_ENDPOINT}/${projectId}`, {
    method: "DELETE",
  });

  return response;
}
