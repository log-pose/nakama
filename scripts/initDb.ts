import psqlClient from "conf/db";
import { roles } from "db/schema";

async function initDb() {
  try {
    await psqlClient
      .insert(roles)
      .values([{ role_name: "admin" }, { role_name: "user" }])
      .onConflictDoNothing();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to initialize database");
  }
}

export default initDb;
