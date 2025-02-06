import React from "react";
import { Modal } from "antd";
import { Post } from "../../models/Post";

interface DeletePostProps {
  post?: Post | null;
  onDelete: (post: Post) => void;
  isVisible: boolean;
  onClose: () => void;
}

const DeletePost: React.FC<DeletePostProps> = ({
  post,
  onDelete,
  isVisible,
  onClose,
}) => {
  const handleDelete = async () => {
    if (post) {
      await onDelete(post); // Ensure this function deletes the post
      onClose();
    }
  };

  return (
    <Modal
      title="Delete Post"
      open={isVisible}
      onOk={handleDelete}
      onCancel={onClose}
      okText="Delete"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete this post?</p>
    </Modal>
  );
};

export default DeletePost;
