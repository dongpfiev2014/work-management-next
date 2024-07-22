"use client";

import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Layout,
  notification,
  Radio,
  Row,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { companiesList, userInfo } from "@/selector/userSelector";
import Link from "next/link";
import { User } from "@/types";
import { updateProfile } from "@/reducer/authReducer";
import dayjs from "dayjs";
import Loading from "../loading";

const page: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const userState = useAppSelector(userInfo);
  const companies = useAppSelector(companiesList);
  const dispatch = useAppDispatch();
  const [editingEmail, setEditingEmail] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(
    userState.currentUser?.dateOfBirth
  );
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (companies.companies && companies.companies.length > 0) {
      setIsClient(true);
    }
  }, [companies.companies]);

  const onFinish = (value: User) => {
    const updatedProfile = {
      ...value,
      dateOfBirth: dateOfBirth,
    };
    openNotification(false);
    dispatch(
      updateProfile({
        id: userState.currentUser?.userId,
        updatedProfile,
        avatarFile,
      })
    ).then((action) => {
      if (action.payload && action.payload.success) {
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    });
  };

  const onChangeAvatar = (event: any) => {
    if (event.fileList.length > 0) {
      setAvatarFile(event.fileList[0].originFileObj);
    } else {
    }
  };

  const onChangeDatePicker = (date: any, dateString: any) => {
    setDateOfBirth(dateString);
  };

  const openNotification = (pauseOnHover: boolean) => {
    api.open({
      message: "Profile Updated",
      description: "Profile updated successfully. Refreshing the page...",
      showProgress: true,
      pauseOnHover,
    });
  };

  if (!isClient) {
    return <Loading loading={true} />;
  }

  return (
    <>
      {contextHolder}
      {isClient && userState.currentUser ? (
        <Layout
          style={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "20px",
            height: "100%",
          }}
        >
          <Row>
            <Col>
              <Typography.Title
                level={5}
                style={{
                  color: "rgba(0, 0, 0, 0.88)",
                }}
              >
                My Profile
              </Typography.Title>
              <Typography.Text
                style={{
                  color: "rgba(0, 0, 0, 0.88)",
                }}
              >
                {"Manage and protect your account"}
              </Typography.Text>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col span={24}>
              <Row>
                <Col span={15}>
                  <ConfigProvider
                    theme={{
                      components: {
                        Form: {
                          labelColor: "rgba(0, 0, 0, 0.88)",
                        },
                      },
                    }}
                  >
                    <Form
                      layout="horizontal"
                      labelCol={{
                        span: 6,
                      }}
                      wrapperCol={{
                        span: 18,
                      }}
                      onFinish={onFinish}
                      initialValues={{
                        avatar: userState.currentUser?.avatar,
                        fullName: userState.currentUser?.fullName,
                        email: userState.currentUser?.email,
                        companyId: companies.companies?.[0]?._id || " ",
                        companyName:
                          companies.companies?.[0]?.organizationName || " ",
                        jobTitle: userState.currentUser?.position || " ",
                        address: userState.currentUser?.address,
                        telephoneNumber: userState.currentUser?.telephoneNumber,
                        gender: userState.currentUser?.gender,
                        dateOfBirth: userState.currentUser?.dateOfBirth,
                      }}
                    >
                      <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Full Name!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item label="Email" name="email">
                        {editingEmail ? (
                          <span>
                            <Input value={userState.currentUser?.email} />
                          </span>
                        ) : (
                          <>
                            <span
                              style={{
                                color: "rgba(0, 0, 0, 0.88)",
                              }}
                            >
                              {userState.currentUser?.email}
                            </span>
                            <Link href="" onClick={() => setEditingEmail(true)}>
                              Change
                            </Link>
                          </>
                        )}
                      </Form.Item>
                      <Form.Item label="Company ID" name="companyId">
                        <Input
                          disabled={true}
                          style={{
                            color: "rgba(0, 0, 0, 0.88)",
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Company Name" name="companyName">
                        <Input
                          disabled={true}
                          style={{
                            color: "rgba(0, 0, 0, 0.88)",
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Job Title" name="jobTitle">
                        <Input
                          disabled={true}
                          style={{
                            color: "rgba(0, 0, 0, 0.88)",
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: "Please input your address!",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Telephone Number"
                        name="telephoneNumber"
                        rules={[
                          {
                            required: true,
                            message: "Please input your telephone number!",
                          },
                        ]}
                      >
                        <InputNumber style={{ width: "100%" }} />
                      </Form.Item>
                      <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[
                          {
                            required: true,
                            message: "Please input!",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Radio
                            value="male"
                            style={{
                              color: "rgba(0, 0, 0, 0.88)",
                            }}
                          >
                            "Male"
                          </Radio>
                          <Radio
                            value="female"
                            style={{
                              color: "rgba(0, 0, 0, 0.88)",
                            }}
                          >
                            Female
                          </Radio>
                          <Radio
                            value="other"
                            style={{
                              color: "rgba(0, 0, 0, 0.88)",
                            }}
                          >
                            Other
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Date of birth"
                        rules={[
                          {
                            required: true,
                            message: "Please input!",
                          },
                        ]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          onChange={onChangeDatePicker}
                          defaultValue={
                            userState.currentUser.dateOfBirth
                              ? dayjs(userState.currentUser.dateOfBirth)
                              : dayjs("1970-01-01")
                          }
                        />
                      </Form.Item>
                      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                          Save
                        </Button>
                      </Form.Item>
                    </Form>
                  </ConfigProvider>
                </Col>
                <Col span={1}>
                  <Divider
                    type="vertical"
                    style={{
                      height: "100%",
                      backgroundColor: "rgba(255, 255, 255, 0.65)",
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Row
                    className="d-flex justify-content-center"
                    style={{
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Flex justify="center" align="center" gap="small" vertical>
                      <Image
                        src={userState.currentUser?.avatar}
                        width={200}
                        height={200}
                        preview={true}
                        style={{
                          cursor: "pointer",
                          objectFit: "cover",
                          border: "2px solid #f5f5f5",
                          borderRadius: "50%",
                        }}
                      />
                      <Upload
                        name="avatar"
                        listType="picture-circle"
                        onChange={onChangeAvatar}
                      >
                        <span
                          style={{
                            color: "rgba(0, 0, 0, 0.88)",
                          }}
                        >
                          Upload Image
                        </span>
                      </Upload>
                    </Flex>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Layout>
      ) : (
        <Loading loading={true} />
      )}
    </>
  );
};

export default page;
