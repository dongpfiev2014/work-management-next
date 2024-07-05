"use client";

import IntroComponent from "@/components/IntroComponent";
import {
  Alert,
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../loading";
import styles from "./page.module.css";
import Link from "next/link";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/lib/hooks";
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

  useEffect(() => {
    if (accessToken && accessToken !== "undefined" && accessToken !== null) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [setLoading, accessToken, router]);

  if (loading)
    return (
      <>
        <Loading loading={loading} />;
      </>
    );
  const onFinish = () => {
    dispatch(login({ email, password })).then((action) => {
      const response = action.payload;
      if (response.success) {
        router.push("/");
        localStorage.setItem("accessToken", response.accessToken);
        setShowError(false);
      } else setShowError(true);
    });
  };

  return (
    <div className={styles.wrapper}>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <IntroComponent />
        </Col>
        <Col span={6}>
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
                  <Typography.Text>
                    {"Welcome back! Let's take you to your account."}
                  </Typography.Text>
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
                    onClick={() => router.push("/signup")}
                    size="middle"
                  >
                    {"Don't have an account?"}
                    <Link className="text-primary" href={"/signup"}>
                      Sign up
                    </Link>
                  </Button>
                </Form.Item>
                <Form.Item className="d-flex justify-content-center align-items-center text-secondary">
                  <Typography.Text style={{ fontSize: "13px" }}>
                    {
                      "By continuing to use our services, you acknowledge that you have both read and agree to our Terms of Service and Privacy Policy."
                    }
                  </Typography.Text>
                </Form.Item>
              </Form>
              {showError && (
                <Alert
                  message="Error"
                  description="Invalid credentials"
                  type="error"
                  showIcon
                  closable
                  onClose={() => setShowError(false)}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginForm;
