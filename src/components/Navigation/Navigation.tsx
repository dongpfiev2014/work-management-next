import { Menu } from "antd";
import type { MenuProps } from "antd";
import { FcParallelTasks } from "react-icons/fc";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "general",
    label: "General",
    type: "group",
    children: [
      { key: "AllTasks", label: "All Tasks", icon: <FcParallelTasks /> },
      { key: "Members", label: "Members", icon: "" },
      { key: "Departments", label: "Departments", icon: "" },
      { key: "Report", label: "Report", icon: "" },
    ],
  },
];

const Navigation: React.FC = () => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
  return (
    <Menu
      onClick={onClick}
      style={{ width: "100%" }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};

export default Navigation;
