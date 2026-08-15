import apiRequest from "./apiClient.js";

const MEMBERSHIPS_ENDPOINT = "/api/team-memberships";

export async function createMembership(projectId, roleId) {
  const response = await apiRequest(MEMBERSHIPS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      projectId,
      roleId,
    }),
  });

  return response.data;
}

export async function updateMembershipStatus(membershipId, status) {
  const response = await apiRequest(
    `${MEMBERSHIPS_ENDPOINT}/${membershipId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );

  return response.data;
}

export async function withdrawMembership(membershipId) {
  await apiRequest(`${MEMBERSHIPS_ENDPOINT}/${membershipId}`, {
    method: "DELETE",
  });
}

export async function getProjectTeam(projectId) {
  const response = await apiRequest(
    `${MEMBERSHIPS_ENDPOINT}/project/${projectId}/team`,
  );

  return response.data.members;
}
