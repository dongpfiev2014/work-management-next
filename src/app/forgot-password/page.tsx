"use client";

import { Alert, Button, Flex, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { MailOutlined } from "@ant-design/icons";
import axios from "axios";

interface MessageSignUp {
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  showError: boolean;
}

const page = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [messageSignUp, setMessageSignUp] = useState<MessageSignUp>({
    title: "",
    message: "",
    type: "error",
    showError: false,
  });

  const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/${process.env.NEXT_PUBLIC_VERSION}`;

  const onFinish = async () => {
    setMessageSignUp((prevState) => ({
      ...prevState,
      showError: false,
    }));
    setSubmitting(true);
    try {
      const response = await axios.post(`${baseURL}/auth/forgot-password`, {
        email,
      });

      if (response.data.success) {
        setMessageSignUp({
          title: "Change Password",
          message:
            "A verification email has been sent to your email address. Please go ahead and change your password ",
          type: "info",
          showError: true,
        });
        setTimeout(() => {
          router.push("/account/login");
        }, 10000);
      }
      return response.data;
    } catch (error: any) {
      setMessageSignUp({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Invalid email or email not verified.",
        type: "error",
        showError: true,
      });
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className={styles.main}>
        <div className={styles.formWrapper}>
          <Form
            layout="vertical"
            name="normal_login"
            className="loginForm"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Flex
              vertical
              gap="large"
              align="center"
              justify="center"
              style={{ marginBottom: "15px" }}
            >
              <h1>Forgot Password?</h1>
              <Typography.Text style={{ textAlign: "center" }}>
                {
                  "Enter your email address below and we will send you a link to reset your password."
                }
              </Typography.Text>
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-100"
                size="middle"
                style={{ backgroundColor: "black" }}
                disabled={submitting}
              >
                Continue
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
          </Form>
          <div className={styles.showError}>
            {messageSignUp.showError && (
              <Alert
                message={messageSignUp.title}
                description={messageSignUp.message}
                type={messageSignUp.type}
                showIcon
                closable
                onClose={() =>
                  setMessageSignUp((prevState) => ({
                    ...prevState,
                    showError: false,
                  }))
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
