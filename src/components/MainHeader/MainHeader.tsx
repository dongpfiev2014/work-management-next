"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { signout } from "@/reducer/authReducer";
import { companiesList, userInfo } from "@/selector/userSelector";
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
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addJoinRequest, approveJoinRequest } from "@/reducer/joinRequestSlice";

interface Notification {
  userId: string;
  organizationId: string;
  position: string;
  reason: string;
  role: string;
}

const socket = io(
  `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
);

const MainHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userState = useAppSelector(userInfo);
  const companiesState = useAppSelector(companiesList);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const auth = getAuth(app);
  const requests = useSelector(
    (state: RootState) => state.joinRequets.requests
  );

  useEffect(() => {
    if ("admin" === "admin") {
      socket.emit("join-admin", {
        userId: userState.currentUser?._id,
      });
    }
    socket.on("join-request", (data) => {
      dispatch(addJoinRequest(data));
    });

    socket.on("request-approved", (data) => {
      dispatch(approveJoinRequest(data));
    });
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGoogleUser(user);
      } else {
        // router.push("/account/login");
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleApprove = (id: string) => {
    socket.emit("approve-request", { id });
  };

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
                  <>
                    <Card
                      hoverable
                      style={{
                        minWidth: 400,
                      }}
                      type="inner"
                    >
                      <List
                        dataSource={requests}
                        renderItem={(req: any, index) => (
                          <>
                            <List.Item key={index}>
                              <p>
                                User {req.userId} wants to join organization{" "}
                                {req.organizationId} as {req.position}. Reason:{" "}
                                {req.reason}, Role: {req.role}
                              </p>
                              <button onClick={() => handleApprove(req.id)}>
                                Approve
                              </button>
                            </List.Item>
                          </>
                        )}
                      />
                    </Card>
                  </>
                )}
                placement="bottom"
              >
                <Badge count={requests.length} size="small">
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
                      <Button
                        type="link"
                        onClick={() => router.push("/profile")}
                      >
                        My profile
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
      <Divider style={{ marginTop: 0, marginBottom: 0, width: "100%" }} />
    </>
  );
};

export default MainHeader;
