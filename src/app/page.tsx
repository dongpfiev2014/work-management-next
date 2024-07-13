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
  List,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import styles from "./page.module.css";
import {
  HomeOutlined,
  UserOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { FcPrivacy, FcLeave } from "react-icons/fc";
import { FaStarAndCrescent } from "react-icons/fa";
import { TbFilterSearch } from "react-icons/tb";
import { FaShareFromSquare } from "react-icons/fa6";

export default function Home() {
  const renderToDoList = () => {};
  const router = useRouter();
  const colors1 = ["#6253E1", "#04BEFE"];
  const data = [
    {
      title: "Title 1",
    },
    {
      title: "Title 2",
    },
    {
      title: "Title 3",
    },
    {
      title: "Title 4",
    },
  ];
  return (
    <main className={styles.container}>
      <Flex gap="large" vertical>
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
              size="large"
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
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
              <Tooltip title="Ant User" placement="top">
                <Avatar
                  style={{ backgroundColor: "#87d068" }}
                  icon={<UserOutlined />}
                />
              </Tooltip>
              <Avatar
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
            <Col span={6}>
              <Space>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: `linear-gradient(135deg, ${colors1.join(
                          ", "
                        )})`,

                        lineWidth: 0,
                      },
                    },
                  }}
                >
                  <Button type="primary" size="middle">
                    TO DO
                  </Button>
                </ConfigProvider>
                <Badge count={10}>
                  <FcLeave size={25} />
                </Badge>
              </Space>
              <Divider />
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <Card title={item.title}>Card content</Card>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={6}>
              <div>col-6</div>
            </Col>
            <Col span={6}>
              <div>col-6</div>
            </Col>
            <Col span={6}>
              <div>col-6</div>
            </Col>
          </Row>
        </Flex>
      </Flex>
    </main>
  );
}
