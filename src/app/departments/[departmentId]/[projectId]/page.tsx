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
  message,
  Collapse,
  Select,
  DatePicker,
  Table,
  Tag,
} from "antd";
import React, { useState, useEffect } from "react";
import axiosClient from "@/apis/axiosClient";
import styles from "./page.module.css";
import {
  HomeOutlined,
  UserOutlined,
  UploadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { userInfo } from "@/selector/userSelector";
import type { UploadFile, UploadProps } from "antd";
import Loading from "@/app/loading";
import { FcHighPriority, FcSelfServiceKiosk } from "react-icons/fc";
import { GiTimeBomb } from "react-icons/gi";

const { Panel } = Collapse;
const { Option } = Select;

interface Tasks {
  _id: string;
  taskName: string;
  description: string;
  dueDate: string;
  assignedBy: string;
  assignees: string[];
  status: string;
  priority: string;
  completed: boolean;
}

interface TaskGroups {
  groupName: string;
  description: string;
  tasks: Tasks[];
}
[];

interface Project {
  _id: string;
  projectName: string;
}

interface Department {
  _id: string;
  departmentName: string;
}

const initialTaskGroups = [
  {
    groupName: "Group 1",
    description: "Description for Group 1",
    tasks: [
      {
        key: "1",
        taskName: "Task 1",
        description: "",
        dueDate: "2024-07-20",
        assignedBy: "User A",
        assignees: ["User B", "User C"],
        status: "To Do",
        priority: "Important",
        completed: false,
      },
    ],
  },
  {
    groupName: "Group 2",
    description: "Description for Group 2",
    tasks: [
      {
        key: "2",
        taskName: "Task 2",
        description: "",
        dueDate: "2024-07-25",
        assignedBy: "User D",
        assignees: ["User E"],
        status: "In Progress",
        priority: "Neither",
        completed: false,
      },
    ],
  },
];

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
  const [taskGroups, setTaskGroups] = useState(initialTaskGroups);
  const [modalType, setModalType] = useState(null); // 'taskGroup' or 'task'
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
      const response = await axiosClient.get(`/tasks/${params.projectId}`);
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setTasks(response.data.data);
        setTaskGroups(response.data.taskGroups);
        setCurrentProject(response.data.project);
        setCurrentDepartment(response.data.department);
      }
    } catch (error) {
      console.log("Failed to fetch all tasks:", error);
    }
  };

  const handleCreateTask = async (values: any) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append("taskData", JSON.stringify(values));
      if (fileList) {
        formData.append("multiTaskFile", fileList);
      }
      const response = await axiosClient.post(
        `/tasks/${params.projectId}}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 && response.data) {
        const newTaskGroups = taskGroups.map((group) => {
          if (group.groupName === values.taskGroup) {
            return { ...group, tasks: [...group.tasks, values] };
          }
          return group;
        });
        console.log(response.data);
        setTaskGroups(newTaskGroups);
        message.success("Task created successfully");
      }
    } catch (error) {
      console.log("Failed to create task:", error);
      message.error("Failed to create task");
    }
    handleCancel();
  };

  const handleCreateTaskGroup = async (values: any) => {
    console.log(values);
    try {
      const response = await axiosClient.post(
        `/taskGroups/${params.projectId}`,
        values
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setTaskGroups([...taskGroups, { ...values, tasks: [] }]);
        message.success("Task group created successfully");
      }
    } catch (error) {
      console.log("Error creating task group:", error);
      message.error("Failed to create task group");
    }
    handleCancel();
  };

  const showModal = (type: any) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const props: UploadProps = {
    name: "file",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileList(info.fileList);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    multiple: true,
  };

  if (isLoading) {
    return <Loading loading={true} />;
  }

  const handleStatusChange = (value: any, taskKey: any, groupName: any) => {
    const newTaskGroups = taskGroups.map((group) => {
      if (group.groupName === groupName) {
        const newTasks = group.tasks.map((task) => {
          if (task.key === taskKey) {
            return { ...task, status: value };
          }
          return task;
        });
        return { ...group, tasks: newTasks };
      }
      return group;
    });
    setTaskGroups(newTaskGroups);
  };

  const handleCompletionChange = (e: any, taskKey: any, groupName: string) => {
    const newTaskGroups = taskGroups.map((group) => {
      if (group.groupName === groupName) {
        const newTasks = group.tasks.map((task) => {
          if (task.key === taskKey) {
            return { ...task, completed: e.target.checked };
          }
          return task;
        });
        return { ...group, tasks: newTasks };
      }
      return group;
    });
    setTaskGroups(newTaskGroups);
  };

  const renderTasksTable = (tasks: Tasks[], groupName: string) => {
    const columns = [
      {
        title: "",
        dataIndex: "completed",
        key: "completed",
        render: (text: any, record: any) => (
          <div
            className={`${styles.completedCircle} ${
              record.completed ? styles.completed : ""
            }`}
            onClick={() =>
              handleCompletionChange(
                { target: { checked: !record.completed } },
                record.key,
                groupName
              )
            }
          />
        ),
        width: 50,
      },
      {
        title: "Task Name",
        dataIndex: "taskName",
        key: "taskName",
        fixed: "left",
        render: (text: any, record: any) => (
          <Flex vertical gap={0}>
            <div>{record.taskName}</div>
            <div>
              <Tag
                icon={getTagIcon(record.priority)}
                color={`${getTagColor(record.priority)}`}
              >
                {record.priority}
              </Tag>
            </div>
          </Flex>
        ),
      },
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        width: 100,
      },
      {
        title: "Assigned By",
        dataIndex: "assignedBy",
        key: "assignedBy",
        width: 120,
      },
      {
        title: "Assignee(s)",
        dataIndex: "assignees",
        key: "assignees",
        render: (assignees: any) => (
          <>
            {assignees.map((assignee: any) => (
              <Tag color="blue" key={assignee}>
                {assignee}
              </Tag>
            ))}
          </>
        ),
        width: 120,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text: any, record: any) => (
          <Select
            value={record.status}
            onChange={(value) =>
              handleStatusChange(value, record.key, groupName)
            }
            style={{ width: 150 }}
          >
            <Option value="TO DO">To Do</Option>
            <Option value="WORK IN PROGRESS">Work In Progress</Option>
            <Option value="UNDER REVIEW">Under Review</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        ),
        width: 200,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={tasks}
        pagination={false}
        scroll={{ x: 1000 }} // Cố định bảng khi có nhiều dữ liệu
      />
    );
  };

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
            <Button type="primary" onClick={() => showModal("task")}>
              Create New Task
            </Button>
            <Button type="primary" onClick={() => showModal("taskGroup")}>
              Create New Task Group
            </Button>
          </Space>
        </Flex>
        <div className={styles.cardContainer}>
          <Collapse
            defaultActiveKey={taskGroups.map((group) => group.groupName)}
          >
            {taskGroups.map((group) => (
              <Panel header={group.groupName} key={group.groupName}>
                {renderTasksTable(group.tasks, group.groupName)}
              </Panel>
            ))}
          </Collapse>
        </div>
        <Modal
          title={
            modalType === "taskGroup"
              ? "Create New Task Group"
              : "Create New Task"
          }
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={
              modalType === "taskGroup"
                ? handleCreateTaskGroup
                : handleCreateTask
            }
          >
            {modalType === "taskGroup" ? (
              <>
                <Form.Item
                  name="taskGroupName"
                  label="Task Group Name"
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <Input.TextArea />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="taskName"
                  label="Task Name"
                  rules={[
                    { required: true, message: "Please input the task name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please input the description!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="taskGroup"
                  label="Task Group"
                  rules={[
                    { required: true, message: "Please select a task group!" },
                  ]}
                >
                  <Select placeholder="Select task group">
                    {taskGroups.map((group) => (
                      <Option key={group.groupName} value={group.groupName}>
                        {group.groupName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="assignedTo"
                  label="Assigned To"
                  rules={[
                    { required: true, message: "Please select the assignee!" },
                  ]}
                >
                  <Select mode="multiple" placeholder="Select assignees">
                    {/* Add options dynamically */}
                    <Option value="User A">User A</Option>
                    <Option value="User B">User B</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="follower" label="Follower">
                  <Select mode="multiple" placeholder="Select followers">
                    {/* Add options dynamically */}
                    <Option value="User A">User A</Option>
                    <Option value="User B">User B</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="priority" label="Priority">
                  <Select placeholder="Select priority">
                    {/* Add options dynamically */}
                    <Option value="Important">Important</Option>
                    <Option value="Urgent">Urgent</Option>
                    <Option value="Critical">Critical</Option>
                    <Option value="Neither">Neither</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="dueDate"
                  label="Due Date"
                  rules={[
                    { required: true, message: "Please select the due date!" },
                  ]}
                >
                  <DatePicker />
                </Form.Item>

                <Form.Item name="attachment" label="Attachment">
                  <Upload
                    {...props}
                    showUploadList={true}
                    fileList={fileList}
                    multiple
                  >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ProjectDetail;
