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

  // #region agent log
  fetch("http://127.0.0.1:7357/ingest/72510f6d-f5b6-45ba-ae6f-f2d8e8c97f05", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "812e1e",
    },
    body: JSON.stringify({
      sessionId: "812e1e",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "projectService.js:getPublicProjects",
      message: "mongo filter before find",
      data: {
        query,
        filterKeys: Object.keys(filter),
        filterPreview: {
          status: filter.status,
          categories: filter.categories ?? null,
          technologies: filter.technologies ?? null,
          locationType: filter.locationType ?? null,
          experienceLevel: filter.experienceLevel ?? null,
          weeklyCommitment: filter.weeklyCommitment ?? null,
          duration: filter.duration ?? null,
          hasSearchAnd: Boolean(filter.$and),
        },
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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

  const sample = projects.slice(0, 6).map((project) => {
    const roleSkills = (project.roles ?? []).flatMap(
      (role) => role.requiredSkills ?? [],
    );
    const search = typeof query.search === "string" ? query.search.trim() : "";
    const haystack = [
      project.title,
      project.tagline,
      project.description?.overview,
      project.description?.goals,
      project.description?.currentProgress,
      project.description?.lookingFor,
      ...(project.categories ?? []),
      ...(project.customCategories ?? []),
      ...(project.technologies ?? []),
    ]
      .filter(Boolean)
      .join(" | ");

    return {
      title: project.title,
      categories: project.categories ?? [],
      customCategories: project.customCategories ?? [],
      technologies: project.technologies ?? [],
      roleSkills,
      experienceLevel: project.experienceLevel ?? null,
      locationType: project.locationType ?? null,
      weeklyCommitment: project.weeklyCommitment ?? null,
      duration: project.duration ?? null,
      matchesCategory: query.category
        ? (project.categories ?? []).includes(query.category) ||
          (project.customCategories ?? []).includes(query.category)
        : null,
      matchesTechnology: query.technology
        ? (project.technologies ?? []).includes(query.technology) ||
          roleSkills.includes(query.technology)
        : null,
      searchInOverview: search
        ? Boolean(project.description?.overview?.match(new RegExp(search, "i")))
        : null,
      searchInTitle: search
        ? Boolean(project.title?.match(new RegExp(search, "i")))
        : null,
      haystackHasSearch: search
        ? haystack.toLowerCase().includes(search.toLowerCase())
        : null,
    };
  });

  // #region agent log
  fetch("http://127.0.0.1:7357/ingest/72510f6d-f5b6-45ba-ae6f-f2d8e8c97f05", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "812e1e",
    },
    body: JSON.stringify({
      sessionId: "812e1e",
      runId: "pre-fix",
      hypothesisId: "C",
      location: "projectService.js:getPublicProjects:results",
      message: "sample results vs requested filters",
      data: {
        totalProjects,
        returnedCount: projects.length,
        sample,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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

export async function getProjectsOwnedByUser(userId) {
  if (!isValidObjectId(userId)) {
    return [];
  }

  const objectId = new ObjectId(userId);
  const database = getDatabase();

  return database
    .collection("projects")
    .find({
      ownerId: {
        $in: [objectId, objectId.toString()],
      },
    })
    .project({
      title: 1,
      tagline: 1,
      status: 1,
      locationType: 1,
      createdAt: 1,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();
}
