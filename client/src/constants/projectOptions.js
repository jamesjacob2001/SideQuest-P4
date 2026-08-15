export const PROJECT_CATEGORIES = [
  "Arts & Crafts",
  "Music & Performance",
  "Writing & Media",
  "Film & Photography",
  "Education & Mentoring",
  "Community Impact",
  "Food & Hospitality",
  "Health & Wellness",
  "Sports & Recreation",
  "Events & Organizing",
  "Entrepreneurship",
  "Design",
  "Sustainability",
  "Research",
  "Creative",
  "Web Development",
  "Mobile Development",
  "AI / Machine Learning",
  "Data Science",
  "Game Development",
  "Open Source",
  "Technology",
  "Other",
];

export const TECHNOLOGY_OPTIONS = [
  "Writing",
  "Editing",
  "Research",
  "Public Speaking",
  "Event Planning",
  "Social Media",
  "Photography",
  "Videography",
  "Graphic Design",
  "Illustration",
  "Music Production",
  "Teaching",
  "Mentoring",
  "Fundraising",
  "Marketing",
  "Project Management",
  "Community Outreach",
  "Cooking",
  "Baking",
  "Fitness Coaching",
  "Organizing",
  "User Research",
  "Content Creation",
  "Copywriting",
  "Canva",
  "Figma",
  "Spreadsheets",
  "Data Analysis",
  "Budgeting",
  "Logistics",
  "Stage Management",
  "Interviewing",
  "Facilitation",
  "Grant Writing",
  "Translation",
  "Gardening",
  "Sustainability",
  "Podcasting",
  "Journalism",
  "Leadership",
  "Customer Service",
  "Video Editing",
  "Web Design",
  "Programming",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Java",
  "C++",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Git",
  "GitHub",
  "AWS",
  "Firebase",
  "TensorFlow",
  "PyTorch",
  "Unity",
  "Unreal Engine",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Docker",
  "SQL",
  "Machine Learning",
  "Testing",
  "Accessibility",
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
    value: "Recruiting",
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
