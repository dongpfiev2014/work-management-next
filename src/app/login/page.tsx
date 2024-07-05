"use client";

import IntroComponent from "@/components/IntroComponent";
import { Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginForm = () => {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [setLoading, accessToken, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <IntroComponent />
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <Typography.Paragraph>
        {
          "Vậy CSRF là gì? CSRF hay còn gọi là kỹ thuật tấn công “Cross-site Request Forgery“, nghĩa là kỹ thuật tấn công giả mạo chính chủ thể của nó. CSRF nói đến việc tấn công vào chứng thực request trên web thông qua việc sử dụng Cookies. Đây là nơi mà các hacker có khả năng sử dụng thủ thuật để tạo request mà bạn không hề biết. Vì vậy, một CSRF là hacker lạm dụng sự tin tưởng của một ứng dụng web trên trình duyệt của nạn nhân."
        }
      </Typography.Paragraph>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Typography.Text>
                {"Woo-hoo, you're reading this text in a modal!"}
              </Typography.Text>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
