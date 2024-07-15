import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  Space,
  Tabs,
  Tag,
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
import { userInfo } from "@/selector/userSelector";
import { GoPasskeyFill } from "react-icons/go";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "general",
    label: "General",
    type: "group",
    children: [
      { key: "allTasks", label: "All Tasks", icon: <FcParallelTasks /> },
      { key: "members", label: "Members", icon: <FcAssistant /> },
      { key: "departments", label: "Departments", icon: <FcDepartment /> },
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

const Navigation: React.FC = () => {
  const userState = useAppSelector(userInfo);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [tabKey, setTabKey] = useState("1");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleFormSubmit = () => {
    form.submit();
    setConfirmLoading(true);
  };

  const onFinishCreateOrganization = (values: any) => {
    console.log("CreateOrganization:", values);
  };
  const onFinishJoinOrganization = (values: any) => {
    console.log("JoinOrganizatio:", values);
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
    { value: "juniorSoftwareDeveloper", label: "Junior Software Developer" },
    { value: "seniorSoftwareDeveloper", label: "Senior Software Developer" },
    { value: "projectManager", label: "Project Manager" },
    { value: "teamLead", label: "Team Lead" },
    { value: "qaEngineer", label: "QA Engineer" },
    { value: "productManager", label: "Product Manager" },
    { value: "hrAdministrator", label: "HR Administrator" },
    { value: "systemAdministrator", label: "System Administrator" },
    { value: "uiUxDesigner", label: "UI/UX Designer" },
    { value: "devOpsEngineer", label: "DevOps Engineer" },
    { value: "marketingSpecialist", label: "Marketing Specialist" },
    { value: "salesManager", label: "Sales Manager" },
    { value: "customerSupport", label: "Customer Support" },
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
            form={form}
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
            <Form.Item label="Number of Employees" name="numberOfEmployees">
              <Input placeholder="Enter the number of employees" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea placeholder="Enter a brief description of your company" />
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
            form={form}
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

  return (
    <>
      <Card>
        <Card.Meta
          avatar={
            <Avatar
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYtQnQqqG4Dy3gLgYr85AymXaj2tX09X8LMA&s"
              }
            />
            // <Avatar src={userState.currentUser?.companies[0] || "Apple Inc."} />
          }
          title={"Apple Inc."}
          // title={userState.currentUser?.companies[0] || "Apple Inc."}
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
      </Card>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        defaultSelectedKeys={["allTasks"]}
        mode="inline"
        items={items}
      />
      <Modal
        open={open}
        // onOk={handleOk}
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
