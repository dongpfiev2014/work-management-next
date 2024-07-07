"use client";

import {
  Alert,
  Button,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import styles from "./page.module.css";
import Link from "next/link";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login } from "@/reducer/authReducer";

const LoginForm = () => {
  const router = useRouter();
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (accessToken && accessToken !== "undefined" && accessToken !== null) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <>
        <Loading loading={loading} />;
      </>
    );

  const onFinish = () => {
    setShowError(false);
    dispatch(login({ email, password })).then((action: any) => {
      const response = action.payload;
      if (response.success) {
        success();
        localStorage.setItem("accessToken", response.accessToken);
        setShowError(false);
      } else setShowError(true);
    });
  };

  const success = () => {
    messageApi
      .open({
        type: "success",
        content: "Login successful!",
        duration: 1,
      })
      .then(() =>
        messageApi.open({
          type: "loading",
          content: "Redirecting now...",
          duration: 1.5,
          onClose: () => router.push("/"),
        })
      );
  };
  return (
    <>
      {contextHolder}
      <div className={styles.main}>
        <div className={styles.formWrapper}>
          <Form
            layout="vertical"
            name="normal_login"
            className="loginForm"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Flex vertical gap="middle" align="center" justify="center">
              <h1>Login</h1>
              <Typography.Text style={{ textAlign: "center" }}>
                {"Welcome back! Let's take you to your account."}
              </Typography.Text>
              <Typography.Text style={{ textAlign: "center" }}>
                {
                  "You can log in using your email or use the credentials below to explore the website:"
                }
              </Typography.Text>
              <div className={styles.credentials}>
                <div>
                  <Typography.Text>{"Email: "}</Typography.Text>
                  <Typography.Text strong>
                    {"user@example.com "}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text>{"Password: "}</Typography.Text>
                  <Typography.Text strong>{"Password123@"}</Typography.Text>
                </div>
              </div>
              <Button icon={<GoogleOutlined />} block type="link">
                {"Continue with Google"}
              </Button>
              <Divider plain>OR</Divider>
            </Flex>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email Address"
                allowClear
                size="middle"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                size="middle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Link href={"/"}>Reset your password?</Link>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-100"
                size="middle"
                style={{ backgroundColor: "black" }}
              >
                Log in
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                className="w-100"
                onClick={() => router.push("/account/signup")}
                size="middle"
              >
                {"Don't have an account?"}
                <Link className="text-primary" href={"/account/signup"}>
                  Sign up
                </Link>
              </Button>
            </Form.Item>
            <Form.Item className="d-flex justify-content-center align-items-center text-secondary">
              <Typography.Text
                style={{ fontSize: "13px", textAlign: "center" }}
              >
                {
                  "By continuing to use our services, you acknowledge that you have both read and agree to our Terms of Service and Privacy Policy."
                }
              </Typography.Text>
            </Form.Item>
          </Form>
          <div className={styles.showError}>
            {showError && (
              <Alert
                message="Error"
                description="Invalid email or password."
                type="error"
                showIcon
                closable
                onClose={() => setShowError(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;