"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signout } from "@/reducer/authReducer";
import { userInfo } from "@/selector/userSelector";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Flex,
  Input,
  List,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { app } from "@/config/config";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import defaultAvatar from "@/assets/avatar-default.png";

const MainHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  console.log(userState);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setGoogleUser(user);
      } else {
        // router.push("/account/login");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignOut = async () => {
    signOut(auth);
    if (accessToken) {
      dispatch(signout());
    }
  };
  const handleSearch = () => {};

  return (
    <>
      <div className={styles.wrapper}>
        <Row className={styles.main}>
          <Col className={styles.app} onClick={() => router.push("/")}>
            <h2 className={styles.tasktis}>Tasktis</h2>
            <h2 className={styles.inc}>.inc</h2>
          </Col>
          <Col className={styles.nav}>
            <Flex justify="center" align="flex-start" vertical>
              <Typography.Title className="fs-4">
                Hi {userState.currentUser?.fullName} !!
              </Typography.Title>
              <Typography.Text type="secondary" className="fs-6">
                {"Do your job well"}
              </Typography.Text>
            </Flex>
            <Flex justify="center" align="center" gap={10}>
              <Input.Search
                placeholder="Search project, task, etc..."
                allowClear
                style={{
                  width: 400,
                }}
                onChange={handleSearch}
              />
              <Dropdown
                dropdownRender={() => (
                  <Card
                    hoverable
                    style={{
                      minWidth: 400,
                    }}
                    type="inner"
                  >
                    <List
                      renderItem={(item, index) => (
                        <>
                          <List.Item>
                            <List.Item.Meta />
                          </List.Item>
                        </>
                      )}
                    />
                  </Card>
                )}
                placement="bottom"
              >
                <Badge count={4} size="small">
                  <BellOutlined
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  />
                </Badge>
              </Dropdown>
              <Dropdown
                dropdownRender={() => (
                  <Card
                    hoverable
                    style={{
                      minWidth: 100,
                    }}
                    type="inner"
                    className="d-flex justify-content-center"
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ backgroundColor: "white" }}
                    >
                      <Button type="link" onClick={() => {}}>
                        My account
                      </Button>
                      <Button type="link" onClick={handleSignOut}>
                        Sign out
                      </Button>
                    </Space>
                  </Card>
                )}
                placement="bottom"
              >
                <Space size="small" style={{ cursor: "pointer" }}>
                  <Avatar
                    src={userState.currentUser?.avatar || null}
                    icon={!userState.currentUser?.avatar && <UserOutlined />}
                  />
                  <span>{userState.currentUser?.fullName}</span>
                </Space>
              </Dropdown>
            </Flex>
          </Col>
        </Row>
      </div>
      <Divider style={{ marginTop: 0 }} />
    </>
  );
};

export default MainHeader;
