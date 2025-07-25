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
import { PerformanceReview } from "@/types/performan-review";

export default function PerformanceReviewsPage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(
    null,
  );
  const router = useRouter();

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/performance-reviews",
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        },
      );
      setReviews(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAdd = () => {
    setEditingReview(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (review: PerformanceReview) => {
    setEditingReview(review);
    form.setFieldsValue({
      ...review,
      reviewDate: review.reviewDate ? moment(review.reviewDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/performance-reviews/${id}`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      message.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete review");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const reviewData = {
        ...values,
        reviewDate: values.reviewDate
          ? values.reviewDate.format("YYYY-MM-DD")
          : undefined,
      };
      if (editingReview) {
        await axios.put(
          `http://localhost:3001/performance-reviews/${editingReview.id}`,
          reviewData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Review updated successfully");
      } else {
        await axios.post(
          "http://localhost:3001/performance-reviews",
          reviewData,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          },
        );
        message.success("Review added successfully");
      }
      setIsModalVisible(false);
      fetchReviews();
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Failed to save review");
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
      title: "Review Date",
      dataIndex: "reviewDate",
      key: "reviewDate",
      render: (date: string) =>
        date ? moment(date).format("YYYY-MM-DD") : "-",
    },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (val?: string) => val ?? "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PerformanceReview) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Performance Reviews</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <Button type="primary" onClick={handleAdd} className="mb-6">
          Add Review
        </Button>
        <Table dataSource={reviews} columns={columns} rowKey="id" />
        <Modal
          title={editingReview ? "Edit Review" : "Add Review"}
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
              name="reviewDate"
              label="Review Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="comments" label="Comments">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
