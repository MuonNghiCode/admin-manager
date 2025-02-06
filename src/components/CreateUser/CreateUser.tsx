import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { User } from "../../models/User";
import { addUser, updateUser } from "../../service/userApi";

interface CreateUserProps {
  user?: User | null;
  onClose: () => void;
  isUpdateMode: boolean;
  refreshUsers: () => void;
}

const CreateUser: React.FC<CreateUserProps> = ({
  user,
  onClose,
  isUpdateMode,
  refreshUsers,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user && isUpdateMode) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        password: user.password,
        createDate: user.createDate.toString(),
        updateDate: new Date(Date.now()).toISOString().split("T")[0],
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        createDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [user, isUpdateMode, form]);

  const onFinish = async (values: User) => {
    try {
      if (isUpdateMode && user) {
        await updateUser(user.userId, values);
        message.success("User updated successfully!");
      } else {
        let userData = {
          ...values,
          updateDate: new Date(Date.now()), // Ensure updateDate is not set for new users
        };
        await addUser(userData);
        message.success("User created successfully!");
        form.resetFields();
        form.setFieldsValue({
          createDate: new Date().toISOString().split("T")[0],
        });
      }
      refreshUsers();
      onClose();
    } catch (error) {
      message.error("Failed to save user");
      console.error("Failed to save user", error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please input the email!" }]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input the password!" }]}
      >
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="createDate"
        label="Create Date"
        rules={[{ required: true, message: "Please input the create date!" }]}
      >
        <Input type="date" readOnly />
      </Form.Item>
      {isUpdateMode && (
        <Form.Item
          name="updateDate"
          label="Update Date"
          rules={[{ required: true, message: "Please input the update date!" }]}
        >
          <Input type="date" readOnly />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isUpdateMode ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUser;
