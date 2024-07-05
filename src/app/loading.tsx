import { Skeleton } from "antd";
import React from "react";

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  return (
    <>
      <Skeleton
        active
        avatar
        paragraph={{ rows: 10 }}
        round
        title
        loading={loading}
      />
    </>
  );
};

export default Loading;
