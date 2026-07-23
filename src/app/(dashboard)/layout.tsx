import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sessionService } from "@/lib/session";
import DashboardLayout from "@/components/DashboardLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(sessionService.COOKIE_NAME)?.value;

  if (!jwt) {
    redirect("/login");
  }

  const result = await sessionService.validateFromJWT(jwt);

  if (!result) {
    redirect("/login?reason=session_expired");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
