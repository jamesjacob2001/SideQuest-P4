import {
  getPublicProjects,
  getProjectById,
  createProject,
  updateProjectById,
  deleteProjectById,
} from "../services/projectService.js";
import {
  buildProjectDocument,
  buildUpdatedProjectDocument,
} from "../utils/buildProjectDocument.js";
import { validateProject } from "../utils/validators/projectValidator.js";
import { PROJECT_CATEGORIES } from "../constants/categories.js";
import { TECHNOLOGY_LIST } from "../constants/technologyList.js";
import { BROWSEABLE_STATUSES } from "../constants/projectStatuses.js";
import { LOCATION_TYPES } from "../constants/locationTypes.js";
import { EXPERIENCE_LEVELS } from "../constants/experienceLevels.js";
import { WEEKLY_COMMITMENTS } from "../constants/weeklyCommitments.js";
import { PROJECT_DURATIONS } from "../constants/projectDurations.js";

function firstQueryValue(value) {
  if (Array.isArray(value)) {
    return firstQueryValue(value[0]);
  }

  return typeof value === "string" ? value : "";
}

function pickAllowedValue(value, allowedValues) {
  const trimmedValue = firstQueryValue(value).trim();
  return allowedValues.includes(trimmedValue) ? trimmedValue : "";
}

function parseProjectListQuery(query) {
  const rawSearch = firstQueryValue(query.search);

  return {
    search: rawSearch.trim().slice(0, 100),
    category: pickAllowedValue(query.category, PROJECT_CATEGORIES),
    technology: pickAllowedValue(query.technology, TECHNOLOGY_LIST),
    status: pickAllowedValue(query.status, BROWSEABLE_STATUSES),
    locationType: pickAllowedValue(query.locationType, LOCATION_TYPES),
    experienceLevel: pickAllowedValue(query.experienceLevel, EXPERIENCE_LEVELS),
    weeklyCommitment: pickAllowedValue(
      query.weeklyCommitment,
      WEEKLY_COMMITMENTS,
    ),
    duration: pickAllowedValue(query.duration, PROJECT_DURATIONS),
  };
}

export async function listProjects(request, response, next) {
  try {
    const requestedPage = Number.parseInt(request.query.page, 10);

    const requestedLimit = Number.parseInt(request.query.limit, 10);

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const limit =
      Number.isInteger(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, 100)
        : 24;

    const listQuery = parseProjectListQuery(request.query);

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
        hypothesisId: "A",
        location: "projectController.js:parseProjectListQuery",
        message: "incoming vs parsed filter query",
        data: {
          rawQuery: request.query,
          parsedQuery: listQuery,
          dropped: {
            category:
              Boolean(request.query.category) && !listQuery.category,
            technology:
              Boolean(request.query.technology) && !listQuery.technology,
            locationType:
              Boolean(request.query.locationType) && !listQuery.locationType,
            experienceLevel:
              Boolean(request.query.experienceLevel) &&
              !listQuery.experienceLevel,
            weeklyCommitment:
              Boolean(request.query.weeklyCommitment) &&
              !listQuery.weeklyCommitment,
            duration:
              Boolean(request.query.duration) && !listQuery.duration,
          },
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    fetch("http://127.0.0.1:7357/ingest/72510f6d-f5b6-45ba-ae6f-f2d8e8c97f05", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "812e1e",
      },
      body: JSON.stringify({
        sessionId: "812e1e",
        runId: "post-fix",
        hypothesisId: "F",
        location: "projectController.js:listProjects",
        message: "query value types after coerce",
        data: {
          originalUrl: request.originalUrl,
          types: {
            page: {
              type: typeof request.query.page,
              isArray: Array.isArray(request.query.page),
            },
            category: {
              type: typeof request.query.category,
              isArray: Array.isArray(request.query.category),
            },
            technology: {
              type: typeof request.query.technology,
              isArray: Array.isArray(request.query.technology),
            },
            search: {
              type: typeof request.query.search,
              isArray: Array.isArray(request.query.search),
            },
          },
          parsedCategory: listQuery.category,
          parsedSearch: listQuery.search,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const { projects, totalProjects } = await getPublicProjects(
      page,
      limit,
      listQuery,
    );

    const totalPages = Math.max(1, Math.ceil(totalProjects / limit));

    return response.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          totalProjects,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
      },
      message: "Projects retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function showProject(request, response, next) {
  try {
    const project = await getProjectById(request.params.id);

    if (!project) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "Project not found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: project,
      message: "Project retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function addProject(request, response, next) {
  try {
    const validation = validateProject(request.body);

    if (!validation.isValid) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "Project validation failed.",
        errors: validation.errors,
      });
    }

    // Owner comes from the authenticated Passport session user.
    const ownerId = request.user._id;

    const projectDocument = buildProjectDocument(request.body, ownerId);

    const createdProject = await createProject(projectDocument);

    return response.status(201).json({
      success: true,
      data: createdProject,
      message: "Project created successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function editProject(request, response, next) {
  try {
    const existingProject = await getProjectById(request.params.id);

    if (!existingProject) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "Project not found.",
      });
    }

    const updatedProjectDocument = buildUpdatedProjectDocument(
      existingProject,
      request.body,
    );

    const validation = validateProject(updatedProjectDocument);

    if (!validation.isValid) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "Project validation failed.",
        errors: validation.errors,
      });
    }

    const updatedProject = await updateProjectById(
      request.params.id,
      updatedProjectDocument,
    );

    return response.status(200).json({
      success: true,
      data: updatedProject,
      message: "Project updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function removeProject(request, response, next) {
  try {
    const wasDeleted = await deleteProjectById(request.params.id);

    if (!wasDeleted) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "Project not found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: null,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
}
