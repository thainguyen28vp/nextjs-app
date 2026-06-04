import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  console.log("aaaaaaaaaa", session);
  return <div>Dashboard</div>;
}
