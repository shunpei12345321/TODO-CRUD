export const dynamic = "force-dynamic";

import React from "react";
import HomeScreen from "../home/_components/HomeScreen";
import { UserRepository, User } from "../_repositories/User";

export default async function HomePage() {
  const users: User[] = await UserRepository.findMany();
  return (
    <div>
      <HomeScreen users={users} />
    </div>
  );
}
