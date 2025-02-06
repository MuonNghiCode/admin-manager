import React from "react";
import { Modal, Button } from "antd";
import { Post } from "../../models/Post";

interface ModalViewPostProps {
  post: Post | null;
  visible: boolean;
  onClose: () => void;
}

const ModalViewPost: React.FC<ModalViewPostProps> = ({
  post,
  visible,
  onClose,
}) => {
  if (!post) return null;

  return (
    <Modal
      title="View Post"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <h2>{post.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: post.description }} />
      <p>Status: {post.status ? "Active" : "Inactive"}</p>
      <p>Create Date: {new Date(post.createDate).toLocaleDateString()}</p>
      <p>Update Date: {new Date(post.updateDate).toLocaleDateString()}</p>
    </Modal>
  );
};

export default ModalViewPost;
