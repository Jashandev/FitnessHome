import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser, changePassword } from '../Store/Slices/UserSlice';
import { Table, Button, Modal, Form, Input, DatePicker, message, InputNumber } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status } = useSelector((state) => state.User);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const handleAddUser = () => {
    setIsAddingUser(true);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleUpdateUser = (user) => {
    setEditingUser(user);
    setIsAddingUser(false);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...user,
      dob: user.dob ? moment(user.dob) : null,
    });
  };

  const handleRemoveUser = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this user?',
      onOk: async () => {
        try {
          await dispatch(deleteUser(id));
          message.success('User removed successfully');
        } catch (error) {
          message.error('Failed to remove user');
        }
      },
    });
  };

  const handleChangePassword = (id) => {
    Modal.confirm({
      title: 'Change Password',
      content: (
        <Input.Password
          placeholder="Enter new password"
          onChange={(e) => {
            const password = e.target.value;
            dispatch(changePassword({ id, passwordData: { password } }));
          }}
        />
      ),
      onOk: () => message.success('Password changed successfully'),
    });
  };

  const handleViewAttendance = (id) => {
    navigate(`/Dashboard/ViewAttendance/${id}`);
  };

  const handleAttendance = (id) => {
    navigate(`/Dashboard/Attendance/${id}`);
  };

  const handleFormSubmit = async (values) => {
    if (values.password && values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    if (isAddingUser) {
      dispatch(addUser(values));
      message.success('User added successfully');
    } else {
      dispatch(updateUser({ id: editingUser._id, userData: values }));
      message.success('User updated successfully');
    }

    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'text-center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'text-center',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      className: 'text-center',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      className: 'text-center',
    },
    {
      title: 'Plan',
      key: 'plan',
      className: 'text-center',
      render: (text, record) => {
        return record.plan ? record.plan.planName : 'No Plan';
      },
    },
    {
      title: 'Trainer',
      key: 'trainer',
      className: 'text-center',
      render: (text, record) => {
        return record.trainer ? record.trainer.name : 'No Trainer';
      },
    },
    {
      title: 'Due Date',
      key: 'dueDate',
      className: 'text-center',
      render: (text, record) => {
        return record.Invoice && record.Invoice.dueDate
          ? moment(record.Invoice.dueDate).format('YYYY-MM-DD')
          : 'No Due Date';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-center',
      render: (text, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            type="primary"
            onClick={() => handleUpdateUser(record)}
            className="bg-yellow-300 text-black rounded-md"
          >
            Update
          </Button>
          <Button type="danger" onClick={() => handleRemoveUser(record._id)} className="bg-red-500 text-white rounded-md">
            Remove
          </Button>
          <Button type="default" onClick={() => handleChangePassword(record._id)} className="rounded-md">
            Change Password
          </Button>
          <Button type="default" onClick={() => handleViewAttendance(record._id)} className="rounded-md">
            View Attendance
          </Button>
          <Button type="default" onClick={() => handleAttendance(record._id)} className="rounded-md">
            Mark Attendance
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-green-900 text-yellow-500">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>

        {/* Add User Button */}
        <div className="text-right mb-4">
          <Button
            type="primary"
            onClick={handleAddUser}
            className="bg-yellow-300 text-black rounded-md"
          >
            Add User
          </Button>
        </div>

        {/* User Table */}
        <Table
          columns={columns}
          dataSource={users}
          loading={status === 'loading'}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: '100%' }} // Enables horizontal scrolling for smaller screens
          className="bg-white rounded-lg mt-4"
        />
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        title={isAddingUser ? 'Add User' : 'Edit User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="rounded-lg"
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="User Name"
            rules={[{ required: true, message: 'Please enter the user name!' }]}
          >
            <Input className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email!' }]}
          >
            <Input className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter the address!' }]}
          >
            <Input className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter the city!' }]}
          >
            <Input className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ type: 'number', min: 1000000000, required: true, message: 'Please enter a valid phone number!' }]}
          >
            <InputNumber className="border-yellow-500 rounded-md text-black w-full" />
          </Form.Item>
          <Form.Item
            name="bloodGroup"
            label="Blood Group"
            rules={[{ required: true, message: 'Please enter the blood group!' }]}
          >
            <Input className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker className="w-full border-yellow-500 rounded-md" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password">
            <Input.Password className="border-yellow-500 rounded-md text-black" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-yellow-300 text-black rounded-md w-full"
            >
              {isAddingUser ? 'Add User' : 'Update User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
