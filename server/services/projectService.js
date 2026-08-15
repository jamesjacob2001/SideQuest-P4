import { ObjectId } from "mongodb";

import { getDatabase } from "../config/database.js";
import { BROWSEABLE_STATUSES } from "../constants/projectStatuses.js";

function isValidObjectId(value) {
  if (value == null) {
    return false;
  }

  const id = String(value);
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

function summarizeOwner(user) {
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

async function getOwnersByIds(ownerIds) {
  const uniqueIds = [
    ...new Set(
      ownerIds.filter(isValidObjectId).map((ownerId) => String(ownerId)),
    ),
  ];

  if (uniqueIds.length === 0) {
    return new Map();
  }

  const users = await getDatabase()
    .collection("users")
    .find(
      {
        _id: {
          $in: uniqueIds.map((id) => new ObjectId(id)),
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

  return new Map(users.map((user) => [user._id.toString(), user]));
}

async function attachOwners(projects) {
  const ownersById = await getOwnersByIds(
    projects.map((project) => project.ownerId),
  );

  return projects.map((project) => ({
    ...project,
    owner: summarizeOwner(ownersById.get(String(project.ownerId))),
  }));
}

async function attachOwner(project) {
  if (!project) {
    return null;
  }

  const [projectWithOwner] = await attachOwners([project]);
  return projectWithOwner;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPublicProjectsFilter({
  search = "",
  category = "",
  technology = "",
  status = "",
  locationType = "",
  experienceLevel = "",
  weeklyCommitment = "",
  duration = "",
} = {}) {
  const filter = {};

  if (status) {
    filter.status = status;
  } else {
    filter.status = {
      $in: BROWSEABLE_STATUSES,
    };
  }

  if (category) {
    filter.categories = category;
  }

  if (technology) {
    filter.technologies = technology;
  }

  if (locationType) {
    filter.locationType = locationType;
  }

  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }

  if (weeklyCommitment) {
    filter.weeklyCommitment = weeklyCommitment;
  }

  if (duration) {
    filter.duration = duration;
  }

  const trimmedSearch = typeof search === "string" ? search.trim() : "";

  if (trimmedSearch) {
    // Word boundaries avoid substring false positives (e.g. "Unity" in "community").
    const searchPattern = new RegExp(
      `\\b${escapeRegExp(trimmedSearch)}\\b`,
      "i",
    );

    const searchClause = {
      $or: [
        { title: searchPattern },
        { tagline: searchPattern },
        { "description.overview": searchPattern },
        { "description.goals": searchPattern },
        { "description.currentProgress": searchPattern },
        { "description.lookingFor": searchPattern },
        { categories: searchPattern },
        { customCategories: searchPattern },
        { technologies: searchPattern },
      ],
    };

    filter.$and = [...(filter.$and ?? []), searchClause];
  }

  return filter;
}

export async function getPublicProjects(page, limit, query = {}) {
  const database = getDatabase();
  const projectsCollection = database.collection("projects");

  const filter = buildPublicProjectsFilter(query);
  const skip = (page - 1) * limit;

  const [projects, totalProjects] = await Promise.all([
    projectsCollection
      .find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .toArray(),

    projectsCollection.countDocuments(filter),
  ]);

  return {
    projects: await attachOwners(projects),
    totalProjects,
  };
}

export async function getProjectById(projectId) {
  const database = getDatabase();

  const project = await database.collection("projects").findOne({
    _id: new ObjectId(projectId),
  });

  return attachOwner(project);
}

export async function createProject(projectDocument) {
  const database = getDatabase();

  const result = await database
    .collection("projects")
    .insertOne(projectDocument);

  return {
    ...projectDocument,
    _id: result.insertedId,
  };
}

export async function updateProjectById(projectId, projectDocument) {
  const database = getDatabase();
  const objectId = new ObjectId(projectId);

  const result = await database.collection("projects").updateOne(
    {
      _id: objectId,
    },
    {
      $set: projectDocument,
    },
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return database.collection("projects").findOne({
    _id: objectId,
  });
}

export async function deleteProjectById(projectId) {
  const database = getDatabase();
  const objectId = new ObjectId(projectId);

  const result = await database.collection("projects").deleteOne({
    _id: objectId,
  });

  if (result.deletedCount !== 1) {
    return false;
  }

  await database.collection("team_memberships").deleteMany({
    projectId: objectId,
  });

  return true;
}
