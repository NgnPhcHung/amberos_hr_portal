"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Switch,
  InputNumber,
} from "antd";
import axios from "axios";
import moment from "moment";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccessToken, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3001/notifications", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAdd = () => {
    setEditingNotification(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification);
    form.setFieldsValue({
      ...notification,
      createdAt: notification.createdAt ? moment(notification.createdAt) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/notifications/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Notification deleted successfully");
      fetchNotifications();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete notification");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3001/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("Marked as read successfully");
      fetchNotifications();
    } catch (error) {
      console.error(error);
      message.error("Failed to mark as read");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        createdAt: values.createdAt
          ? values.createdAt.format("YYYY-MM-DD")
          : null,
        read: Boolean(values.read),
      };
      if (editingNotification) {
        await axios.put(
          `http://localhost:3001/notifications/${editingNotification.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Notification updated successfully");
      } else {
        await axios.post("http://localhost:3001/notifications", data, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        message.success("Notification added successfully");
      }
      setIsModalVisible(false);
      fetchNotifications();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save notification");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
      message.error("Failed to logout");
    }
  };

  const columns = [
    { title: "User ID", dataIndex: "userId", key: "userId" },
    { title: "Message", dataIndex: "message", key: "message" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Read",
      dataIndex: "read",
      key: "read",
      render: (read: boolean) => (read ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Notification) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
          {!record.read && (
            <Button
              onClick={() => handleMarkAsRead(record.id)}
              style={{ marginLeft: "8px" }}
            >
              Mark as Read
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Button type="primary" onClick={handleAdd} className="mb-6">
          Add Notification
        </Button>
        <Table dataSource={notifications} columns={columns} rowKey="id" />
        <Modal
          title={editingNotification ? "Edit Notification" : "Add Notification"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="userId"
              label="User ID"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="createdAt"
              label="Created At"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="read" label="Read" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
