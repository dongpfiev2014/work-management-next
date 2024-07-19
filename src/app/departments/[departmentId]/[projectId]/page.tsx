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
  List,
  Upload,
  Image,
} from "antd";
import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";
import styles from "./page.module.css";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { userInfo } from "@/selector/userSelector";
import type { GetProp, MentionProps } from "antd";
import Loading from "@/app/loading";

interface Tasks {
  _id: string;
  taskName: string;
}

interface Project {
  _id: string;
  projectName: string;
}

interface Department {
  departmentName: string;
}

type MentionsOptionProps = GetProp<MentionProps, "options">[number];

const onSelect = (option: MentionsOptionProps) => {
  console.log("select", option);
};

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ProjectDetail = ({
  params,
}: {
  params: { departmentId: string; projectId: string };
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    getMembers();
    fetchAllTasks();
  }, [userState.currentUser, params.departmentId]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(
        `/projects/author/${params.departmentId}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setMembersList(response.data.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await axiosClient.get(`/projects/${params.projectId}`);
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setTasks(response.data.data);
        setCurrentProject(response.data.project);
        setCurrentDepartment(response.data.department);
      }
    } catch (error) {
      console.log("Failed to fetch all tasks:", error);
    }
  };

  const handleCreateTask = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("projectData", JSON.stringify(values));
      if (file) {
        formData.append("multiTaskFile", file);
      }
      const response = await axiosClient.post(
        `/projects/${params.departmentId}/${userState.currentUser?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setTasks(response.data.data);
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.log("Failed to create task:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeFile = (event: any) => {
    if (event.fileList.length > 0) {
      setFile(event.fileList[0].originFileObj);
    }
  };

  if (isLoading) {
    return <Loading loading={true} />;
  }

  return (
    <>
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
                onClick: () => {
                  router.push("/departments");
                },
              },
              {
                title: `${currentDepartment?.departmentName}`,
                onClick: () => {
                  router.push(`/departments/${params.departmentId}`);
                },
              },
              {
                title: `${currentProject?.projectName}`,
              },
            ]}
          />
          <Space>
            <Button type="primary" onClick={showModal}>
              Create New Task
            </Button>
            <Button type="primary" onClick={showModal}>
              Create New Task Group
            </Button>
          </Space>
        </Flex>
        <div className={styles.cardContainer}></div>
        <Modal
          title="Create New Project"
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateTask}>
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Project Image">
              <Upload
                name="projectImage"
                listType="picture-circle"
                onChange={onChangeFile}
              >
                Upload
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ProjectDetail;
