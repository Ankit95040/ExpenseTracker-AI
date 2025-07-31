import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const CheckUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Check if user already exists in your DB
  let loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  // If not, create the user
  if (!loggedInUser) {
    loggedInUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
        imageUrl: user.imageUrl || "",
        createdAt: new Date(),
      },
    });
    console.log("New user created:", loggedInUser);
  }

  return loggedInUser;
};
