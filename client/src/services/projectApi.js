import apiRequest from "./apiClient.js";

const PROJECTS_ENDPOINT = "/api/projects";

export async function getProjects(page = 1, limit = 24, options = {}) {
  const { search = "", ...filters } = options;
  const searchParameters = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    searchParameters.set("search", trimmedSearch);
  }

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string" && value.trim()) {
      searchParameters.set(key, value.trim());
    }
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
