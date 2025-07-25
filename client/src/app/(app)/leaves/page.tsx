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
  InputNumber,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccessToken, logout } from "@/lib/auth";
import { LeaveRequest } from "@/types/leave";

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const router = useRouter();

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:3001/leaves", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAdd = () => {
    setEditingLeave(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (leave: LeaveRequest) => {
    setEditingLeave(leave);
    form.setFieldsValue({
      ...leave,
      startDate: leave.startDate ? moment(leave.startDate) : null,
      endDate: leave.endDate ? moment(leave.endDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/leaves/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Leave deleted successfully");
      fetchLeaves();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete leave");
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.get(`http://localhost:3001/leaves/${id}/approve`, {
        headers: { Authorization: "Bearer ${getAccessToken()}" },
      });
      message.success("Leave request approved");
      fetchLeaves();
    } catch (error) {
      console.error(error);
      message.error("Failed to approve leave");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3001/leaves/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("Leave rejected successfully");
      fetchLeaves();
    } catch (error) {
      console.error(error);
      message.error("Failed to reject leave");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate
          ? values.startDate.format("YYYY-MM-DD")
          : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
      };
      if (editingLeave) {
        await axios.put(
          `http://localhost:3001/leaves/${editingLeave.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Leave updated successfully");
      } else {
        await axios.post("http://localhost:3001/leaves", data, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        message.success("Leave added successfully");
      }
      setIsModalVisible(false);
      fetchLeaves();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save leave");
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
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (val?: string) => val ?? "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: LeaveRequest) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                onClick={() => handleApprove(record.id)}
                style={{ marginLeft: "8px" }}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(record.id)}
                danger
                style={{ marginLeft: "8px" }}
              >
                Reject
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Leaves</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Button type="primary" onClick={handleAdd} className="mb-6">
          Add Leave Request
        </Button>
        <Table dataSource={leaves} columns={columns} rowKey="id" />
        <Modal
          title={editingLeave ? "Edit Leave Request" : "Add Leave Request"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="reason" label="Reason">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
