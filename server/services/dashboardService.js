import { ObjectId } from "mongodb";

import { getDatabase } from "../config/database.js";
import {
  getApplicantMembershipsWithProjects,
  getIncomingMembershipsForOwner,
} from "./teamMembershipService.js";

function summarizeOwnedProject(project) {
  return {
    _id: project._id,
    title: project.title,
    tagline: project.tagline,
    status: project.status,
    locationType: project.locationType,
    createdAt: project.createdAt,
  };
}

async function getOwnedProjects(userId) {
  const projects = await getDatabase()
    .collection("projects")
    .find({
      ownerId: new ObjectId(userId),
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  return projects.map(summarizeOwnedProject);
}

export async function getUserDashboard(userId) {
  const [myMemberships, pendingIncoming, owned] = await Promise.all([
    getApplicantMembershipsWithProjects(userId),
    getIncomingMembershipsForOwner(userId),
    getOwnedProjects(userId),
  ]);

  const joined = myMemberships.filter(
    (membership) => membership.status === "accepted",
  );

  const pendingOutgoing = myMemberships.filter(
    (membership) => membership.status === "pending",
  );

  return {
    joined,
    pendingOutgoing,
    pendingIncoming,
    owned,
    recruiting: owned.filter((project) => project.status === "Recruiting"),
    inProgress: owned.filter((project) => project.status === "In progress"),
    onHold: owned.filter((project) => project.status === "On hold"),
    finished: owned.filter((project) => project.status === "Finished"),
  };
}
