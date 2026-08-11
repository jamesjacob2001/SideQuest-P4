import MongoStore from "connect-mongo";
import session from "express-session";

export function createSessionMiddleware() {
  const secret = process.env.SESSION_SECRET;
  const mongoUrl = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME || "sidequest";

  if (!secret) {
    throw new Error("SESSION_SECRET is not defined.");
  }

  if (!mongoUrl) {
    throw new Error("MONGODB_URI is not defined.");
  }

  const isProduction = process.env.NODE_ENV === "production";

  return session({
    secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl,
      dbName: databaseName,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    },
  });
}
