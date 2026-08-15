import { randomUUID } from "node:crypto";

import { PROJECT_CATEGORIES } from "../../server/constants/categories.js";
import { EXPERIENCE_LEVELS } from "../../server/constants/experienceLevels.js";
import { LOCATION_TYPES } from "../../server/constants/locationTypes.js";
import { PROJECT_STATUSES } from "../../server/constants/projectStatuses.js";
import { TECHNOLOGY_LIST } from "../../server/constants/technologyList.js";

import { WEEKLY_COMMITMENTS } from "../../server/constants/weeklyCommitments.js";
import { PROJECT_DURATIONS } from "../../server/constants/projectDurations.js";

import { PROJECT_THEMES } from "./data/projectThemes.js";
import { PROJECT_TAGLINES } from "./data/projectTaglines.js";
import { PROJECT_OVERVIEWS } from "./data/projectOverviews.js";
import { PROJECT_GOALS } from "./data/projectGoals.js";
import { PROJECT_PROGRESS } from "./data/projectProgress.js";
import { PROJECT_LOOKING_FOR } from "./data/projectLookingFor.js";
import { ROLE_TEMPLATES } from "./data/roleTemplates.js";

const LOCATIONS = [
  "Boston, MA",
  "Cambridge, MA",
  "Remote",
  "New York, NY",
  "Seattle, WA",
  "San Francisco, CA",
  "Chicago, IL",
  "Austin, TX",
];

const TITLE_SUFFIXES = [
  "",
  "Beta",
  "Campus Edition",
  "Community Edition",
  "Prototype",
  "Student Edition",
  "MVP",
  "Labs",
];

function generateProjectTitle(theme) {
  const baseTitle = randomItem(theme.titles);
  const suffix = randomItem(TITLE_SUFFIXES);

  return suffix ? `${baseTitle} — ${suffix}` : baseTitle;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function findRoleTemplate(roleTitle) {
  return ROLE_TEMPLATES.find(
    (roleTemplate) => roleTemplate.title === roleTitle,
  );
}

function randomInteger(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function randomSubset(items, minimum, maximum) {
  const shuffledItems = [...items].sort(() => Math.random() - 0.5);
  const count = randomInteger(minimum, Math.min(maximum, shuffledItems.length));

  return shuffledItems.slice(0, count);
}

function generateRoles(theme, count) {
  const selectedRoleTitles = randomSubset(theme.roleTypes, count, count);

  return selectedRoleTitles.map((roleTitle) => {
    const roleTemplate = findRoleTemplate(roleTitle);

    if (!roleTemplate) {
      throw new Error(`Missing role template: ${roleTitle}`);
    }

    const compatibleSkills = roleTemplate.suggestedSkills.filter(
      (skill) =>
        theme.technologies.includes(skill) || !TECHNOLOGY_LIST.includes(skill),
    );

    const availableSkills =
      compatibleSkills.length > 0
        ? compatibleSkills
        : randomSubset(
            theme.technologies,
            1,
            Math.min(3, theme.technologies.length),
          );

    return {
      roleId: randomUUID(),
      title: roleTemplate.title,
      description: roleTemplate.description,
      requiredSkills: randomSubset(availableSkills, 1, availableSkills.length),
      experienceLevel: randomItem(EXPERIENCE_LEVELS),
      totalPositions: randomInteger(1, 3),
    };
  });
}

function generateCreatedAt(index) {
  const now = Date.now();
  const daysAgo = index % 365;
  const randomHours = randomInteger(0, 23);

  return new Date(
    now - daysAgo * 24 * 60 * 60 * 1000 - randomHours * 60 * 60 * 1000,
  );
}

export function generateProjects(count = 1000, ownerIds = []) {
  if (!Array.isArray(ownerIds) || ownerIds.length === 0) {
    throw new Error(
      "generateProjects requires a non-empty ownerIds array of user _id values.",
    );
  }

  return Array.from({ length: count }, (_, index) => {
    const theme = randomItem(PROJECT_THEMES);
    const locationType = randomItem(LOCATION_TYPES);
    const status = randomItem(PROJECT_STATUSES);

    const selectedCategories = randomSubset(
      theme.categories.filter((category) =>
        PROJECT_CATEGORIES.includes(category),
      ),
      1,
      2,
    );

    const selectedTechnologies = randomSubset(
      theme.technologies.filter((technology) =>
        TECHNOLOGY_LIST.includes(technology),
      ),
      2,
      5,
    );

    const roleCount = randomInteger(1, 3);

    return {
      ownerId: ownerIds[index % ownerIds.length],
      title: generateProjectTitle(theme, index),
      tagline:
        theme.taglines?.length > 0
          ? randomItem(theme.taglines)
          : randomItem(PROJECT_TAGLINES),
      description: {
        overview: `${randomItem(PROJECT_OVERVIEWS)} The project focuses on ${theme.name.toLowerCase()}.`,
        goals: randomItem(PROJECT_GOALS),
        currentProgress: randomItem(PROJECT_PROGRESS),
        lookingFor: randomItem(PROJECT_LOOKING_FOR),
      },
      categories: selectedCategories,
      customCategories: [],
      technologies: selectedTechnologies,
      roles: generateRoles(theme, roleCount),
      experienceLevel: randomItem(EXPERIENCE_LEVELS),
      locationType,
      status,
      ...(locationType !== "Remote" && {
        location: randomItem(
          LOCATIONS.filter((location) => location !== "Remote"),
        ),
      }),
      weeklyCommitment: randomItem(WEEKLY_COMMITMENTS),
      duration: randomItem(PROJECT_DURATIONS),
      createdAt: generateCreatedAt(index),
    };
  });
}
