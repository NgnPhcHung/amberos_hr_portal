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
} from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccessToken, logout } from "@/lib/auth";
import { Employee } from "@/types/employee";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const router = useRouter();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/employees?includeArchived=${showArchived}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [showArchived]);

  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      ...employee,
      hireDate: employee.hireDate ? moment(employee.hireDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleArchive = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/employees/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Employee archived successfully");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      message.error("Failed to archive employee");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3001/employees/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("Employee restored successfully");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      message.error("Failed to restore employee");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const employeeData = {
        ...values,
        hireDate: values.hireDate
          ? values.hireDate.format("YYYY-MM-DD")
          : undefined,
      };
      console.log("Employee Data:", employeeData);
      if (editingEmployee) {
        await axios.put(
          `http://localhost:3001/employees/${editingEmployee.id}`,
          employeeData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Employee updated successfully");
      } else {
        await axios.post("http://localhost:3001/employees", employeeData, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        message.success("Employee added successfully");
      }
      setIsModalVisible(false);
      fetchEmployees();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save employee");
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
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Department", dataIndex: "department", key: "department" },
    {
      title: "Hire Date",
      dataIndex: "hireDate",
      key: "hireDate",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Status",
      dataIndex: "isArchived",
      key: "isArchived",
      render: (isArchived: boolean) => (isArchived ? "Archived" : "Active"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Employee) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            disabled={record.isArchived}
          >
            Edit
          </Button>
          {record.isArchived ? (
            <Button
              onClick={() => handleRestore(record.id)}
              style={{ marginLeft: "8px" }}
            >
              Restore
            </Button>
          ) : (
            <Button
              onClick={() => handleArchive(record.id)}
              danger
              style={{ marginLeft: "8px" }}
            >
              Archive
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
          <h1 className="text-2xl font-bold">Employees</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <div className="flex justify-between mb-6">
          <Button type="primary" onClick={handleAdd}>
            Add Employee
          </Button>
          <Switch
            checked={showArchived}
            onChange={setShowArchived}
            checkedChildren="Show Archived"
            unCheckedChildren="Hide Archived"
          />
        </div>
        <Table dataSource={employees} columns={columns} rowKey="id" />
        <Modal
          title={editingEmployee ? "Edit Employee" : "Add Employee"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
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
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
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
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
