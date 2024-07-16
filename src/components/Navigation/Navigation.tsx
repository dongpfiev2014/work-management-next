import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Image,
  Input,
  Menu,
  Modal,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  Upload,
} from "antd";
import type { MenuProps } from "antd";
import {
  FcAssistant,
  FcDepartment,
  FcExpired,
  FcHighPriority,
  FcParallelTasks,
  FcPlus,
  FcRatings,
  FcSelfServiceKiosk,
} from "react-icons/fc";
import { CgTemplate } from "react-icons/cg";
import { BsArchive } from "react-icons/bs";
import { GrTrash } from "react-icons/gr";
import { VscSettingsGear } from "react-icons/vsc";
import { GiTimeBomb } from "react-icons/gi";
import { useAppSelector } from "@/lib/hooks";
import { companiesList, userInfo } from "@/selector/userSelector";
import { GoPasskeyFill } from "react-icons/go";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import axiosClient from "@/apis/axiosClient";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

const socket = io(
  `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}`
);

const Navigation: React.FC = () => {
  const userState = useAppSelector(userInfo);
  const companiesState = useAppSelector(companiesList);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form1] = useForm();
  const [form2] = useForm();
  const [tabKey, setTabKey] = useState("1");
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  console.log(companiesState);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleFormSubmit = () => {
    if (tabKey === "1") {
      form1.submit();
    } else form2.submit();
  };

  const onFinishCreateOrganization = async (values: any) => {
    console.log("CreateOrganization:", values);
    try {
      setConfirmLoading(true);
      const formData = new FormData();
      formData.append("newCompanyData", JSON.stringify(values));
      if (logoFile) {
        formData.append("companyLogo", logoFile);
      }
      const response = await axiosClient.post(
        `/company/${userState.currentUser?.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response && response.status === 201 && response.data) {
        console.log(response.data);
        window.location.reload();
        return response.data;
      }
    } catch (error) {
      console.log("Error creating organization:", error);
    }
  };

  const JoinOrganization = (
    userId: string,
    fullName: string | undefined,
    organizationId: string,
    position: string,
    reason: string,
    role: string,
    avatar: string | undefined
  ) => {
    socket.emit("join-request", {
      userId: userId,
      fullName: fullName,
      organizationId: organizationId,
      position: position,
      reason: reason,
      role: role,
      avatar: avatar,
    });
  };

  socket.on("disconnect", () => {});

  const onFinishJoinOrganization = (values: any) => {
    setConfirmLoading(true);
    const { organizationId, position, reason, role } = values;
    const userId = userState.currentUser?.userId;
    const avatar = userState.currentUser?.avatar;
    const fullName = userState.currentUser?.fullName;
    if (userId) {
      JoinOrganization(
        userId,
        fullName,
        organizationId,
        position,
        reason,
        role,
        avatar
      );
    }
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const onChangeLogo = (event: any) => {
    if (event.fileList.length > 0) {
      setLogoFile(event.fileList[0].originFileObj);
    } else {
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const onChangeTab = (key: any) => {
    if (key === "1") {
      setTabKey("1");
    }
    if (key === "2") {
      setTabKey("2");
    }
  };

  const roleOptions = [
    { value: "employee", label: "Employee" },
    { value: "manager", label: "Manager" },
  ];

  const positionOptions = [
    {
      value: "Fresher Software Developer",
      label: "Fresher Software Developer",
    },
    { value: "Junior Software Developer", label: "Junior Software Developer" },
    { value: "Senior Software Developer", label: "Senior Software Developer" },
    { value: "Project Manager", label: "Project Manager" },
    { value: "Team Lead", label: "Team Lead" },
    { value: "QA Engineer", label: "QA Engineer" },
    { value: "Product Manager", label: "Product Manager" },
    { value: "HR Administrator", label: "HR Administrator" },
    { value: "System Administrator", label: "System Administrator" },
    { value: "UIUX Designer", label: "UI/UX Designer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "Marketing Specialist", label: "Marketing Specialist" },
    { value: "Sales Manager", label: "Sales Manager" },
    { value: "Customer Support", label: "Customer Support" },
    { value: "Other", label: "Other" },
  ];

  const tabItems = [
    {
      key: "1",
      label: "Create A New Organization",
      children: (
        <>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinishCreateOrganization}
            form={form1}
          >
            <Form.Item
              label="Organization Name"
              name="organizationName"
              rules={[
                {
                  required: true,
                  message: "Please input your organization name!",
                },
              ]}
            >
              <Input placeholder="Enter your organization name" />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your company address!",
                },
              ]}
            >
              <Input placeholder="Enter your company address" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your company email!",
                  type: "email",
                },
              ]}
            >
              <Input placeholder="Enter your company email" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please input your company phone number!",
                },
              ]}
            >
              <Input placeholder="Enter your company phone number" />
            </Form.Item>
            <Form.Item label="Website" name="website">
              <Input placeholder="Enter your company website URL" />
            </Form.Item>
            <Form.Item label="Industry" name="industry">
              <Input placeholder="Enter your company industry" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea placeholder="Enter a brief description of your company" />
            </Form.Item>
            <Form.Item label="Company Logo">
              <Upload
                name="companyLogo"
                listType="picture-circle"
                onChange={onChangeLogo}
              >
                Upload
              </Upload>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      key: "2",
      label: "Join An Existing Organization",
      children: (
        <>
          <Form
            layout="vertical"
            onFinish={onFinishJoinOrganization}
            form={form2}
          >
            <Form.Item
              label="Organization ID"
              name="organizationId"
              rules={[
                {
                  required: true,
                  message: "Please input the organization ID!",
                },
              ]}
            >
              <Input placeholder="Enter organization ID" />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[
                {
                  required: true,
                  message: "Please select your role!",
                },
              ]}
            >
              <Select options={roleOptions} placeholder="Select your role" />
            </Form.Item>
            <Form.Item
              label="Position"
              name="position"
              rules={[
                {
                  required: true,
                  message: "Please select your position!",
                },
              ]}
            >
              <Select
                options={positionOptions}
                placeholder="Select your position"
              />
            </Form.Item>
            <Form.Item label="Reason for Joining" name="reason">
              <Input.TextArea placeholder="Enter your reason for joining (optional)" />
            </Form.Item>
          </Form>
        </>
      ),
    },
  ];

  const items: MenuItem[] = [
    {
      key: "general",
      label: "General",
      type: "group",

      children: [
        {
          key: "allTasks",
          label: "All Tasks",
          icon: <FcParallelTasks />,
          onClick: () => router.push("/"),
        },
        {
          key: "members",
          label: "Members",
          icon: <FcAssistant />,
          onClick: () => router.push("/members"),
        },
        {
          key: "departments",
          label: "Departments",
          icon: <FcDepartment />,
          onClick: () => router.push("/departments"),
        },
        { key: "report", label: "Report", icon: <FcRatings /> },
      ],
    },
    {
      key: "teamBoards",
      label: "Team Boards",
      type: "group",
      children: [
        { key: "generalTeam", label: "General", icon: <FcParallelTasks /> },
        { key: "uiux", label: "UI/UX Design", icon: <FcAssistant /> },
        {
          key: "webDevelopment",
          label: "Web Development",
          icon: <FcDepartment />,
        },
        {
          key: "mobileDevelopment",
          label: "Mobile Development",
          icon: <FcRatings />,
        },
      ],
    },
    {
      key: "appearance",
      label: "Appearance",
      type: "group",
      children: [
        { key: "template", label: "Template", icon: <CgTemplate /> },
        { key: "archive", label: "Archive", icon: <BsArchive /> },
        {
          key: "trash",
          label: "Trash",
          icon: <GrTrash />,
        },
        {
          key: "settings",
          label: "Settings",
          icon: <VscSettingsGear />,
        },
      ],
    },
    {
      key: "colorLegend",
      label: "Color Legend",
      type: "group",
      children: [
        {
          key: "important",
          label: <Tag color="orange">Important</Tag>,
          icon: <FcHighPriority />,
        },
        {
          key: "urgent",
          label: <Tag color="magenta">Urgent</Tag>,
          icon: <FcExpired />,
        },
        {
          key: "Critical",
          label: <Tag color="purple">Critical</Tag>,
          icon: <GiTimeBomb />,
        },
        {
          key: "neither",
          label: <Tag color="cyan">Neither</Tag>,
          icon: <FcSelfServiceKiosk />,
        },
      ],
    },
  ];

  return (
    <>
      <Card>
        <Flex vertical>
          <Card.Meta
            avatar={
              <Avatar
                size={35}
                src={
                  companiesState.companies?.length
                    ? companiesState.companies[0].companyLogo
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYtQnQqqG4Dy3gLgYr85AymXaj2tX09X8LMA&s"
                }
              />
            }
            title={
              companiesState.companies?.length
                ? companiesState.companies[0].organizationName
                : "Apple Inc."
            }
            description={
              <>
                <Space size="small" style={{ cursor: "pointer" }}>
                  <GoPasskeyFill />
                  {"Private"}
                  <FcPlus size={20} onClick={showModal} />
                </Space>
              </>
            }
          />
        </Flex>
      </Card>
      <Typography.Text type="secondary">
        ID: {companiesState.companies?.[0]?._id}
      </Typography.Text>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        defaultSelectedKeys={["allTasks"]}
        mode="inline"
        items={items}
      />
      <Modal
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            Join Organization
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onChangeTab} />
      </Modal>
    </>
  );
};

export default Navigation;
