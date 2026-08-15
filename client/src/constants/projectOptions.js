export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "AI / Machine Learning",
  "Data Science",
  "Game Development",
  "Research",
  "Robotics",
  "Open Source",
  "Entrepreneurship",
  "Design",
  "Creative",
  "Other",
];

export const TECHNOLOGY_OPTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "SQLite",
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Docker",
  "Git",
  "GitHub",
  "AWS",
  "Firebase",
  "TensorFlow",
  "PyTorch",
  "Figma",
  "Unity",
  "Unreal Engine",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Go",
  "Rust",
  "Linux",
  "Redis",
  "GraphQL",
];

export const EXPERIENCE_LEVELS = [
  "Open to All Levels",
  "Beginner Friendly",
  "Intermediate",
  "Advanced",
];

export const LOCATION_TYPES = ["Remote", "Hybrid", "In Person"];

export const PROJECT_STATUS_OPTIONS = [
  {
    value: "Recruiting",
    description: "Looking for new teammates",
  },
  {
    value: "Active",
    description: "Work is underway",
  },
  {
    value: "Paused",
    description: "Temporarily on hold",
  },
];

export const ALL_PROJECT_STATUS_OPTIONS = [
  ...PROJECT_STATUS_OPTIONS,
  {
    value: "Completed",
    description: "Finished",
  },
];

export const PROJECT_STATUSES = PROJECT_STATUS_OPTIONS.map(
  (status) => status.value,
);

export const PROJECT_STATUS_DESCRIPTIONS = Object.fromEntries(
  ALL_PROJECT_STATUS_OPTIONS.map((status) => [
    status.value,
    status.description,
  ]),
);
