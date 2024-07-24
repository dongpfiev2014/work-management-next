// TaskDetail.tsx
import {
  Avatar,
  Button,
  Flex,
  Grid,
  Input,
  List,
  Space,
  Typography,
  Upload,
} from "antd";
import React, { CSSProperties, useEffect, useState } from "react";
import {
  CaretRightOutlined,
  UploadOutlined,
  LikeOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  FileZipOutlined,
} from "@ant-design/icons";
import axiosClient from "@/apis/axiosClient";

interface TaskDetailProps {
  task: {
    _id: string;
    taskName: string;
    description: string;
    dueDate: Date | string;
    assignedBy: string;
    assignedTo: any[];
    status: string;
    priority: string;
    completed: boolean;
    attachments: string[];
  };
}

interface Comment {
  _id: string;
  author: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  text: string;
  likes: number;
  createdAt: string;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [taskDimension, setTaskDimension] = useState<CSSProperties>({
    width: "400px",
    height: "auto",
  });
  const screens = Grid.useBreakpoint();

  useEffect(() => {
    if (screens.xl) {
      setTaskDimension({ width: "400px", height: "auto" });
    } else if (screens.lg) {
      setTaskDimension({ width: "400px", height: "auto" });
    } else if (screens.md) {
      setTaskDimension({ width: "400px", height: "auto" });
    } else if (screens.sm) {
      setTaskDimension({
        width: "300px",
        height: "500px",
        overflowY: "auto",
        overflowX: "hidden",
      });
    } else if (screens.xs) {
      setTaskDimension({
        width: "255px",
        height: "400px",
        overflowY: "auto",
        overflowX: "hidden",
      });
    }
  }, [screens]);

  useEffect(() => {
    fetchComments();
  }, []);

  const getFileIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "docx":
        return <FileWordOutlined />;
      case "doc":
        return <FileWordOutlined />;
      case "xlsx":
        return <FileExcelOutlined />;
      case "xls":
        return <FileExcelOutlined />;
      case "pdf":
        return <FilePdfOutlined />;
      default:
        return <FileZipOutlined />;
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosClient.get(`/comments/${task._id}`);
      if (response.status === 200 && response.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      // console.log("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await axiosClient.post("/comments", {
          taskId: task._id,
          text: newComment,
        });

        if (response.status === 200 && response.data) {
          setComments([...comments, response.data.data]);
          setNewComment("");
        }
      } catch (error) {
        // console.log("Error adding comment:", error);
      }
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      // Update likes in the backend
      const response = await axiosClient.patch(`/comments/${commentId}/like`);
      // Fetch updated comments
      if (response.status === 200 && response.data) {
        fetchComments();
      }
    } catch (error) {
      // console.log("Error liking comment:", error);
    }
  };

  return (
    <Flex vertical gap={15} style={taskDimension}>
      <Typography.Title level={5}>{task.taskName}</Typography.Title>
      <Space size={5} direction="vertical">
        <Typography.Text type="success">
          {"Describe this task:"}
        </Typography.Text>
        <Typography.Text style={{ marginLeft: "10px" }}>
          <Space>
            <CaretRightOutlined />
            {task.description
              ? task.description
              : "There is no description for this task yet"}
          </Space>
        </Typography.Text>
      </Space>
      <Space size={5} direction="vertical">
        <Typography.Text type="success">{"Attachments:"}</Typography.Text>
        <Typography.Text style={{ marginLeft: "10px" }}>
          <Space>
            <CaretRightOutlined />
            <Flex vertical>
              {task?.attachments?.length
                ? task.attachments.map((item, index) => (
                    <Space
                      key={index}
                      size="small"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {getFileIcon(item)}
                      <Typography.Text
                        ellipsis
                        style={{
                          marginLeft: 8,
                          width: "200px",
                        }}
                      >
                        {item.split("/").pop()}
                      </Typography.Text>
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        href={item}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </Button>
                    </Space>
                  ))
                : "There is no attachments for this task yet"}
            </Flex>
          </Space>
        </Typography.Text>
      </Space>
      <Space size={5} direction="vertical">
        <Typography.Text type="danger" style={{ fontWeight: 600 }}>
          {"Task results:"}
        </Typography.Text>
        <div style={{ marginLeft: "10px" }}>
          <Space>
            <CaretRightOutlined />
            <Upload>
              <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
          </Space>
        </div>
      </Space>
      <Space size={10} direction="vertical">
        <Typography.Text style={{ fontWeight: 600 }}>
          {"Comments "}
          {`(${comments.length})`}
        </Typography.Text>
        {comments.length > 0 && (
          <List
            style={{
              maxHeight: "200px",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              overflowY: "auto",
            }}
            dataSource={comments}
            renderItem={(item) => (
              <List.Item key={item._id} style={{ padding: "2px 0px" }}>
                <List.Item.Meta
                  avatar={<Avatar src={item.author.avatar} />}
                  title={
                    <>
                      <Space
                        size="small"
                        style={{
                          width: "100%",
                        }}
                      >
                        <Typography.Text>
                          <Typography.Text
                            style={{
                              fontSize: 13,
                              fontWeight: "bold",
                              marginRight: "10px",
                            }}
                          >
                            {item.author.fullName}
                          </Typography.Text>
                          <Typography.Text style={{ fontSize: 13 }}>
                            {item.text}
                          </Typography.Text>
                        </Typography.Text>
                      </Space>
                    </>
                  }
                  description={
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Typography.Text>
                  }
                />
                <Space>
                  <Button
                    type="link"
                    icon={<LikeOutlined />}
                    onClick={() => handleLike(item._id)}
                  >
                    {item.likes}
                  </Button>
                </Space>
              </List.Item>
            )}
          />
        )}
        <Input.TextArea
          rows={1}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Comment and press Enter to post"
          onPressEnter={handleAddComment}
        />
      </Space>
    </Flex>
  );
};

export default TaskDetail;
