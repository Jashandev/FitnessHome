import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser, changePassword } from '../Store/Slices/UserSlice';
import { Table, Button, Modal, Form, Input, DatePicker, message, InputNumber } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.User);
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
      // Dispatch action to add user
      dispatch(addUser(values));
      message.success('User added successfully');
    } else {
      // Dispatch action to update user
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
        // Assuming you have a plan object to fetch plan name
        return record.plan ? record.plan.planName : 'No Plan';
      },
    },
    {
      title: 'Trainer',
      key: 'trainer',
      className: 'text-center',
      render: (text, record) => {
        // Assuming record contains trainer details
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
        <div className="flex justify-center">
          <Button
            type="primary"
            onClick={() => handleUpdateUser(record)}
            className="mr-2"
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
          >
            Update
          </Button>
          <Button type="danger" onClick={() => handleRemoveUser(record._id)} style={{ backgroundColor: '#FF5733', color: '#fff', borderRadius: '8px' }}>
            Remove
          </Button>
          <Button type="default" onClick={() => handleChangePassword(record._id)} style={{ borderRadius: '8px' }}>
            Change Password
          </Button>
          <Button type="default" onClick={() => handleViewAttendance(record._id)} style={{ borderRadius: '8px', marginLeft: '8px' }}>
            View Attendance
          </Button>
          <Button type="default" onClick={() => handleAttendance(record._id)} style={{ borderRadius: '8px', marginLeft: '8px' }}>
            Mark Attendance
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>User Management</h2>

        {/* Add User Button */}
        <div className="text-right mb-4">
          <Button
            type="primary"
            onClick={handleAddUser}
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
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
          style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}
          className="text-center"
        />
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        title={isAddingUser ? 'Add User' : 'Edit User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ borderRadius: '10px', padding: '20px' }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="User Name"
            rules={[{ required: true, message: 'Please enter the user name!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter the address!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter the city!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ type: 'number', min:1000000000 , required: true, message: 'Please enter the phone number!' },]}
          >
            <InputNumber style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} maxLength={10} />
          </Form.Item>
        
          <Form.Item
            name="bloodGroup"
            label="Blood Group"
            rules={[{ required: true, message: 'Please enter the blood group!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: '100%', padding: '10px', borderColor: '#FFD700', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password">
            <Input.Password style={{ borderColor: '#FFD700', color: '#000', borderRadius: '8px' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#FFD700', color: '#000', borderRadius: '8px', width: '100%' }}
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
