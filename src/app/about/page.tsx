"use client";

import axios from "axios";
import React, { useState } from "react";

const Page = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log("File selected: ", event.target.files);
      setFile(event.target.files[0]);
    } else {
      console.log("No file selected");
    }
  };

  const handleUploadFile = async () => {
    if (file) {
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      const api = `http://localhost:8080/api/v1/upload`;
      try {
        const res = await axios(api, {
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        });

        if (res && res.status === 200 && res.data) {
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No file selected ");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <p>Handle Upload File</p>
      <input type="file" onChange={handleFileChange} name="" id="" />
      <button onClick={handleUploadFile}>Upload</button>
    </div>
  );
};

export default Page;
