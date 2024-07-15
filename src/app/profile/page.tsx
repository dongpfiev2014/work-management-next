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
  Layout,
  Radio,
  Row,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { profileInfo, userInfo } from "@/selector/userSelector";
import Link from "next/link";
import { User } from "@/types";
import { updateProfile } from "@/reducer/profileReducer";

const page: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const userState = useAppSelector(userInfo);
  const profileState = useAppSelector(profileInfo);
  const dispatch = useAppDispatch();
  const [editingEmail, setEditingEmail] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
    fetchProfile(); // Fetch user profile data
  }, []);

  const fetchProfile = () => {
    // Fetch user profile data
  };

  const onFinish = (value: User) => {
    console.log(value);
    const updatedProfile = {
      ...userState.currentUser,
      ...value,
      dateOfBirth: dateOfBirth,
    };
    console.log(updatedProfile);
    dispatch(
      updateProfile({
        id: userState.currentUser?.userId,
        updatedProfile,
        avatarFile,
      })
    );
  };
  const onChangeDatePicker = (date: any, dateString: any) => {
    setDateOfBirth(dateString);
  };

  const dateString = profileState.currentProfile?.dateOfBirth;
  const dateFormat = "YYYY-MM-DD";
  const dateValue = dateString ? moment(dateString, dateFormat) : null;

  const onChangeAvatar = (event: any) => {
    if (event.fileList.length > 0) {
      setAvatarFile(event.fileList[0].originFileObj);
    } else {
    }
  };

  return (
    <>
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
                        email: userState.currentUser?.email,
                        fullName: userState.currentUser?.fullName,
                        address: profileState.currentProfile?.address,
                        telephoneNumber:
                          profileState.currentProfile?.telephoneNumber,
                        gender: profileState.currentProfile?.gender,
                        dateOfBirth: profileState.currentProfile?.dateOfBirth,
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
                        <Input value={userState.currentUser?.fullName} />
                      </Form.Item>
                      <Form.Item label="Email" name="email">
                        {editingEmail ? (
                          <span>
                            <Input
                              defaultValue={userState.currentUser?.email}
                            />
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
                          value={
                            profileState.currentProfile?.companyId?.length
                              ? profileState.currentProfile?.companyId[0]?.id
                              : ""
                          }
                          disabled={true}
                          style={{
                            color: "rgba(0, 0, 0, 0.88)",
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Company Name" name="companyName">
                        <Input
                          value={
                            profileState.currentProfile?.companyId?.length
                              ? profileState.currentProfile?.companyId[0]?.name
                              : ""
                          }
                          disabled={true}
                          style={{
                            color: "rgba(0, 0, 0, 0.88)",
                          }}
                        />
                      </Form.Item>
                      <Form.Item label="Job Title" name="jobTitle">
                        <Input
                          value={
                            profileState.currentProfile?.companyId?.length
                              ? profileState.currentProfile?.jobTitle
                              : ""
                          }
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
                            message: "Please input your telephone number!",
                          },
                        ]}
                      >
                        <Input value={profileState.currentProfile?.address} />
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
                        <Input
                          value={profileState.currentProfile?.telephoneNumber}
                        />
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
                          onChange={onChangeDatePicker}
                          defaultValue={dateValue}
                          format={dateFormat}
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
                    justify="center"
                    align="middle"
                    style={{ height: "100%" }}
                  >
                    <Flex vertical justify="center" align="center" gap="small">
                      <Image
                        src={userState.currentUser?.avatar}
                        width={100}
                        preview={true}
                        style={{ cursor: "pointer", borderRadius: "50%" }}
                      />
                      <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
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
      ) : null}
    </>
  );
};

export default page;
