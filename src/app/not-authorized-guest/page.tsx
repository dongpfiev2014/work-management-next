"use client";

import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

const NotAuthorized: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle={
          <>
            <p>Sorry, you are not authorized to access this page.</p>
            <p>
              Please click the green "+" icon at the top left and select "Create
              A New Organization" or "Join An Existing Organization".
            </p>
            Enter the organization ID: 6695b7e9c6523f209db6781d and wait for our
            confirmation
            <p></p>
            <p>Alternatively, you can log in with the following account:</p>
            <p>Email: user@example.com </p>
            <p>Password: Password123@</p>
          </>
        }
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            Back Home
          </Button>
        }
      />
    </>
  );
};

export default NotAuthorized;
