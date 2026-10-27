import { db } from "../src/lib/db";

async function main() {
  const users = await db.user.count();
  console.log("users", users, "env", process.env.DATABASE_URL);
  await db.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
