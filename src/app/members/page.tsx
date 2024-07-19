"use client";

import {
  Avatar,
  Breadcrumb,
  Col,
  Divider,
  Drawer,
  List,
  Row,
  Space,
} from "antd";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient";
import { useAppSelector } from "@/lib/hooks";
import { companiesList } from "@/selector/userSelector";
import {
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const page = () => {
  const companiesState = useAppSelector(companiesList);
  const [membersList, setMembersList] = useState([]);
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (companiesState?.companies && companiesState.companies?.length > 0) {
      getMembers();
    }
  }, [companiesState]);

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(
        `/members/${companiesState.companies?.[0]?._id}`
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        setMembersList(response.data.data);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const showDrawer = (user: any) => {
    setSelectedUser(user);
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <div className={styles.wrapper}>
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
            title: "Members",
          },
        ]}
      />
      <List
        style={{ padding: "15px" }}
        itemLayout="vertical"
        dataSource={membersList}
        renderItem={(item: any, index) => {
          return (
            <List.Item
              key={item._id}
              extra={
                <Link href="" onClick={() => showDrawer(item)}>
                  View Profile
                </Link>
              }
            >
              <List.Item.Meta
                style={{ cursor: "pointer" }}
                avatar={<Avatar src={item.avatar} />}
                title={item.fullName}
                description={
                  <Space direction="vertical" size="small">
                    <Space size="large">
                      <div>Position: {item.position}</div>
                      <Space size={5}>
                        <div>Role:</div>
                        <div style={{ color: "red" }}>{item.role}</div>
                      </Space>
                    </Space>
                    <div>Email: {item.email}</div>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
      <Drawer
        width={720}
        placement="right"
        closable={false}
        onClose={onCloseDrawer}
        open={openDrawer}
      >
        {selectedUser && (
          <>
            <p
              className="site-description-item-profile-p"
              style={{ marginBottom: 24 }}
            >
              User Profile
            </p>
            <p className="site-description-item-profile-p">Personal</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Full Name"
                  content={selectedUser.fullName}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Account" content={selectedUser.email} />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="City" content="Hanoi" />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Country" content="Vietnam" />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Birthday"
                  content={selectedUser.dateOfBirth}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Website" content="-" />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem
                  title="Message"
                  content="Make things as simple as possible but no simpler."
                />
              </Col>
            </Row>
            <Divider />
            <p className="site-description-item-profile-p">Company</p>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Position"
                  content={selectedUser.position}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Responsibilities" content="Coding" />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DescriptionItem title="Department" content="-" />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem
                  title="Skills"
                  content="C / C + +,data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
                />
              </Col>
            </Row>
            <Divider />
            <p className="site-description-item-profile-p">Contacts</p>
            <Row>
              <Col span={12}>
                <DescriptionItem title="Email" content={selectedUser.email} />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Phone Number"
                  content={selectedUser.telephoneNumber}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem
                  title="Github"
                  content={<a href="">{`github.com/example`}</a>}
                />
              </Col>
            </Row>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default page;
