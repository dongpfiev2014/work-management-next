// TaskDetail.tsx
import {
  Avatar,
  Button,
  Flex,
  Input,
  List,
  Space,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  CaretRightOutlined,
  UploadOutlined,
  LikeOutlined,
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
    attachments: [];
  };
}

interface Comment {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  likes: number;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const formattedDueDate = new Date(task.dueDate).toLocaleDateString();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosClient.get(`/api/comments/${task._id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    console.log(newComment);
    if (newComment.trim() !== "") {
      try {
        const response = await axiosClient.post("/api/comments", {
          taskId: task._id,
          text: newComment,
          author: "USER_ID", // Replace with the actual user ID
        });
        setComments([...comments, response.data]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      // Update likes in the backend
      await axiosClient.patch(`/api/comments/${commentId}/like`);
      // Fetch updated comments
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <Flex vertical gap={15}>
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
            {task?.attachments?.length
              ? task.attachments
              : "There is no attachments for this task yet"}
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
              {" "}
              <Button icon={<UploadOutlined />}>Upload file</Button>
            </Upload>
          </Space>
        </div>
      </Space>
      <Space size={10} direction="vertical">
        <Typography.Text style={{ fontWeight: 600 }}>
          {"Comments"}
        </Typography.Text>
        {comments.length > 0 && (
          <List
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item key={comment._id}>
                <List.Item.Meta
                  avatar={<Avatar src={comment.author.avatar} />}
                  title={comment.author.name}
                  description={new Date(comment.createdAt).toLocaleString()}
                />
                <Typography.Text>{comment.text}</Typography.Text>
                <Space>
                  <Button
                    type="link"
                    icon={<LikeOutlined />}
                    onClick={() => handleLike(comment._id)}
                  >
                    {comment.likes}
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
          //   onKeyDown={handleAddComment}
        />
      </Space>
    </Flex>
  );
};

export default TaskDetail;
