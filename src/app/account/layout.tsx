import IntroComponent from "@/components/IntroComponent";
import styles from "./page.module.css";
import { Col, Row } from "antd";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className={styles.wrapper}>
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <IntroComponent />
          </Col>
          <Col span={6}>{children}</Col>
        </Row>
      </div>
    </>
  );
}
