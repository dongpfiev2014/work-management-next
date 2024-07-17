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
  Typography,
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
  departmentName: string;
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
      const response = await axiosClient.get(
        `/departments/${companiesState.companies?.[0]._id}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleCreateDepartment = async (values: any) => {
    const { owners, memberAccesses, ...res } = values;
    const emailRegex = /\((.*?)\)/g;
    let newOwners = [];
    let newMemberAccesses = [];
    let match;

    while ((match = emailRegex.exec(owners)) !== null) {
      newOwners.push(match[1]);
    }
    while ((match = emailRegex.exec(memberAccesses)) !== null) {
      newMemberAccesses.push(match[1]);
    }
    const newDepartment = {
      newOwners,
      newMemberAccesses,
      ...res,
    };
    console.log(newDepartment);
    try {
      const response = await axiosClient.post(
        `/departments/${companiesState.companies?.[0]?._id}`,
        newDepartment
      );
      if (response.status === 200 && response.data) {
        setDepartments([...departments, response.data.data]);
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.log("Failed to create department:", error);
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
            hoverable
            key={department._id}
            title={department.departmentName}
            style={{ width: 270 }}
            onClick={() => router.push(`/departments/${department._id}`)}
          >
            {/* <Typography.Text>{department.description}</Typography.Text> */}
            <Flex vertical gap={5}>
              <Flex gap={10} align="center" justify="space-between">
                <p>Owners:</p>
                <Avatar.Group
                  size={35}
                  max={{
                    count: 2,
                    style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                  }}
                >
                  {membersList.map((mem) => {
                    const member = department.owners.find(
                      (item) => item === mem.userId
                    );
                    if (member) {
                      return <Avatar key={mem} src={mem.avatar} />;
                    }
                  })}
                </Avatar.Group>
              </Flex>
              <Flex gap={10} align="center" justify="space-between">
                <p>Group Accesses:</p>
                <Avatar.Group
                  size={35}
                  max={{
                    count: 2,
                    style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                  }}
                >
                  {membersList.map((mem) => {
                    const member = department.memberAccesses.find(
                      (item) => item === mem.userId
                    );
                    if (member) {
                      return <Avatar key={mem} src={mem.avatar} />;
                    }
                  })}
                </Avatar.Group>
              </Flex>
            </Flex>
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
                value: `${member.fullName} (${member.email})`,
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
                value: `${member.fullName} (${member.email})`,
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
