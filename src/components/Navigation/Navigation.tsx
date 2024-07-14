import { Avatar, Card, Checkbox, Menu, Space, Tag } from "antd";
import type { MenuProps } from "antd";
import {
  FcAssistant,
  FcDepartment,
  FcExpired,
  FcHighPriority,
  FcParallelTasks,
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
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
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
              <Space size="small">
                <GoPasskeyFill />
                Private
              </Space>
            </>
          }
        />
      </Card>
      <Menu
        onClick={onClick}
        style={{ width: "100%" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </>
  );
};

export default Navigation;
