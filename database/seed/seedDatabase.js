import "dotenv/config";

import { MongoClient } from "mongodb";

import { generateProjects } from "./generateProjects.js";

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined.");
}

if (!databaseName) {
  throw new Error("MONGODB_DB_NAME is not defined.");
}

const client = new MongoClient(mongoUri);

async function seedDatabase() {
  try {
    await client.connect();

    const database = client.db(databaseName);
    const projectsCollection = database.collection("projects");
    const usersCollection = database.collection("users");
    const membershipsCollection = database.collection("team_memberships");

    const users = await usersCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();

    if (users.length === 0) {
      throw new Error("No users found. Import users before seeding projects.");
    }

    const ownerIds = users.map((user) => user._id);
    const projects = generateProjects(1000, ownerIds);

    await membershipsCollection.deleteMany({});
    await projectsCollection.deleteMany({});
    const result = await projectsCollection.insertMany(projects);

    console.log(
      `Inserted ${result.insertedCount} synthetic projects owned by ${ownerIds.length} users.`,
    );
    console.log("Cleared team memberships. Re-run seed-team-memberships if needed.");
  } finally {
    await client.close();
  }
}

seedDatabase().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exitCode = 1;
});
