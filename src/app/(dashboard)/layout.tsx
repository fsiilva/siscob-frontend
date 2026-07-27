import { ApplicationShell } from "@/components/layout/application-shell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApplicationShell>{children}</ApplicationShell>;
}
