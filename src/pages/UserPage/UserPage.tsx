import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { User } from "../../models/User";
import { deleteUser, getUsers } from "../../service/userApi";
import CreateUser from "../../components/CreateUser/CreateUser";
import ModalViewUser from "../../components/ModalViewUser/ModalViewUser";
import DeleteUser from "../../components/DeleteUser/DeleteUSer";
import { Plus, Eye, Trash2, FilePenLine } from "lucide-react";
import "./UserPage.scss";
const UserPage: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateOrUpdateModalVisible, setIsCreateOrUpdateModalVisible] =
    useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUserList(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalVisible(true);
  };

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setIsUpdateMode(true);
    setIsCreateOrUpdateModalVisible(true);
  };

  const handleCloseCreateOrUpdateModal = () => {
    setIsCreateOrUpdateModalVisible(false);
    setSelectedUser(null);
    setIsUpdateMode(false);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUser(user.userId);
      setRefreshTrigger(!refreshTrigger);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setSelectedUser(null);
  };

  const showDeleteConfirm = (user: User) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this user?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => handleDeleteUser(user),
    });
  };

  const handleRefreshUsers = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "userId",
    //   key: "userId",
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Create Date",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Update Date",
      dataIndex: "updateDate",
      key: "updateDate",
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button type="link" onClick={() => handleViewUser(record)}>
            <Eye />
          </Button>
          <Button type="primary" onClick={() => handleUpdateUser(record)}>
            <FilePenLine />
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => showDeleteConfirm(record)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="user-list">
      <div className="user-header">
        <h2>User Management</h2>
        <Button
          type="primary"
          onClick={() => setIsCreateOrUpdateModalVisible(true)}
        >
          <Plus />
          Add User
        </Button>
      </div>

      <Table<User>
        columns={columns}
        dataSource={userList.map((user) => ({ ...user, key: user.userId }))}
        pagination={{ pageSize: 10 }}
      />
      <ModalViewUser
        user={selectedUser}
        visible={isViewModalVisible}
        onClose={handleCloseViewModal}
      />
      <Modal
        title={isUpdateMode ? "Update User" : "Create a New User"}
        open={isCreateOrUpdateModalVisible}
        onCancel={handleCloseCreateOrUpdateModal}
        footer={null}
      >
        <CreateUser
          user={selectedUser}
          onClose={handleCloseCreateOrUpdateModal}
          isUpdateMode={isUpdateMode}
          refreshUsers={handleRefreshUsers}
        />
      </Modal>
      <DeleteUser
        user={selectedUser}
        onDelete={handleDeleteUser}
        isVisible={isDeleteModalVisible}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
};

export default UserPage;
