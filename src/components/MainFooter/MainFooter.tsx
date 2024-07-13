import { Button, Divider, Flex, Space } from "antd";
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import styles from "./page.module.css";

const MainFooter = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <Divider orientation="center" />
        <Flex justify="center" align="center" gap={350}>
          <span>Copyright © 2024. All right reserved</span>
          <Space size="small">
            <Button type="link" icon={<InstagramOutlined />} size="middle" />
            <Button type="link" icon={<FacebookOutlined />} size="middle" />
            <Button type="link" icon={<TwitterOutlined />} size="middle" />
            <Button type="link" icon={<YoutubeOutlined />} size="middle" />
          </Space>
        </Flex>
      </div>
    </>
  );
};

export default MainFooter;
