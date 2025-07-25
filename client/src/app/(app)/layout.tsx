"use client";

import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";

const { Sider, Content } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Layout className="h-screen bg-background">
      <Sider>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="h-full"
          items={[
            {
              key: "1",
              label: "Employees",
              onClick: () => router.push("/"),
            },
            {
              key: "3",
              label: "Attendance",
              onClick: () => router.push("/attendance"),
            },
            {
              key: "4",
              label: "Payroll",
              onClick: () => router.push("/payroll"),
            },
            {
              key: "5",
              label: "Performance Reviews",
              onClick: () => router.push("/performance-reviews"),
            },
            {
              key: "6",
              label: "Leaves",
              onClick: () => router.push("/leaves"),
            },
            {
              key: "7",
              label: "Documents",
              onClick: () => router.push("/documents"),
            },
            {
              key: "8",
              label: "Notifications",
              onClick: () => router.push("/notifications"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content className="p-6">{children}</Content>
      </Layout>
    </Layout>
  );
}
