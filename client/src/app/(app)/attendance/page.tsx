"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccessToken, logout } from "@/lib/auth";
import type { Attendance } from "@/types/attendance";

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(
    null,
  );
  const router = useRouter();

  const fetchAttendances = async () => {
    try {
      const response = await axios.get("http://localhost:3001/attendance", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setAttendances(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch attendances");
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleAdd = () => {
    setEditingAttendance(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (attendance: Attendance) => {
    setEditingAttendance(attendance);
    form.setFieldsValue({
      ...attendance,

      date: attendance.date ? moment(attendance.date) : null,
      clockIn: attendance.clockIn ? moment(attendance.clockIn) : null,
      clockOut: attendance.clockOut ? moment(attendance.clockOut) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/attendance/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Attendance deleted successfully");
      fetchAttendances();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete attendance");
    }
  };

  const handleClockIn = async (employeeId: number) => {
    try {
      await axios.post(
        `http://localhost:3001/attendance/clock-in/${employeeId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("Clocked in successfully");
      fetchAttendances();
    } catch (error) {
      console.error(error);
      message.error("Failed to clock in");
    }
  };

  const handleClockOut = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3001/attendance/clock-out/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("Clocked out successfully");
      fetchAttendances();
    } catch (error) {
      console.error(error);
      message.error("Failed to clock out");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const attendanceData = {
        ...values,
        employeeId: Number(values.employeeId),
        date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
        clockIn: values.clockIn
          ? values.clockIn.format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        clockOut: values.clockOut
          ? values.clockOut.format("YYYY-MM-DD HH:mm:ss")
          : undefined,
      };
      if (editingAttendance) {
        await axios.put(
          `http://localhost:3001/attendance/${editingAttendance.id}`,
          attendanceData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Attendance updated successfully");
      } else {
        await axios.post("http://localhost:3001/attendance", attendanceData, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        message.success("Attendance added successfully");
      }
      setIsModalVisible(false);
      fetchAttendances();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save attendance");
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Clock In",
      dataIndex: "clockIn",
      key: "clockIn",
      render: (clockIn: string) =>
        clockIn ? moment(clockIn).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: "Clock Out",
      dataIndex: "clockOut",
      key: "clockOut",
      render: (clockOut: string) =>
        clockOut ? moment(clockOut).format("YYYY-MM-DD HH:mm:ss") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Attendance) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
          {!record.clockIn && (
            <Button
              onClick={() => handleClockIn(record.employeeId)}
              style={{ marginLeft: "8px" }}
            >
              Clock In
            </Button>
          )}
          {record.clockIn && !record.clockOut && (
            <Button
              onClick={() => handleClockOut(record.id)}
              style={{ marginLeft: "8px" }}
            >
              Clock Out
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
          <h1 className="text-2xl font-bold">Attendance</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Button type="primary" onClick={handleAdd} className="mb-6">
          Add Attendance
        </Button>
        <Table dataSource={attendances} columns={columns} rowKey="id" />
        <Modal
          title={editingAttendance ? "Edit Attendance" : "Add Attendance"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="employeeId"
              label="Employee ID"
              rules={[{ required: true }]}
              normalize={(value) => (value ? Number(value) : undefined)}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="clockIn" label="Clock In">
              <DatePicker
                showTime
                style={{ width: "100%" }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
            <Form.Item name="clockOut" label="Clock Out">
              <DatePicker
                showTime
                style={{ width: "100%" }}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
