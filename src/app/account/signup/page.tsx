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
import { logInWithGoogle, register } from "@/reducer/authReducer";
import { PasswordPatternRules } from "@/lib/constants";
import {
  createUserWithEmailAndPassword,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/config/config";
import { fetchGeoLocation } from "@/utils/geoLocation";
import { FcGoogle } from "react-icons/fc";

interface MessageSignUp {
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  showError: boolean;
}

const provider = new GoogleAuthProvider();

const SignUpForm = () => {
  const router = useRouter();
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageSignUp, setMessageSignUp] = useState<MessageSignUp>({
    title: "",
    message: "",
    type: "error",
    showError: false,
  });
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isSignInWithGoogle, setIsSignInWithGoogle] = useState(false);

  provider.setCustomParameters({ prompt: "select_account" });
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (accessToken && accessToken !== "undefined" && accessToken !== null) {
      router.push("/");
    } else {
      setLoading(false);
    }
    signOut(auth);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setGoogleUser(user);
        // console.log(user);
      } else {
        setGoogleUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    if (googleUser) {
      const interval = setInterval(async () => {
        await googleUser.reload();
        const user = getAuth().currentUser;
        if (user && user.emailVerified && !isSignInWithGoogle) {
          clearInterval(interval);
          const geoLocationDetails = await fetchGeoLocation();
          dispatch(
            register({
              fullName,
              email,
              password,
              emailVerified: user.emailVerified,
              geoLocationDetails,
            })
          ).then((action: any) => {
            const response = action.payload;
            if (response.success) {
              success();
              localStorage.setItem("accessToken", response.accessToken);
              setMessageSignUp((prevState) => ({
                ...prevState,
                showError: false,
              }));
            } else {
              setMessageSignUp((prevState) => ({
                title: "Error",
                message: "Email has already been used. Please try again",
                type: "error",
                showError: true,
              }));
              setSubmitting(false);
            }
          });
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [googleUser]);

  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result) {
          const geoLocationDetails = await fetchGeoLocation();
          dispatch(
            logInWithGoogle({ userInfo: result.user, geoLocationDetails })
          ).then((action: any) => {
            const response = action.payload;
            if (response.success) {
              success();
              localStorage.setItem("accessToken", response.accessToken);
            } else {
              setMessageSignUp((prevState) => ({
                title: "Error",
                message: "Failed to log in with Google. Please try again",
                type: "error",
                showError: true,
              }));
              setSubmitting(false);
            }
          });
        }
      } catch (error) {
        // console.log("Error getting redirect result", error);
      }
    };
    fetchRedirectResult();
  }, []);

  if (loading)
    return (
      <>
        <Loading loading={loading} />;
      </>
    );

  const signInWithGoogle = async () => {
    setIsSignInWithGoogle(true);

    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);

        const geoLocationDetails = await fetchGeoLocation();
        dispatch(
          logInWithGoogle({ userInfo: result.user, geoLocationDetails })
        ).then((action: any) => {
          const response = action.payload;
          if (response.success) {
            success();
            localStorage.setItem("accessToken", response.accessToken);
          } else {
            setMessageSignUp((prevState) => ({
              title: "Error",
              message: "Failed to log in with Google. Please try again",
              type: "error",
              showError: true,
            }));
            setSubmitting(false);
          }
        });
      }
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const onFinish = async () => {
    if (submitting) return;
    setSubmitting(true);
    setIsSignInWithGoogle(false);
    setMessageSignUp((prevState) => ({
      ...prevState,
      showError: false,
    }));
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCred) => {
        const user = userCred.user;
        await sendEmailVerification(user);
        setMessageSignUp({
          title: "Email Verification",
          message:
            "A verification email has been sent to your email address. Please verify your account and then log in.",
          type: "info",
          showError: true,
        });
      })
      .catch((error) => {
        setMessageSignUp({
          title: "Error",
          message:
            error.message || "Email has already been used. Please try again",
          type: "error",
          showError: true,
        });
        setSubmitting(false);
      });
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
          duration: 1,
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
              {!isMobile && (
                <Button
                  icon={<FcGoogle size={20} />}
                  block
                  type="link"
                  onClick={signInWithGoogle}
                >
                  {"Continue with Google"}
                </Button>
              )}
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
                Continue to Verify Email
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

export default SignUpForm;
