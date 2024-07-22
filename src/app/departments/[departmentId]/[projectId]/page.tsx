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
  Popover,
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
import { RcFile } from "antd/es/upload";
import moment from "moment";

const { Panel } = Collapse;
const { Option } = Select;

interface Tasks {
  _id: string;
  taskName: string;
  description: string;
  dueDate: Date;
  assignedBy: string;
  assignees: string[];
  status: string;
  priority: string;
  completed: boolean;
  attachments: [];
}

interface TaskGroups {
  groupName: string;
  description: string;
  tasks: Tasks[];
}

interface Project {
  _id: string;
  projectName: string;
}

interface Department {
  _id: string;
  departmentName: string;
}

const initialTaskGroups: TaskGroups[] = [
  {
    groupName: "General Task Group",
    description: "General Task Group",
    tasks: [
      // {
      //   _id: "1",
      //   taskName: "Task 1",
      //   description: "",
      //   dueDate: "2024-07-20",
      //   assignedBy: "User A",
      //   assignedTo: ["User B", "User C"],
      //   status: "TO DO",
      //   priority: "Important",
      //   completed: true,
      // },
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

const disablePastDates = (current: any) => {
  // Can not select days before today
  return current && current < moment().endOf("day");
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
  const [modalType, setModalType] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    getMembers();
    fetchAllTasks();
  }, [userState?.currentUser, params.projectId]);

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
      const response = await axiosClient.get(
        `/tasks/${params.departmentId}/${params.projectId}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        if (response.data.data.length === 0) {
          setTaskGroups(initialTaskGroups);
          setCurrentProject(response.data.project);
          setCurrentDepartment(response.data.department);
          setActiveKey(initialTaskGroups.map((group) => group.groupName));
        } else {
          setTaskGroups(response.data.data);
          setCurrentProject(response.data.project);
          setCurrentDepartment(response.data.department);
          setActiveKey(
            response.data.data.map((group: TaskGroups) => group.groupName)
          );
        }
      }
    } catch (error) {
      console.log("Failed to fetch all tasks:", error);
    }
  };

  const handleCreateTask = async (values: any) => {
    const { assignedTo, ...res } = values;
    const emailRegex = /\((.*?)\)/g;
    let newAssignedTo = [];
    let match;

    while ((match = emailRegex.exec(assignedTo)) !== null) {
      newAssignedTo.push(match[1]);
    }

    const newTask = {
      assignedTo: newAssignedTo,
      attachments: fileUrls,
      ...res,
    };
    console.log(values);
    console.log(newTask);

    try {
      // const formData = new FormData();
      // formData.append("taskData", JSON.stringify(values));
      // if (fileList && fileList.length > 0) {
      //   fileList.forEach((file) => {
      //     if (file.originFileObj) {
      //       formData.append("multiTaskFile", file.originFileObj);
      //     }
      //   });
      // }
      const response = await axiosClient.post(
        `/tasks/${params.departmentId}/${params.projectId}`,
        newTask
      );

      if (response.status === 200 && response.data) {
        const responseTask = response.data.data;
        const newTaskGroups = taskGroups.map((group) => {
          if (group.groupName === responseTask.taskGroup) {
            return { ...group, tasks: [...group.tasks, responseTask] };
          }
          return group;
        });
        console.log(response.data);
        setTaskGroups(newTaskGroups);
        setActiveKey(newTaskGroups.map((group) => group.groupName));
        message.success("Task created successfully");
      }
    } catch (error) {
      console.log("Failed to create task:", error);
      message.error("Failed to create task");
    }
    handleCancel();
  };

  const handleCreateTaskGroup = async (values: any) => {
    try {
      console.log(values);
      console.log(params.projectId);
      const response = await axiosClient.post(
        `/tasks/taskGroups/${params.projectId}`,
        values
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setTaskGroups([...taskGroups, { ...values, tasks: [] }]);
        setActiveKey([
          ...taskGroups.map((group) => group.groupName),
          values.groupName,
        ]);
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

  if (isLoading) {
    return <Loading loading={true} />;
  }

  const updateStatusTaskDB = async (taskId: any, status: any) => {
    try {
      const response = await axiosClient.put(`/tasks/status/${taskId}`, {
        status: status,
      });
      if (response.status === 200 && response.data) {
        console.log(response.data);
        message.success("Task status updated successfully");
      }
    } catch (err) {
      console.log("Error updating task status in DB:", err);
    }
  };

  const handleStatusChange = (value: any, taskKey: any, groupName: any) => {
    const newTaskGroups = taskGroups.map((group) => {
      if (group.groupName === groupName) {
        const newTasks = group.tasks.map((task) => {
          if (task._id === taskKey) {
            updateStatusTaskDB(taskKey, value);
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
          if (task._id === taskKey) {
            if (e.target.checked) {
              updateStatusTaskDB(taskKey, "COMPLETED");
            } else {
              updateStatusTaskDB(taskKey, "UNDER REVIEW");
            }
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
    const columns: any = [
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
                record._id,
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
            <Popover
              content={
                <>
                  <h1>{record._id}</h1>
                  <h1>{record.taskName}</h1>
                </>
              }
              trigger="click"
              placement="right"
            >
              <div>{record.taskName}</div>
            </Popover>
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
        render: (dueDate: any) => (
          <span>{moment(dueDate).format("DD/MM/YYYY")}</span>
        ),
      },
      {
        title: "Assigned By",
        dataIndex: "assignedBy",
        key: "assignedBy",
        render: (assignedBy: any) => (
          <>
            <Avatar.Group
              size={28}
              max={{
                count: 2,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
            >
              <Avatar src={assignedBy.avatar} />
            </Avatar.Group>
          </>
        ),
        width: 120,
      },
      {
        title: "Assignee(s)",
        dataIndex: "assignedTo",
        key: "assignedTo",
        render: (assignees: any) => (
          <>
            <Avatar.Group
              size={28}
              max={{
                count: 2,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
            >
              {assignees.map((item: any) => (
                <Avatar key={item._id} src={item.avatar} />
              ))}
            </Avatar.Group>
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
              handleStatusChange(value, record._id, groupName)
            }
            style={{ width: 150 }}
          >
            <Option value="TO DO">
              <Tag color="#108ee9">To Do</Tag>
            </Option>
            <Option value="WORK IN PROGRESS">
              <Tag color="#f50">Work In Progress</Tag>
            </Option>
            <Option value="UNDER REVIEW">
              <Tag color="#2db7f5">Under Review</Tag>
            </Option>
            <Option value="COMPLETED">
              <Tag color="#87d068">Completed</Tag>
            </Option>
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
        scroll={{ x: 1000 }}
      />
    );
  };

  const handleUploadUrl: UploadProps["customRequest"] = async (
    options: any
  ) => {
    const { file, onSuccess, onError } = options;
    try {
      const formData = new FormData();
      formData.append("multiTaskFile", file);

      // if (fileList && fileList.length > 0) {
      //   fileList.forEach((file) => {
      //     if (file.originFileObj) {
      //       formData.append("multiTaskFile", file.originFileObj);
      //     }
      //   });
      // }

      const response = await axiosClient.post(
        `/tasks/uploadMultiTaskFile/${params.projectId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      const fileUrl = response.data.data;
      setFileUrls((prev) => [...prev, ...fileUrl]);
      onSuccess(response.data, file);
      message.success(`${file.name} file uploaded successfully`);
    } catch (error: any) {
      console.log(error);
      onError(error);
      message.error(`${file.name} file upload failed.`);
    }
  };

  const handleUploadChange: UploadProps["onChange"] = (info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      setFileList(info.fileList);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      setFileList(info.fileList.filter((file) => file.status !== "error"));
    }
  };

  const props: UploadProps = {
    name: "file",
    onChange: handleUploadChange,
    customRequest: handleUploadUrl,
    showUploadList: true,
    multiple: true,
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
            activeKey={activeKey} // Use state to control active keys
            onChange={(keys) => setActiveKey(keys as string[])}
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
                  name="groupName"
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
                <Form.Item name="description" label="Description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="taskGroup"
                  label="Task Group"
                  rules={[
                    {
                      required: true,
                      message: "Please select the task group!",
                    },
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
                    {membersList.map((member) => (
                      <Option
                        key={member._id}
                        value={`${member.fullName} (${member.email})`}
                      >
                        <Space>
                          <Avatar size="small" src={member.avatar}>
                            {member.fullName}
                          </Avatar>
                          {member.fullName}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="priority" label="Priority">
                  <Select placeholder="Select priority">
                    {/* Add options dynamically */}
                    <Option value="Important">
                      <Tag
                        icon={getTagIcon("Important")}
                        color={`${getTagColor("Important")}`}
                      >
                        {"Important"}
                      </Tag>
                    </Option>
                    <Option value="Urgent">
                      <Tag
                        icon={getTagIcon("Urgent")}
                        color={`${getTagColor("Urgent")}`}
                      >
                        {"Urgent"}
                      </Tag>
                    </Option>
                    <Option value="Critical">
                      <Tag
                        icon={getTagIcon("Critical")}
                        color={`${getTagColor("Critical")}`}
                      >
                        {"Critical"}
                      </Tag>
                    </Option>
                    <Option value="Neither">
                      <Tag
                        icon={getTagIcon("Neither")}
                        color={`${getTagColor("Neither")}`}
                      >
                        {"Neither"}
                      </Tag>
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="dueDate"
                  label="Due Date"
                  rules={[
                    { required: true, message: "Please select the due date!" },
                  ]}
                >
                  <DatePicker disabledDate={disablePastDates} />
                </Form.Item>

                <Form.Item label="Attachment">
                  <Upload {...props}>
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
