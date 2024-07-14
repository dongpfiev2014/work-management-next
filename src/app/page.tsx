"use client";

import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Flex,
  Image,
  List,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import styles from "./page.module.css";
import {
  HomeOutlined,
  UserOutlined,
  AntDesignOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { FaStarAndCrescent } from "react-icons/fa";
import { TbFilterSearch } from "react-icons/tb";
import { FaShareFromSquare } from "react-icons/fa6";
import { GiTimeBomb } from "react-icons/gi";
import {
  FcExpired,
  FcHighPriority,
  FcSelfServiceKiosk,
  FcPrivacy,
  FcLeave,
  FcList,
} from "react-icons/fc";
import { randomUUID } from "crypto";

export default function Home() {
  const renderToDoList = () => {};
  const router = useRouter();
  const initialData = {
    column1: {
      name: "TO DO",
      color: "#108ee9",
      items: [
        {
          id: 1,
          title: "Title 1",
          content: "Content 1",
          priority: "Urgent",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 2,
          title: "Title 2",
          content: "Content 2",
          priority: "Important",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 3,
          title: "Title 3",
          content: "Content 3",
          priority: "Critical",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 4,
          title: "Title 4",
          content: "Content 4",
          priority: "Neither",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
      ],
    },
    column2: {
      name: "WORK IN PROGRESS",
      color: "#f50",
      items: [
        {
          id: 1,
          title: "Title 1",
          content: "Content 1",
          priority: "Urgent",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 2,
          title: "Title 2",
          content: "Content 2",
          priority: "Important",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 3,
          title: "Title 3",
          content: "Content 3",
          priority: "Critical",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
      ],
    },
    column3: {
      name: "UNDER REVIEW",
      color: "#2db7f5",
      items: [
        {
          id: 1,
          title: "Title 1",
          content: "Content 1",
          priority: "Urgent",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 2,
          title: "Title 2",
          content: "Content 2",
          priority: "Important",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 3,
          title: "Title 3",
          content: "Content 3",
          priority: "Critical",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 4,
          title: "Title 4",
          content: "Content 4",
          priority: "Neither",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
      ],
    },
    column4: {
      name: "COMPLETED",
      color: "#87d068",
      items: [
        {
          id: 1,
          title: "Title 1",
          content: "Content 1",
          priority: "Urgent",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
        {
          id: 2,
          title: "Title 2",
          content: "Content 2",
          priority: "Important",
          followers: ["John", "Davis"],
          department: "FrontEnd Development",
        },
      ],
    },
  };

  const getTagColor = (priority: string) => {
    switch (priority) {
      case "Important":
        return "orange";
      case "Urgent":
        return "magenta";
      case "Critical":
        return "purple";
      case "Neither":
        return "cyan";
      default:
        return "#f9f9f9";
    }
  };

  const getTagIcon = (priority: string) => {
    switch (priority) {
      case "Important":
        return <FcHighPriority />;
      case "Urgent":
        return <FcExpired />;
      case "Critical":
        return <GiTimeBomb />;
      case "Neither":
        return <FcSelfServiceKiosk />;
    }
  };

  return (
    <main className={styles.container}>
      <Flex gap="middle" vertical>
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
              title: "All Tasks",
            },
          ]}
        />
        <Space align="start" size={15}>
          <Typography.Title level={2}>Product Development</Typography.Title>
          <FaStarAndCrescent />
          <Button danger icon={<FcPrivacy />}>
            PRIVATE
          </Button>
        </Space>
        <Flex justify="space-between">
          <Flex vertical>
            <h6>Members on boards</h6>
            <Avatar.Group
              size="default"
              max={{
                count: 2,
                style: {
                  color: "#f56a00",
                  backgroundColor: "#fde3cf",
                  cursor: "pointer",
                },
                popover: { trigger: "click" },
              }}
            >
              <Avatar
                size="default"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
              <Avatar size="default" style={{ backgroundColor: "#f56a00" }}>
                K
              </Avatar>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                  size="default"
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
              </Tooltip>
              <Avatar
                size="default"
                style={{ backgroundColor: "#1677ff" }}
                icon={<AntDesignOutlined />}
              />
            </Avatar.Group>
          </Flex>
          <Flex gap={0}>
            <Button icon={<TbFilterSearch />} type="text">
              Filter
            </Button>
            <Button icon={<FaShareFromSquare />} type="text">
              Share
            </Button>
            <Button danger type="primary">
              + New Boards
            </Button>
          </Flex>
        </Flex>
        <Flex>
          <Row gutter={16} style={{ width: "100%", height: "100%" }}>
            {Object.entries(initialData).map(([columnId, column], index) => {
              return (
                <Col key={columnId} span={6}>
                  <Flex justify="space-between" align="center">
                    <Space>
                      <Tag color={column.color} style={{ fontSize: "16px" }}>
                        {column.name}
                      </Tag>
                      <Badge count={column.items.length}>
                        <FcLeave size={20} />
                      </Badge>
                    </Space>
                    <FcList size={20} />
                  </Flex>
                  <Divider />
                  <List
                    style={{ backgroundColor: "#f9f9f9" }}
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={column.items}
                    renderItem={(item) => (
                      <List.Item style={{ cursor: "pointer" }} key={item.id}>
                        <Card
                          title={
                            <Flex>
                              <Tag
                                icon={getTagIcon(item.priority)}
                                color={`${getTagColor(item.priority)}`}
                              >
                                {item.priority}
                              </Tag>
                              <Tag color="green">{item.department}</Tag>
                            </Flex>
                          }
                          className={styles.Card}
                          hoverable
                          cover={
                            <Image
                              alt="example"
                              // src={item.image}
                              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                              preview={false}
                              style={{
                                width: "100%",
                                height: "100px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                overflow: "hidden",
                              }}
                            />
                          }
                          actions={[
                            <>
                              <Flex gap={14} style={{ marginLeft: "25px" }}>
                                <Flex gap={4}>
                                  {item.followers.length}
                                  <StarOutlined />
                                </Flex>
                                <Flex gap={4}>
                                  {item.followers.length}
                                  <LikeOutlined />
                                </Flex>
                                <Flex gap={4}>
                                  {item.followers.length}
                                  <MessageOutlined />
                                </Flex>
                              </Flex>
                            </>,
                          ]}
                          bordered={false}
                        >
                          <Card.Meta
                            title={item.title}
                            description={
                              <Space size="middle">
                                {item.followers.map((item, index) => (
                                  <Flex gap={5} align="center" key={index}>
                                    <Avatar size="small">{item}</Avatar>
                                    {item}
                                  </Flex>
                                ))}
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </Col>
              );
            })}
          </Row>
        </Flex>
      </Flex>
    </main>
  );
}
