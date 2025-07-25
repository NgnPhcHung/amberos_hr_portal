"use client";

import { login, setTokens } from "@/lib/auth";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const { accessToken, refreshToken } = await login(
        values.username,
        values.password,
      );
      setTokens(accessToken, refreshToken);
      router.push("/");
    } catch {
      message.error("Invalid credentials");
    }
  };

  return (
    <div className="p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
        <div className="text-center">
          <a href="/register">Register</a>
        </div>
      </Form>
    </div>
  );
}
