"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  DatePicker,
  InputNumber,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getAccessToken, logout } from "@/lib/auth";
import { Document } from "@/types/document";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const router = useRouter();

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/documents", {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAdd = () => {
    setEditingDocument(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    form.setFieldsValue({
      ...document,
      uploadedAt: document.uploadedAt ? moment(document.uploadedAt) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/documents/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Document deleted successfully");
      fetchDocuments();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete document");
    }
  };

  const handleUpload = async (id: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        `http://localhost:3001/documents/${id}/upload`,
        { filePath: `/uploads/${file.name}` },
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      message.success("File uploaded successfully");
      fetchDocuments();
    } catch (error) {
      console.error(error);
      message.error("Failed to upload file");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        uploadedAt: values.uploadedAt
          ? values.uploadedAt.format("YYYY-MM-DD")
          : undefined,
      };
      if (editingDocument) {
        await axios.put(
          `http://localhost:3001/documents/${editingDocument.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Document updated successfully");
      } else {
        await axios.post("http://localhost:3001/documents", data, {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        message.success("Document added successfully");
      }
      setIsModalVisible(false);
      fetchDocuments();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save document");
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
    { title: "File Name", dataIndex: "fileName", key: "fileName" },
    { title: "File Path", dataIndex: "filePath", key: "filePath" },
    {
      title: "Uploaded At",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Document) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
          <Upload
            beforeUpload={(file) => {
              handleUpload(record.id, file);
              return false; // Prevent default upload
            }}
            showUploadList={false}
          >
            <Button style={{ marginLeft: "8px" }}>Upload</Button>
          </Upload>
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Documents</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Button type="primary" onClick={handleAdd} className="mb-6">
          Add Document
        </Button>
        <Table dataSource={documents} columns={columns} rowKey="id" />
        <Modal
          title={editingDocument ? "Edit Document" : "Add Document"}
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
              name="fileName"
              label="File Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="filePath"
              label="File Path"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="uploadedAt"
              label="Uploaded At"
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
