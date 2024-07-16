// Departments.tsx
"use client";

import {
  Avatar,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Mentions,
  Breadcrumb,
  Flex,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";
import styles from "./page.module.css";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { companiesList, userInfo } from "@/selector/userSelector";
import type { GetProp, MentionProps } from "antd";

interface Department {
  _id: string;
  name: string;
  description: string;
  owners: string[]; // Array of owner user IDs
  memberAccesses: string[]; // Array of group access user IDs
}
type MentionsOptionProps = GetProp<MentionProps, "options">[number];

const onSelect = (option: MentionsOptionProps) => {
  console.log("select", option);
};

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  const companiesState = useAppSelector(companiesList);
  const [isOwner, setIsOwner] = useState(false);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);

  useEffect(() => {
    if (companiesState?.companies && companiesState.companies?.length > 0) {
      getMembers();
      fetchDepartments();
      const userId = userState.currentUser?.userId;
      const listOfOwnershipCompanies = companiesState.companies.filter((item) =>
        userId ? item.owner.includes(userId) : false
      );
      if (listOfOwnershipCompanies.length > 0) setIsOwner(true);
    }
  }, [companiesState]);

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(
        `/members/${companiesState.companies?.[0]?._id}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setMembersList(response.data.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axiosClient.get("/departments");
      if (response.status === 200 && response.data) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleCreateDepartment = async (values: any) => {
    try {
      const response = await axiosClient.post("/departments", values);
      if (response.status === 201 && response.data) {
        setDepartments([...departments, response.data.data]);
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Failed to create department:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle mentions in inputs

  return (
    <div className={styles.wrapper}>
      <Flex align="center" justify="space-between" style={{ width: "100%" }}>
        <Breadcrumb
          style={{ cursor: "pointer" }}
          items={[
            {
              onClick: () => {
                router.push("/");
              },
              title: <HomeOutlined />,
            },
            {
              onClick: () => {
                router.push("/");
              },
              title: (
                <>
                  <UserOutlined />
                  <span>Application List</span>
                </>
              ),
            },
            {
              title: "Departments",
            },
          ]}
        />
        {isOwner && (
          <Button type="primary" onClick={showModal}>
            Create New Department
          </Button>
        )}
      </Flex>
      <div className={styles.cardContainer}>
        {departments.map((department) => (
          <Card
            key={department._id}
            title={department.name}
            style={{ width: 300 }}
          >
            <p>{department.description}</p>
            <p>Owners: {department.owners.join(", ")}</p>
            <p>Group Accesses: {department.memberAccesses.join(", ")}</p>
          </Card>
        ))}
      </div>

      <Modal
        title="Create New Department"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateDepartment}>
          <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="owners"
            label="Department Owners"
            rules={[
              { required: true, message: "Please select department owners" },
            ]}
          >
            <Mentions
              placeholder="Type @ to mention"
              style={{ width: "100%" }}
              onSelect={onSelect}
              defaultValue=""
              options={membersList.map((member) => ({
                value: member.fullName,
                label: (
                  <Space>
                    <Avatar size="small" src={member.avatar} />
                    <div>{member.fullName}</div>
                  </Space>
                ),
                key: member._id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="memberAccesses"
            label="Member Accesses"
            rules={[
              { required: true, message: "Please select member accesses" },
            ]}
          >
            <Mentions
              placeholder="Type @ to mention"
              style={{ width: "100%" }}
              onSelect={onSelect}
              defaultValue=""
              options={membersList.map((member) => ({
                value: member.fullName,
                label: (
                  <Space>
                    <Avatar size="small" src={member.avatar} />
                    <div>{member.fullName}</div>
                  </Space>
                ),
                key: member._id,
              }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
