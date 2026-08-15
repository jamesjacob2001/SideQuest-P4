import { ObjectId } from "mongodb";

import { getProjectById } from "../services/projectService.js";
import {
  createTeamMembership,
  deletePendingTeamMembership,
  findExistingApplication,
  getApplicantMembershipsWithProjects,
  getIncomingMembershipsForOwner,
  getProjectMembershipsWithApplicants,
  getTeamMembershipById,
  updateTeamMembershipStatus,
  getAcceptedProjectMembers,
} from "../services/teamMembershipService.js";

export async function addTeamMembership(request, response, next) {
  try {
    const { projectId, roleId } = request.body;

    if (!projectId || !roleId) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "Project ID and role ID are required.",
      });
    }

    if (!ObjectId.isValid(projectId)) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "The provided project ID is invalid.",
      });
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "Project not found.",
      });
    }

    const applicantId = request.user._id;
    const ownerId = project.ownerId;

    if (String(applicantId) === String(ownerId)) {
      return response.status(403).json({
        success: false,
        data: null,
        message: "Project owners cannot apply to their own projects.",
      });
    }

    const selectedRole = project.roles.find((role) => role.roleId === roleId);

    if (!selectedRole) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "The selected project role was not found.",
      });
    }

    const existingApplication = await findExistingApplication(
      projectId,
      applicantId,
    );

    if (existingApplication) {
      return response.status(409).json({
        success: false,
        data: null,
        message: "You have already applied to this project.",
      });
    }

    const currentDate = new Date();

    const membershipDocument = {
      projectId: new ObjectId(projectId),
      applicantId: new ObjectId(applicantId),
      roleId: selectedRole.roleId,
      roleTitle: selectedRole.title,
      status: "pending",
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const createdMembership = await createTeamMembership(membershipDocument);

    return response.status(201).json({
      success: true,
      data: createdMembership,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({
        success: false,
        data: null,
        message: "You have already applied to this project.",
      });
    }

    return next(error);
  }
}

export async function listMyTeamMemberships(request, response, next) {
  try {
    const memberships = await getApplicantMembershipsWithProjects(
      request.user._id,
    );

    return response.status(200).json({
      success: true,
      data: {
        memberships,
      },
      message: "Applications retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function listIncomingTeamMemberships(request, response, next) {
  try {
    const memberships = await getIncomingMembershipsForOwner(request.user._id);

    return response.status(200).json({
      success: true,
      data: {
        memberships,
      },
      message: "Incoming applications retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function listProjectTeamMemberships(request, response, next) {
  try {
    const { projectId } = request.params;

    if (!ObjectId.isValid(projectId)) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "The provided project ID is invalid.",
      });
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "Project not found.",
      });
    }

    const authenticatedUserId = request.user._id.toString();

    const projectOwnerId =
      project.ownerId?.toString?.() ?? String(project.ownerId);

    if (authenticatedUserId !== projectOwnerId) {
      return response.status(403).json({
        success: false,
        data: null,
        message: "Only the project owner can view these applications.",
      });
    }

    const memberships = await getProjectMembershipsWithApplicants(projectId);

    return response.status(200).json({
      success: true,
      data: {
        project: {
          _id: project._id,
          title: project.title,
        },
        memberships,
      },
      message: "Project applications retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateMembershipStatus(request, response, next) {
  try {
    const { membershipId } = request.params;
    const { status } = request.body;

    if (!ObjectId.isValid(membershipId)) {
      return response.status(400).json({
        success: false,
        message: "Invalid membership ID.",
      });
    }

    if (status !== "accepted" && status !== "rejected") {
      return response.status(400).json({
        success: false,
        message: "Status must be accepted or rejected.",
      });
    }

    const membership = await getTeamMembershipById(membershipId);

    if (!membership) {
      return response.status(404).json({
        success: false,
        message: "Membership not found.",
      });
    }

    const project = await getProjectById(membership.projectId.toString());

    if (!project) {
      return response.status(404).json({
        success: false,
        message: "Associated project not found.",
      });
    }

    if (project.ownerId.toString() !== request.user._id.toString()) {
      return response.status(403).json({
        success: false,
        message: "Only the project owner may update applications.",
      });
    }

    const updatedMembership = await updateTeamMembershipStatus(
      membershipId,
      status,
    );

    if (!updatedMembership) {
      return response.status(409).json({
        success: false,
        message: "Only pending applications may be updated.",
      });
    }

    return response.status(200).json({
      success: true,
      data: updatedMembership,
      message: "Application updated.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function withdrawMembership(request, response, next) {
  try {
    const { membershipId } = request.params;

    if (!ObjectId.isValid(membershipId)) {
      return response.status(400).json({
        success: false,
        message: "Invalid membership ID.",
      });
    }

    const deleted = await deletePendingTeamMembership(
      membershipId,
      request.user._id,
    );

    if (!deleted) {
      return response.status(404).json({
        success: false,
        message: "Pending application not found.",
      });
    }

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listCurrentProjectTeam(request, response, next) {
  try {
    const { projectId } = request.params;

    if (!ObjectId.isValid(projectId)) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "The provided project ID is invalid.",
      });
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "Project not found.",
      });
    }

    const members = await getAcceptedProjectMembers(projectId);

    return response.status(200).json({
      success: true,
      data: {
        members,
      },
      message: "Current team retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}
