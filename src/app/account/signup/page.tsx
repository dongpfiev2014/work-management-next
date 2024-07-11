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
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "@/lib/hooks";
import { register } from "@/reducer/authReducer";
import { PasswordPatternRules } from "@/lib/constants";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  User,
} from "firebase/auth";
import { app } from "@/config/config";

const SignUpForm = () => {
  const router = useRouter();
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    if (accessToken && accessToken !== "undefined" && accessToken !== null) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        setGoogleUser(user);
      } else {
        setGoogleUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (loading)
    return (
      <>
        <Loading loading={loading} />;
      </>
    );

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // userState.currentUser.emailVerified && router.push("/");
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const onFinish = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowError(false);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        const user = userCred.user;
        console.log(user);
        await sendEmailVerification(user);
        setShowError(true);
        setErrorMessage(
          "A verification email has been sent to your email address. Please verify your account and then log in."
        );
        // router.push("/");
      })
      .catch((error) => {
        console.log("Error creating user: ", error);
        setSubmitting(false);
        setShowError(true);
        setErrorMessage("Email has already been used. Please try again");
      });

    // dispatch(register({ fullName, email, password })).then((action: any) => {
    //   const response = action.payload;
    //   console.log(response);
    //   if (response.success) {
    //     success();
    //     localStorage.setItem("accessToken", response.accessToken);
    //     setShowError(false);
    //   } else {
    //     setShowError(true);
    //     setSubmitting(false);
    //   }
    // });
  };

  const success = () => {
    messageApi
      .open({
        type: "success",
        content: "Register successful!",
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
              <h1>Sign Up</h1>
              <Typography.Text style={{ textAlign: "center" }}>
                {
                  "Create an account to track your progress, showcase your skill-set and be a part of the community."
                }
              </Typography.Text>
              <Button
                icon={<GoogleOutlined />}
                block
                type="link"
                onClick={signInWithGoogle}
              >
                {"Continue with Google"}
              </Button>
              <Divider plain>OR</Divider>
            </Flex>
            <Form.Item
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Please input your Full Name!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                allowClear
                size="middle"
                value={email}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Item>
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
                Sign Up
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                className="w-100"
                onClick={() => router.push("/account/login")}
                size="middle"
              >
                {"Already have an account?"}
                <Link className="text-primary" href={"/account/login"}>
                  Login
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
                message="Error hahaha"
                description={errorMessage}
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

export default SignUpForm;
