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

    const rawSearch =
      typeof request.query.search === "string" ? request.query.search : "";
    const search = rawSearch.trim().slice(0, 100);

    const { projects, totalProjects } = await getPublicProjects(
      page,
      limit,
      search,
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
