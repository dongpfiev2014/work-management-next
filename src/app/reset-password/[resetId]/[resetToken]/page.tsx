"use client";

import { Alert, Button, Flex, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { PasswordPatternRules } from "@/lib/constants";

interface MessageSignUp {
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  showError: boolean;
}

const page = ({
  params,
}: {
  params: { resetId: string; resetToken: string };
}) => {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [messageSignUp, setMessageSignUp] = useState<MessageSignUp>({
    title: "",
    message: "",
    type: "error",
    showError: false,
  });
  const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/${process.env.NEXT_PUBLIC_VERSION}`;

  const onFinish = async () => {
    setMessageSignUp((prevState) => ({
      ...prevState,
      showError: false,
    }));
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${baseURL}/auth/reset-password/${params.resetId}/${params.resetToken}`,
        {
          password,
        }
      );

      if (response.data.success) {
        setSubmitting(false);
        setMessageSignUp({
          title: "Change Password",
          message: "Changed password successfully. Please log in again.",
          type: "info",
          showError: true,
        });
        setTimeout(() => {
          router.push("/account/login");
        }, 3000);
      }
      return response.data;
    } catch (error: any) {
      setMessageSignUp({
        title: "Error",
        message:
          error.response?.data?.message ||
          "An error occurred while changing the password.",
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
              <h1>Reset Password</h1>
              <Typography.Text style={{ textAlign: "center" }}>
                {"Please enter your new password below to reset your account."}
              </Typography.Text>
            </Flex>
            <Form.Item
              name="password"
              rules={PasswordPatternRules}
              validateFirst
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
