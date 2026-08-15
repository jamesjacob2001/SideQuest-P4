import {
  deleteUserAndRelatedData,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  listUsers,
  updateUserById,
} from "../services/userService.js";
import { getProjectsOwnedByUser } from "../services/projectService.js";
import { sanitizeUser, sanitizeUsers } from "../utils/sanitizeUser.js";
import { validateProfileUpdate } from "../utils/validators/userValidator.js";

const ALLOWED_PROFILE_FIELDS = [
  "username",
  "name",
  "email",
  "university",
  "major",
  "graduationYear",
  "yearLabel",
  "bio",
  "technicalSkills",
  "interests",
  "rolePreferences",
  "experienceLevel",
  "availability",
  "portfolioLinks",
  "profileImageUrl",
  "location",
  "isRecruiting",
];

function normalizeStringArray(values) {
  return values.map((value) => value.trim());
}

function buildProfileUpdates(requestBody) {
  const updates = {};

  for (const field of ALLOWED_PROFILE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(requestBody, field)) {
      continue;
    }

    const value = requestBody[field];

    if (field === "email" && typeof value === "string") {
      updates.email = value.trim().toLowerCase();
      continue;
    }

    if (field === "username" && typeof value === "string") {
      updates.username = value.trim();
      continue;
    }

    if (
      (field === "name" ||
        field === "university" ||
        field === "major" ||
        field === "bio" ||
        field === "profileImageUrl" ||
        field === "location" ||
        field === "yearLabel" ||
        field === "experienceLevel" ||
        field === "availability") &&
      typeof value === "string"
    ) {
      updates[field] = value.trim();
      continue;
    }

    if (
      field === "technicalSkills" ||
      field === "interests" ||
      field === "rolePreferences"
    ) {
      updates[field] = normalizeStringArray(value);
      continue;
    }

    if (field === "portfolioLinks" && value && typeof value === "object") {
      updates.portfolioLinks = {
        github:
          typeof value.github === "string" ? value.github.trim() : value.github,
        linkedin:
          typeof value.linkedin === "string"
            ? value.linkedin.trim()
            : value.linkedin,
        personalSite:
          typeof value.personalSite === "string"
            ? value.personalSite.trim()
            : value.personalSite,
      };
      continue;
    }

    updates[field] = value;
  }

  return updates;
}

export async function listPublicUsers(request, response, next) {
  try {
    const users = await listUsers();

    return response.status(200).json({
      success: true,
      data: sanitizeUsers(users),
      message: "Users retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function showUser(request, response, next) {
  try {
    const user = await findUserById(request.params.id);

    if (!user) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "User not found.",
      });
    }

    const ownedProjects = await getProjectsOwnedByUser(request.params.id);

    return response.status(200).json({
      success: true,
      data: {
        ...sanitizeUser(user),
        ownedProjects,
      },
      message: "User retrieved successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

// Ownership is enforced by requireAuth + requireSelf middleware.
export async function editUser(request, response, next) {
  try {
    const existingUser = await findUserById(request.params.id);

    if (!existingUser) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "User not found.",
      });
    }

    const profileUpdates = buildProfileUpdates(request.body);
    const validation = validateProfileUpdate(profileUpdates);

    if (!validation.isValid) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "Profile validation failed.",
        errors: validation.errors,
      });
    }

    if (Object.keys(profileUpdates).length === 0) {
      return response.status(400).json({
        success: false,
        data: null,
        message: "No valid profile fields were provided to update.",
      });
    }

    if (profileUpdates.email) {
      const userWithEmail = await findUserByEmail(profileUpdates.email);

      if (
        userWithEmail &&
        userWithEmail._id.toString() !== existingUser._id.toString()
      ) {
        return response.status(409).json({
          success: false,
          data: null,
          message: "Email is already in use.",
        });
      }
    }

    if (profileUpdates.username) {
      const userWithUsername = await findUserByUsername(
        profileUpdates.username,
      );

      if (
        userWithUsername &&
        userWithUsername._id.toString() !== existingUser._id.toString()
      ) {
        return response.status(409).json({
          success: false,
          data: null,
          message: "Username is already in use.",
        });
      }
    }

    const updatedUser = await updateUserById(request.params.id, profileUpdates);

    return response.status(200).json({
      success: true,
      data: sanitizeUser(updatedUser),
      message: "Profile updated successfully.",
    });
  } catch (error) {
    return next(error);
  }
}

// Ownership is enforced by requireAuth + requireSelf middleware.
export async function removeUser(request, response, next) {
  try {
    const wasDeleted = await deleteUserAndRelatedData(request.params.id);

    if (!wasDeleted) {
      return response.status(404).json({
        success: false,
        data: null,
        message: "User not found.",
      });
    }

    return response.status(200).json({
      success: true,
      data: null,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
}
