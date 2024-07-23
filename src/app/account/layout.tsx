"use client";

import IntroComponent from "@/components/IntroComponent";
import styles from "./page.module.css";
import { Col, Grid, Row } from "antd";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const screens = Grid.useBreakpoint();
  return (
    <>
      <div className={styles.wrapper}>
        <Row gutter={[5, 5]}>
          <Col xs={24} sm={12} md={15} lg={18} span={18}>
            <div style={{ height: screens.xs ? "30vh" : "100vh" }}>
              <IntroComponent />
            </div>
          </Col>
          <Col xs={24} sm={12} md={9} lg={6} span={6}>
            {children}
          </Col>
        </Row>
      </div>
    </>
  );
}
