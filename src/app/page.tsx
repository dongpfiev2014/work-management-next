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
  Grid,
  Image,
  List,
  Popover,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Tour,
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
import React, { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import type { ProgressProps } from "antd";
import axiosClient from "@/apis/axiosClient";
import TaskDetail from "@/components/TaskDetail";
import type { TourProps } from "antd";

interface Task {
  _id: string;
  departmentId: {
    departmentName: string;
  };
  projectId: {
    projectImage: string;
  };
  taskName: string;
  description: string;
  dueDate: Date | string;
  assignedBy: string;
  assignedTo: any[];
  status: string;
  priority: string;
  completed: boolean;
  attachments: [];
  comments: [];
}

interface Column {
  name: string;
  color: string;
  items: Task[];
}

interface Columns {
  [key: string]: Column;
}

const deadline = 1000 * 60 * 60 * 2 + 1000 * 30;

const initialData: Columns = {
  column1: {
    name: "TO DO",
    color: "#108ee9",
    items: [
      {
        _id: "1",
        taskName: "Title 1",
        description: "Content 1",
        priority: "Urgent",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "2",
        taskName: "Title 2",
        description: "Content 2",
        priority: "Important",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "3",
        taskName: "Title 3",
        description: "Content 3",
        priority: "Critical",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "4",
        taskName: "Title 4",
        description: "Content 4",
        priority: "Neither",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
    ],
  },
  column2: {
    name: "WORK IN PROGRESS",
    color: "#f50",
    items: [
      {
        _id: "5",
        taskName: "Title 1",
        description: "Content 1",
        priority: "Urgent",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "6",
        taskName: "Title 2",
        description: "Content 2",
        priority: "Important",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "7",
        taskName: "Title 3",
        description: "Content 3",
        priority: "Critical",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
    ],
  },
  column3: {
    name: "UNDER REVIEW",
    color: "#2db7f5",
    items: [
      {
        _id: "8",
        taskName: "Title 1",
        description: "Content 1",
        priority: "Urgent",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "9",
        taskName: "Title 2",
        description: "Content 2",
        priority: "Important",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "10",
        taskName: "Title 3",
        description: "Content 3",
        priority: "Critical",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "11",
        taskName: "Title 4",
        description: "Content 4",
        priority: "Neither",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
    ],
  },
  column4: {
    name: "COMPLETED",
    color: "#87d068",
    items: [
      {
        _id: "12",
        taskName: "Title 1",
        description: "Content 1",
        priority: "Urgent",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
      },
      {
        _id: "13",
        taskName: "Title 2",
        description: "Content 2",
        priority: "Important",
        assignedTo: [
          {
            fullName: "John",
          },
          {
            fullName: "Sarah",
          },
        ],
        departmentId: { departmentName: "FrontEnd Development" },
        projectId: { projectImage: "" },
        dueDate: new Date(Date.now() + deadline),
        status: "",
        assignedBy: "",
        completed: false,
        attachments: [],
        comments: [],
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
  const screens = Grid.useBreakpoint();
  const ref = useRef(null);
  const [openTour, setOpenTour] = useState<boolean>(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => {
    setWinReady(true);
    fetchPersonalTasks();
  }, []);

  useEffect(() => {
    const isTourCompleted = localStorage.getItem("tourCompleted");
    if (screens.md && !isTourCompleted && tasksLoaded) {
      const timer = setTimeout(() => {
        setOpenTour(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else setOpenTour(false);
  }, [screens.md, tasksLoaded]);

  const steps: TourProps["steps"] = [
    {
      title: "Drag and drop",
      description: "Drag and drop tasks",
      placement: "right",
      cover: (
        <>
          <video
            className="w-100 h-100"
            src={require("../../public/WorkManagement - Drag and Drop.mp4")}
            autoPlay
            loop
            muted
            style={{ borderRadius: "15px" }}
          />
        </>
      ),
      target: () => ref.current,
    },
    {
      title: "Click",
      description: "Click to see details or comment",
      placement: "top",
      target: () => ref.current,
    },
  ];

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

        if (allColumnsEmpty) {
          setAllColumnsEmpty(true);
          setCurrentData(initialData);
        } else {
          setCurrentData(response.data.data);
        }
      }
      setTasksLoaded(true);
    } catch (err) {
      // console.log("Failed to fetch personal tasks", err);
    }
  };

  const updatePersonalTasks = async (taskId: any, newStatus: any) => {
    try {
      const response = await axiosClient.put(`/tasks/${taskId}`, {
        status: newStatus,
      });
      if (response.status === 200) {
        // console.log("Task updated successfully");
      }
    } catch (err) {
      // console.log("Failed to update task", err);
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

    if (destination) {
      const sourceColumn = currentData[source.droppableId];
      const destinationColumn =
        destination && currentData[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);

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

        await updatePersonalTasks(removed._id, destination.droppableId);
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
          <Typography.Title className="productDevelopment" level={2}>
            Product Development
          </Typography.Title>
          <FaStarAndCrescent />
          <Button danger icon={<FcPrivacy />}>
            PRIVATE
          </Button>
        </Space>
        <Flex justify="space-between">
          <Flex vertical>
            <h6 className="membersOnBoards">Members on boards</h6>
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
            <Button className="newBoards" danger type="primary">
              + New Boards
            </Button>
          </Flex>
        </Flex>
        {winReady ? (
          <Flex>
            <Row gutter={10} style={{ width: "100%", height: "100%" }}>
              <DragDropContext onDragEnd={onDragEnd}>
                {Object.entries(currentData).map(
                  ([columnId, column], index) => {
                    return (
                      <Col
                        xs={12}
                        sm={12}
                        md={6}
                        lg={6}
                        key={columnId}
                        span={6}
                      >
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
                                style={
                                  screens.md
                                    ? {
                                        backgroundColor: snapshot.isDraggingOver
                                          ? "#efe3e3"
                                          : "#f9f9f9",
                                        borderRadius: "10px",
                                        border: snapshot.isDraggingOver
                                          ? "1.5px dashed red"
                                          : "", //
                                      }
                                    : {
                                        backgroundColor: snapshot.isDraggingOver
                                          ? "#efe3e3"
                                          : "#f9f9f9",
                                        borderRadius: "10px",
                                        border: snapshot.isDraggingOver
                                          ? "1.5px dashed red"
                                          : "", //
                                        maxHeight: "600px",
                                        height: "600px",
                                        overflow: "auto",
                                      }
                                }
                                grid={{ gutter: 10, column: 1 }}
                                dataSource={column.items}
                                renderItem={(item, index) => (
                                  <Draggable
                                    key={item._id}
                                    draggableId={item._id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={
                                          index === 0 && openTour
                                            ? ref
                                            : provided.innerRef
                                        }
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
                                        <Popover
                                          content={
                                            !openTour && (
                                              <TaskDetail task={item} />
                                            )
                                          }
                                          trigger="click"
                                          placement="bottom"
                                          style={{ width: "100%" }}
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
                                                      item.departmentId
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
                                                      {"0"}
                                                      <StarOutlined />
                                                    </Flex>
                                                    <Flex gap={4}>
                                                      {"0"}
                                                      <LikeOutlined />
                                                    </Flex>
                                                    <Flex gap={4}>
                                                      {item?.comments?.length >
                                                      0
                                                        ? item.comments.length
                                                        : "0"}
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
                                                    {item.taskName}
                                                  </Typography.Title>
                                                }
                                                description={
                                                  <Space size="small">
                                                    <Avatar.Group
                                                      max={{
                                                        count: 2,
                                                      }}
                                                    >
                                                      {item.assignedTo.map(
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
                                                                {
                                                                  element.fullName
                                                                }
                                                              </Avatar>
                                                            </Tooltip>
                                                          </Flex>
                                                        )
                                                      )}
                                                    </Avatar.Group>
                                                    <Statistic.Countdown
                                                      className="small-countdown"
                                                      value={item.dueDate.toLocaleString()}
                                                      onFinish={() =>
                                                        setProgressColor("red")
                                                      }
                                                    />
                                                    <Progress
                                                      percent={
                                                        new Date(item.dueDate) <
                                                        new Date()
                                                          ? 100
                                                          : Math.floor(
                                                              Math.random() *
                                                                (90 - 50 + 1)
                                                            ) + 50
                                                      }
                                                      showInfo={true}
                                                      type="dashboard"
                                                      size={36}
                                                      strokeColor={
                                                        progressColor
                                                      }
                                                    />
                                                  </Space>
                                                }
                                              />
                                            </Card>
                                          </List.Item>
                                        </Popover>
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
            <Tour
              open={openTour}
              onClose={() => {
                setOpenTour(false);
                localStorage.setItem("tourCompleted", "true");
              }}
              steps={steps}
            />
          </Flex>
        ) : null}
      </Flex>
    </main>
  );
}
