import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select } from "antd";
import { Post } from "../../models/Post";
import { createPost, updatePost } from "../../service/postApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface CreatePostProps {
  post?: Post | null;
  onClose: () => void;
  isUpdateMode: boolean;
  refreshPosts: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({
  post,
  onClose,
  isUpdateMode,
  refreshPosts,
}) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(post?.description || "");
  const quillRef = useRef(null);
  const [status, setStatus] = useState(true); // New state for status

  const handleStatusChange = (value: string) => {
    setStatus(value === "Active");
  };

  useEffect(() => {
    if (post && isUpdateMode) {
      form.setFieldsValue({
        title: post.title,
        createDate: post.createDate.toString(),
        description: post.description,
        updateDate: new Date(Date.now()).toISOString().split("T")[0],
      });
      setContent(post.description);
    } else {
      form.resetFields();
      form.setFieldsValue({
        createDate: new Date(Date.now()).toISOString().split("T")[0],
      });
      setContent("");
    }
  }, [post, isUpdateMode, form]);

  const handlePostChange = (value: string) => {
    setContent(value);
  };

  const onFinish = async (values: Post) => {
    try {
      const postData = { ...values, description: content, status: status };
      if (isUpdateMode && post) {
        await updatePost(post.id, postData);
      } else {
        let postData = {
          ...values,
          description: content,
          userId: localStorage.getItem("userId") || "1",
          id: Date.now().toString(),
          updateDate: new Date(Date.now()),
          status: status,
        };

        console.log(postData);
        await createPost(postData);
        form.resetFields();
        setContent("");
      }
      refreshPosts();
      onClose();
    } catch (error) {
      console.error("Failed to save post", error);
    }
  };

  const toolbarOptions = [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ];

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="createDate"
        label="Create Date"
        rules={[{ required: true, message: "Please input the create date!" }]}
      >
        <Input type="date" readOnly />
      </Form.Item>
      <Form.Item label="Status" name="status">
        <Select
          value={status ? "Active" : "Inactive"}
          onChange={handleStatusChange}
        >
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Description">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handlePostChange}
          modules={{ toolbar: toolbarOptions }}
          style={{
            width: "100%",
            height: "100%",
            marginBottom: "1rem",
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isUpdateMode ? "Update" : "Create"}
        </Button>
      </Form.Item>
      {isUpdateMode && (
        <Form.Item
          name="updateDate"
          label="Update Date"
          rules={[{ required: true, message: "Please input the create date!" }]}
        >
          <Input type="date" readOnly />
        </Form.Item>
      )}
    </Form>
  );
};

export default CreatePost;
