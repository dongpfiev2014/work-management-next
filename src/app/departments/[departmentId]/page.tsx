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
import { companiesList, userInfo } from "@/selector/userSelector";
import type { GetProp, MentionProps } from "antd";
import NotAuthorized from "@/app/not-authorized/page";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";

interface Projects {
  _id: string;
  projectName: string;
  description: string;
  owner: string;
  departmentId: string;
  organizationId: string;
  tasks: [];
  createdAt: Date;
  projectImage: string;
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

const Projects = ({ params }: { params: { departmentId: string } }) => {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  // const [isMember, setIsMember] = useState(
  //   membersList.includes(userState.currentUser?._id)
  // );
  const [isMember, setIsMember] = useState(true);

  useEffect(() => {
    getMembers();
    fetchProjects();
  }, [userState.currentUser, params.departmentId]);

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(
        `/projects/auth/${params.departmentId}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setMembersList(response.data.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axiosClient.get(
        `/projects/${params.departmentId}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setProjects(response.data.data);
      }
    } catch (error) {
      console.log("Failed to fetch departments:", error);
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
        console.log(response.data);
        setProjects([...projects, response.data.data]);
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.log("Failed to create project:", error);
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

  return (
    <>
      {isMember ? (
        <div className={styles.wrapper}>
          <Flex
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
                  title: "Projects",
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
                      router.push(`/departments/projects/${item._id}`)
                    }
                    actions={[
                      <IconText
                        icon={StarOutlined}
                        text="156"
                        key="list-vertical-star-o"
                      />,
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
                        width={272}
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
                          userState.currentUser?.fullName
                        } on ${changeDate(item.createdAt)}`}</Typography.Text>
                      }
                      avatar={<Avatar src={userState.currentUser?.avatar} />}
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
      ) : (
        <NotAuthorized />
      )}
    </>
  );
};

export default Projects;
