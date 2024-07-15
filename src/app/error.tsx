"use client";

import React from "react";
import { Button, Result } from "antd";

const error: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={<Button type="primary">Back Home</Button>}
  />
);

export default error;
