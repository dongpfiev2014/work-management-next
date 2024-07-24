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
  Badge,
  Grid,
} from "antd";
import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";
import styles from "./page.module.css";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { userInfo } from "@/selector/userSelector";
import type { GetProp, MentionProps } from "antd";
import NotAuthorized from "@/app/not-authorized/page";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import Loading from "@/app/loading";

interface Projects {
  _id: string;
  projectName: string;
  description: string;
  owner: {
    fullName: string;
    avatar: string;
  };
  departmentId: string;
  organizationId: string;
  tasks: [];
  createdAt: Date;
  projectImage: string;
}

interface Department {
  departmentName: string;
}

type MentionsOptionProps = GetProp<MentionProps, "options">[number];

const onSelect = (option: MentionsOptionProps) => {
  // console.log("select", option);
};

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const Projects = ({ params }: { params: { departmentId: string } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isMember, setIsMember] = useState(false);
  const screens = Grid.useBreakpoint();

  useEffect(() => {
    getMembers();
    fetchProjects();
  }, [userState.currentUser, params.departmentId]);

  useEffect(() => {
    const isMemberReally = membersList.some(
      (item) => item._id === userState.currentUser?._id
    );
    setIsMember(isMemberReally);
    setIsLoading(false);
  }, [membersList, userState.currentUser]);

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(
        `/projects/author/${params.departmentId}`
      );
      if (response.status === 200 && response.data) {
        setMembersList(response.data.data);
      }
    } catch (error) {
      // console.log("Error", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axiosClient.get(
        `/projects/${params.departmentId}`
      );
      if (response.status === 200 && response.data) {
        setProjects(response.data.data);
        setCurrentDepartment(response.data.department);
      }
    } catch (error) {
      // console.log("Failed to fetch departments:", error);
    }
  };

  const handleCreateProject = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("projectData", JSON.stringify(values));
      if (imageFile) {
        formData.append("projectImage", imageFile);
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
        setProjects([...projects, response.data.data]);
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      // console.log("Failed to create project:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeImage = (event: any) => {
    if (event.fileList.length > 0) {
      setImageFile(event.fileList[0].originFileObj);
    }
  };

  const changeDate = (date: any) => {
    const data = new Date(date);
    const formattedDate = data.toLocaleString("en-US", {
      timeZone: "UTC",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    return formattedDate;
  };

  if (isLoading) {
    return <Loading loading={true} />;
  }

  if (!isLoading && !isMember) {
    return (
      <>
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
              },
            ]}
          />
        </Flex>
        <NotAuthorized />
      </>
    );
  }

  if (isMember && !isLoading) {
    return (
      <>
        <div className={styles.wrapper}>
          <Flex
            vertical={screens.xs ? true : false}
            align="center"
            justify="space-between"
            style={{ width: "100%" }}
          >
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
                },
              ]}
            />
            <Button type="primary" onClick={showModal}>
              Create New Project
            </Button>
          </Flex>
          <div className={styles.cardContainer}>
            <List
              itemLayout="vertical"
              size="small"
              pagination={{
                pageSize: 4,
              }}
              dataSource={projects}
              renderItem={(item) => {
                return (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    key={item._id}
                    onClick={() =>
                      router.push(
                        `/departments/${params.departmentId}/${item._id}`
                      )
                    }
                    actions={[
                      <Badge status="processing" text="Processing" />,
                      <IconText
                        icon={LikeOutlined}
                        text="156"
                        key="list-vertical-like-o"
                      />,
                      <IconText
                        icon={MessageOutlined}
                        text="2"
                        key="list-vertical-message"
                      />,
                    ]}
                    extra={
                      <Image
                        width={220}
                        height={150}
                        alt="logo"
                        src={item.projectImage}
                        style={{ borderRadius: "15px" }}
                        preview={false}
                      />
                    }
                  >
                    <List.Item.Meta
                      title={item.projectName}
                      description={
                        <Typography.Text type="secondary">{`Created by ${
                          item.owner.fullName
                        } on ${changeDate(item.createdAt)}`}</Typography.Text>
                      }
                      avatar={<Avatar src={item.owner.avatar} />}
                    />
                    {item.description}
                  </List.Item>
                );
              }}
            />
          </div>
          <Modal
            title="Create New Project"
            open={isModalVisible}
            onCancel={handleCancel}
            onOk={() => form.submit()}
          >
            <Form form={form} layout="vertical" onFinish={handleCreateProject}>
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
                  onChange={onChangeImage}
                >
                  Upload
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </>
    );
  }
};

export default Projects;
