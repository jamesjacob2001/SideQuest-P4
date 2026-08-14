import { ObjectId } from "mongodb";

import { getDatabase } from "../config/database.js";

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

function buildPublicProjectsFilter(search) {
  const filter = {
    status: {
      $ne: "Completed",
    },
  };

  const trimmedSearch = typeof search === "string" ? search.trim() : "";

  if (!trimmedSearch) {
    return filter;
  }

  // Word boundaries avoid substring false positives (e.g. "Unity" in "community").
  const searchPattern = new RegExp(`\\b${escapeRegExp(trimmedSearch)}\\b`, "i");

  filter.$or = [
    { title: searchPattern },
    { tagline: searchPattern },
    { "description.overview": searchPattern },
    { "description.goals": searchPattern },
    { "description.currentProgress": searchPattern },
    { "description.lookingFor": searchPattern },
    { categories: searchPattern },
    { customCategories: searchPattern },
    { technologies: searchPattern },
  ];

  return filter;
}

export async function getPublicProjects(page, limit, search = "") {
  const database = getDatabase();
  const projectsCollection = database.collection("projects");

  const filter = buildPublicProjectsFilter(search);
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
