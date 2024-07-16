"use client";

import { Avatar, Breadcrumb, List, Space } from "antd";
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

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const page = () => {
  const companiesState = useAppSelector(companiesList);
  const [membersList, setMembersList] = useState([]);
  const router = useRouter();

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
        style={{ padding: "10px" }}
        itemLayout="vertical"
        dataSource={membersList}
        renderItem={(item: any, index) => {
          return (
            <List.Item
              key={item._id}
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
            >
              <List.Item.Meta
                style={{ cursor: "pointer" }}
                avatar={<Avatar src={item.avatar} />}
                title={item.fullName}
                description={
                  <Space direction="vertical" size="small">
                    <Space size="large">
                      <div>Position: {item.position}</div>
                      <div>Role: {item.role}</div>
                    </Space>
                    <div>Email: {item.email}</div>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default page;
