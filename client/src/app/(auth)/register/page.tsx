"use client";

import { register, setTokens } from "@/lib/auth";
import { Form, Input, Button, DatePicker, message } from "antd";
import Card from "antd/es/card/Card";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const registerData = {
        ...values,
        hireDate: values.hireDate.format("YYYY-MM-DD"),
      };
      const { accessToken, refreshToken } = await register(registerData);
      setTokens(accessToken, refreshToken);
      router.push("/");
    } catch {
      message.error("Registration failed");
    }
  };

  return (
    <Card title="Register">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="grid grid-cols-2 gap-2">
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
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hireDate"
            label="Hire Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
        <div className="text-center">
          <a href="/login">Already have an account? Login</a>
        </div>
      </Form>
    </Card>
  );
}
