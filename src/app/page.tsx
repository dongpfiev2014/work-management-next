"use client";

import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  List,
  Progress,
  Row,
  Space,
  Statistic,
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
  SyncOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { FaStarAndCrescent } from "react-icons/fa";
import { TbFilterSearch } from "react-icons/tb";
import { FaShareFromSquare } from "react-icons/fa6";
import { GiTimeBomb } from "react-icons/gi";
import {
  FcHighPriority,
  FcSelfServiceKiosk,
  FcPrivacy,
  FcLeave,
  FcList,
} from "react-icons/fc";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import type { ProgressProps } from "antd";
import axiosClient from "@/apis/axiosClient";

interface Task {
  id: string;
  title: string;
  content: string;
  priority: string;
  followers: any[];
  department: {
    departmentName: string;
  };
  projectId: {
    projectImage: string;
  };
}

interface Column {
  name: string;
  color: string;
  items: Task[];
}

interface Columns {
  [key: string]: Column;
}

const initialData: Columns = {
  column1: {
    name: "TO DO",
    color: "#108ee9",
    items: [
      {
        id: "1",
        title: "Title 1",
        content: "Content 1",
        priority: "Urgent",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "2",
        title: "Title 2",
        content: "Content 2",
        priority: "Important",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "3",
        title: "Title 3",
        content: "Content 3",
        priority: "Critical",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "4",
        title: "Title 4",
        content: "Content 4",
        priority: "Neither",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
    ],
  },
  column2: {
    name: "WORK IN PROGRESS",
    color: "#f50",
    items: [
      {
        id: "5",
        title: "Title 1",
        content: "Content 1",
        priority: "Urgent",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "6",
        title: "Title 2",
        content: "Content 2",
        priority: "Important",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "7",
        title: "Title 3",
        content: "Content 3",
        priority: "Critical",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
    ],
  },
  column3: {
    name: "UNDER REVIEW",
    color: "#2db7f5",
    items: [
      {
        id: "8",
        title: "Title 1",
        content: "Content 1",
        priority: "Urgent",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "9",
        title: "Title 2",
        content: "Content 2",
        priority: "Important",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "10",
        title: "Title 3",
        content: "Content 3",
        priority: "Critical",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "11",
        title: "Title 4",
        content: "Content 4",
        priority: "Neither",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
    ],
  },
  column4: {
    name: "COMPLETED",
    color: "#87d068",
    items: [
      {
        id: "12",
        title: "Title 1",
        content: "Content 1",
        priority: "Urgent",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
      {
        id: "13",
        title: "Title 2",
        content: "Content 2",
        priority: "Important",
        followers: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        department: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
      },
    ],
  },
};

const colors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

function getRandomColor() {
  return colors[Math.floor(Math.random() * 11)];
}

const deadline = Date.now() + 1000 * 60 * 60 * 2 + 1000 * 30;

const conicColors: ProgressProps["strokeColor"] = {
  "0%": "#87d068",
  "50%": "#ffe58f",
  "100%": "#ffccc7",
};

export default function Home() {
  const [winReady, setWinReady] = useState(false);
  const renderToDoList = () => {};
  const router = useRouter();
  const [currentData, setCurrentData] = useState<Columns>(initialData);
  const [timeLeft, setTimeLeft] = useState(deadline - Date.now());
  const [allColumnsEmpty, setAllColumnsEmpty] = useState(false);
  const [progressColor, setProgressColor] = useState(conicColors);

  useEffect(() => {
    setWinReady(true);
    fetchPersonalTasks();
  }, []);

  const checkIfAllColumnsAreEmpty = (columns: Columns) => {
    return Object.values(columns).every((column) => column.items.length === 0);
  };

  const fetchPersonalTasks = async () => {
    try {
      const response = await axiosClient.get(
        `/tasks/personalTask?page=${1}&limit=${20}`
      );
      if (response.status === 200 && response.data) {
        const allColumnsEmpty = checkIfAllColumnsAreEmpty(response.data.data);
        console.log(response.data);
        if (allColumnsEmpty) {
          setAllColumnsEmpty(true);
          setCurrentData(initialData);
        } else {
          setCurrentData(response.data.data);
        }
      }
    } catch (err) {
      console.log("Failed to fetch personal tasks", err);
    }
  };

  const updatePersonalTasks = async (taskId: any, newStatus: any) => {
    try {
      const response = await axiosClient.put(`/tasks/${taskId}`, {
        status: newStatus,
      });
      if (response.status === 200) {
        console.log("Task updated successfully");
      }
    } catch (err) {
      console.log("Failed to update task", err);
    }
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
        return <SyncOutlined spin />;
      case "Critical":
        return <GiTimeBomb />;
      case "Neither":
        return <FcSelfServiceKiosk />;
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    console.log(source, destination);
    if (destination) {
      const sourceColumn = currentData[source.droppableId];
      const destinationColumn =
        destination && currentData[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      console.log(sourceItems);

      if (source.droppableId === destination.droppableId) {
        sourceItems.splice(destination.index, 0, removed);

        setCurrentData({
          ...currentData,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
        });
      } else {
        destinationItems.splice(destination.index, 0, removed);
        setCurrentData({
          ...currentData,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destinationColumn,
            items: destinationItems,
          },
        });

        await updatePersonalTasks(removed.id, destination.droppableId);
      }
    }
  };

  const percentTimeLeft = (timeLeft / (1000 * 60 * 60 * 2 + 1000 * 30)) * 100;

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
        {winReady ? (
          <Flex>
            <Row gutter={16} style={{ width: "100%", height: "100%" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(currentData).map(
                  ([columnId, column], index) => {
                    return (
                      <Col key={columnId} span={6}>
                        <Flex justify="space-between" align="center">
                          <Space>
                            <Tag
                              color={column.color}
                              style={{ fontSize: "16px" }}
                            >
                              {column.name}
                            </Tag>
                            <Badge count={column.items.length}>
                              <FcLeave size={20} />
                            </Badge>
                          </Space>
                          <FcList size={20} />
                        </Flex>
                        <Divider />
                        <Droppable droppableId={columnId} key={columnId}>
                          {(provided, snapshot) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <List
                                style={{
                                  backgroundColor: snapshot.isDraggingOver
                                    ? "#efe3e3"
                                    : "#f9f9f9",
                                  borderRadius: "10px",
                                  border: snapshot.isDraggingOver
                                    ? "1.5px dashed red"
                                    : "", //
                                }}
                                grid={{ gutter: 16, column: 1 }}
                                dataSource={column.items}
                                renderItem={(item, index) => (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          cursor: "pointer",
                                          userSelect: "none",
                                          backgroundColor: snapshot.isDragging
                                            ? "white"
                                            : "#f9f9f9",
                                          transition: "transform 0.2s ease",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <List.Item
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        >
                                          <Card
                                            title={
                                              <Flex>
                                                <Tag
                                                  icon={getTagIcon(
                                                    item.priority
                                                  )}
                                                  color={`${getTagColor(
                                                    item.priority
                                                  )}`}
                                                >
                                                  {item.priority}
                                                </Tag>
                                                <Tag color={getRandomColor()}>
                                                  {
                                                    item.department
                                                      .departmentName
                                                  }
                                                </Tag>
                                              </Flex>
                                            }
                                            className={styles.Card}
                                            hoverable
                                            cover={
                                              <Image
                                                alt="example"
                                                src={
                                                  allColumnsEmpty
                                                    ? "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                                    : item.projectId
                                                        .projectImage
                                                }
                                                preview={false}
                                                style={{
                                                  width: "100%",
                                                  height: "80px",
                                                  borderRadius: "10px",
                                                  objectFit: "cover",
                                                  overflow: "hidden",
                                                }}
                                              />
                                            }
                                            actions={[
                                              <>
                                                <Flex
                                                  gap={14}
                                                  style={{
                                                    marginLeft: "25px",
                                                  }}
                                                >
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
                                              title={
                                                <Typography.Title
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {item.title}
                                                </Typography.Title>
                                              }
                                              description={
                                                <Space size="small">
                                                  <Avatar.Group>
                                                    {item.followers.map(
                                                      (
                                                        element: any,
                                                        eindex
                                                      ) => (
                                                        <Flex
                                                          gap={5}
                                                          align="center"
                                                          key={eindex}
                                                        >
                                                          <Tooltip
                                                            title={
                                                              element.fullName
                                                            }
                                                          >
                                                            <Avatar
                                                              size="small"
                                                              src={
                                                                element.avatar
                                                              }
                                                            >
                                                              {element.fullName}
                                                            </Avatar>
                                                          </Tooltip>
                                                        </Flex>
                                                      )
                                                    )}
                                                  </Avatar.Group>
                                                  <Statistic.Countdown
                                                    className="small-countdown"
                                                    value={deadline}
                                                    onFinish={() =>
                                                      setProgressColor("red")
                                                    }
                                                  />
                                                  <Progress
                                                    percent={93}
                                                    showInfo={true}
                                                    type="dashboard"
                                                    size={36}
                                                    strokeColor={progressColor}
                                                  />
                                                </Space>
                                              }
                                            />
                                          </Card>
                                        </List.Item>
                                      </div>
                                    )}
                                  </Draggable>
                                )}
                              />
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </Col>
                    );
                  }
                )}
              </DragDropContext>
            </Row>
          </Flex>
        ) : null}
      </Flex>
    </main>
  );
}
