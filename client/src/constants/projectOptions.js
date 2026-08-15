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

export const WEEKLY_COMMITMENTS = [
  "1 – 3 hours",
  "2 – 4 hours",
  "4 – 6 hours",
  "5 – 8 hours",
  "8 – 10 hours",
];

export const PROJECT_DURATIONS = [
  "1 month",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Ongoing",
];

export const PROJECT_STATUS_OPTIONS = [
  {
    value: "Open",
    description: "Looking for new teammates",
  },
  {
    value: "In progress",
    description: "Team is working; not taking new people",
  },
  {
    value: "On hold",
    description: "Temporarily stopped",
  },
  {
    value: "Finished",
    description: "Project is done",
  },
];

export const ALL_PROJECT_STATUS_OPTIONS = PROJECT_STATUS_OPTIONS;

export const PROJECT_STATUSES = PROJECT_STATUS_OPTIONS.map(
  (status) => status.value,
);

export const PROJECT_STATUS_DESCRIPTIONS = Object.fromEntries(
  PROJECT_STATUS_OPTIONS.map((status) => [status.value, status.description]),
);
