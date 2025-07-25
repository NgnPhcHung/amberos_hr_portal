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
import type { Payroll } from "@/types/payroll";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const router = useRouter();

  const fetchPayrolls = async () => {
    try {
      const response = await axios.get("http://localhost:3001/payroll", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setPayrolls(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch payrolls");
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleAdd = () => {
    setEditingPayroll(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    form.setFieldsValue({
      ...payroll,
      date: payroll.date ? moment(payroll.date) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/payroll/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Payroll deleted successfully");
      fetchPayrolls();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete payroll");
    }
  };

  const handleGeneratePayslip = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3001/payroll/${id}/payslip`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("Payslip generated successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to generate payslip");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payrollData = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
      };
      if (editingPayroll) {
        await axios.put(
          `http://localhost:3001/payroll/${editingPayroll.id}`,
          payrollData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Payroll updated successfully");
      } else {
        await axios.post("http://localhost:3001/payroll", payrollData, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        message.success("Payroll added successfully");
      }
      setIsModalVisible(false);
      fetchPayrolls();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save payroll");
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
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Deductions",
      dataIndex: "deductions",
      key: "deductions",
      render: (val?: number) => val ?? "-",
    },
    {
      title: "Bonuses",
      dataIndex: "bonuses",
      key: "bonuses",
      render: (val?: number) => val ?? "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Payroll) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
          <Button
            onClick={() => handleGeneratePayslip(record.id)}
            style={{ marginLeft: "8px" }}
          >
            Generate Payslip
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Payroll</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Button type="primary" onClick={handleAdd} className="mb-6">
          Add Payroll
        </Button>
        <Table dataSource={payrolls} columns={columns} rowKey="id" />
        <Modal
          title={editingPayroll ? "Edit Payroll" : "Add Payroll"}
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
              name="amount"
              label="Amount"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="deductions" label="Deductions">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="bonuses" label="Bonuses">
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
