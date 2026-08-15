import { ObjectId } from "mongodb";

import { getDatabase } from "../config/database.js";

function toObjectId(id) {
  return new ObjectId(id);
}

export async function findExistingApplication(projectId, applicantId) {
  const database = getDatabase();

  return database.collection("team_memberships").findOne({
    projectId: toObjectId(projectId),
    applicantId: toObjectId(applicantId),
  });
}

export async function createTeamMembership(membershipDocument) {
  const database = getDatabase();

  const result = await database
    .collection("team_memberships")
    .insertOne(membershipDocument);

  return {
    ...membershipDocument,
    _id: result.insertedId,
  };
}

export async function getTeamMembershipById(membershipId) {
  const database = getDatabase();

  return database.collection("team_memberships").findOne({
    _id: toObjectId(membershipId),
  });
}

export async function getTeamMembershipsByApplicant(applicantId) {
  const database = getDatabase();

  return database
    .collection("team_memberships")
    .find({
      applicantId: toObjectId(applicantId),
    })
    .sort({
      createdAt: -1,
    })
    .toArray();
}

export async function getTeamMembershipsByProject(projectId) {
  const database = getDatabase();

  return database
    .collection("team_memberships")
    .find({
      projectId: toObjectId(projectId),
    })
    .sort({
      createdAt: -1,
    })
    .toArray();
}

export async function updateTeamMembershipStatus(membershipId, status) {
  const database = getDatabase();
  const objectId = toObjectId(membershipId);
  const updatedAt = new Date();

  const result = await database.collection("team_memberships").updateOne(
    {
      _id: objectId,
      status: "pending",
    },
    {
      $set: {
        status,
        updatedAt,
        ...(status === "accepted"
          ? {
              joinedAt: updatedAt,
            }
          : {}),
      },
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return database.collection("team_memberships").findOne({
    _id: objectId,
  });
}

export async function deletePendingTeamMembership(membershipId, applicantId) {
  const database = getDatabase();

  const result = await database.collection("team_memberships").deleteOne({
    _id: toObjectId(membershipId),
    applicantId: toObjectId(applicantId),
    status: "pending",
  });

  return result.deletedCount === 1;
}

function summarizeProject(project) {
  if (!project) {
    return null;
  }

  return {
    _id: project._id,
    ownerId: project.ownerId,
    title: project.title,
    tagline: project.tagline,
    status: project.status,
  };
}

function summarizeApplicant(user) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    profileImageUrl: user.profileImageUrl ?? null,
  };
}

export async function getApplicantMembershipsWithProjects(applicantId) {
  const database = getDatabase();

  const memberships = await database
    .collection("team_memberships")
    .find({
      applicantId: toObjectId(applicantId),
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  const projectIds = [
    ...new Set(
      memberships.map((membership) => membership.projectId.toString()),
    ),
  ];

  if (projectIds.length === 0) {
    return [];
  }

  const projects = await database
    .collection("projects")
    .find({
      _id: {
        $in: projectIds.map((projectId) => new ObjectId(projectId)),
      },
    })
    .toArray();

  const projectsById = new Map(
    projects.map((project) => [project._id.toString(), project]),
  );

  return memberships.map((membership) => ({
    ...membership,
    project: summarizeProject(
      projectsById.get(membership.projectId.toString()),
    ),
  }));
}

export async function getProjectMembershipsWithApplicants(projectId) {
  const database = getDatabase();

  const memberships = await database
    .collection("team_memberships")
    .find({
      projectId: toObjectId(projectId),
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  const applicantIds = [
    ...new Set(
      memberships.map((membership) => membership.applicantId.toString()),
    ),
  ];

  if (applicantIds.length === 0) {
    return [];
  }

  const applicants = await database
    .collection("users")
    .find(
      {
        _id: {
          $in: applicantIds.map((applicantId) => new ObjectId(applicantId)),
        },
      },
      {
        projection: {
          name: 1,
          username: 1,
          profileImageUrl: 1,
        },
      },
    )
    .toArray();

  const applicantsById = new Map(
    applicants.map((applicant) => [applicant._id.toString(), applicant]),
  );

  return memberships.map((membership) => ({
    ...membership,
    applicant: summarizeApplicant(
      applicantsById.get(membership.applicantId.toString()),
    ),
  }));
}

export async function getIncomingMembershipsForOwner(ownerId) {
  const database = getDatabase();
  const ownerObjectId = toObjectId(ownerId);

  const ownedProjects = await database
    .collection("projects")
    .find(
      {
        ownerId: ownerObjectId,
      },
      {
        projection: {
          title: 1,
          tagline: 1,
          status: 1,
          ownerId: 1,
        },
      },
    )
    .toArray();

  if (ownedProjects.length === 0) {
    return [];
  }

  const projectsById = new Map(
    ownedProjects.map((project) => [project._id.toString(), project]),
  );

  const memberships = await database
    .collection("team_memberships")
    .find({
      projectId: {
        $in: ownedProjects.map((project) => project._id),
      },
      status: "pending",
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  if (memberships.length === 0) {
    return [];
  }

  const applicantIds = [
    ...new Set(
      memberships.map((membership) => membership.applicantId.toString()),
    ),
  ];

  const applicants = await database
    .collection("users")
    .find(
      {
        _id: {
          $in: applicantIds.map((applicantId) => new ObjectId(applicantId)),
        },
      },
      {
        projection: {
          name: 1,
          username: 1,
          profileImageUrl: 1,
        },
      },
    )
    .toArray();

  const applicantsById = new Map(
    applicants.map((applicant) => [applicant._id.toString(), applicant]),
  );

  return memberships.map((membership) => ({
    ...membership,
    project: summarizeProject(
      projectsById.get(membership.projectId.toString()),
    ),
    applicant: summarizeApplicant(
      applicantsById.get(membership.applicantId.toString()),
    ),
  }));
}

export async function getAcceptedProjectMembers(projectId) {
  const database = getDatabase();

  const memberships = await database
    .collection("team_memberships")
    .find({
      projectId: toObjectId(projectId),
      status: "accepted",
    })
    .sort({
      joinedAt: 1,
    })
    .toArray();

  if (memberships.length === 0) {
    return [];
  }

  const applicantIds = [
    ...new Set(
      memberships.map((membership) => membership.applicantId.toString()),
    ),
  ];

  const users = await database
    .collection("users")
    .find({
      _id: {
        $in: applicantIds.map((id) => new ObjectId(id)),
      },
    })
    .toArray();

  const usersById = new Map(users.map((user) => [user._id.toString(), user]));

  return memberships.map((membership) => ({
    _id: membership._id,
    roleId: membership.roleId,
    roleTitle: membership.roleTitle,
    joinedAt: membership.joinedAt,
    member: summarizeApplicant(
      usersById.get(membership.applicantId.toString()),
    ),
  }));
}
