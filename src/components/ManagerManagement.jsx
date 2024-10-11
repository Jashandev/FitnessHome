import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllManagers, addManager, updateManager, removeManager } from '../Store/Slices/ManagerSlice'; // Import manager actions
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // For handling date fields

const ManagerManagement = () => {
  const dispatch = useDispatch();
  const { managers, status } = useSelector((state) => state.Managers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllManagers());
    }
  }, [dispatch, status]);

  const handleAddManager = () => {
    setIsAddingManager(true);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleUpdateManager = (manager) => {
    setEditingManager(manager);
    setIsAddingManager(false);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...manager,
      dob: manager.dob ? moment(manager.dob) : null, // Pre-fill date of birth if available
    });
  };

  const handleRemoveManager = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this manager?',
      onOk: async () => {
        try {
          await dispatch(removeManager(id));
          message.success('Manager removed successfully');
        } catch (error) {
          message.error('Failed to remove manager');
        }
      },
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

    if (isAddingManager) {
      dispatch(addManager(values));
      message.success('Manager added successfully');
    } else {
      dispatch(updateManager({ id: editingManager._id, updatedManager: values }));
      message.success('Manager updated successfully');
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
      title: 'Actions',
      key: 'actions',
      className: 'text-center',
      render: (text, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            type="primary"
            onClick={() => handleUpdateManager(record)}
            className="bg-yellow-300 text-black"
          >
            Update
          </Button>
          <Button type="danger" onClick={() => handleRemoveManager(record._id)} className="bg-red-500 text-white">
            Remove
          </Button>
          <Button type="default" onClick={() => handleViewAttendance(record._id)}>
            View Attendance
          </Button>
          <Button type="default" onClick={() => handleAttendance(record._id)}>
            Mark Attendance
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-green-900 text-yellow-500">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Manager Management</h2>

        {/* Add Manager Button */}
        <div className="text-right mb-4">
          <Button
            type="primary"
            onClick={handleAddManager}
            className="bg-yellow-300 text-black"
          >
            Add Manager
          </Button>
        </div>

        {/* Manager Table */}
        <Table
          columns={columns}
          dataSource={managers}
          loading={status === 'loading'}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: '100%' }} // Enable horizontal scrolling for the table on mobile
          className="bg-white rounded-lg overflow-hidden mt-4"
        />
      </div>

      {/* Add/Edit Manager Modal */}
      <Modal
        title={isAddingManager ? "Add Manager" : "Edit Manager"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="name"
            label="Manager Name"
            rules={[{ required: true, message: 'Please enter the manager name!' }]}
          >
            <Input className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email!' }]}
          >
            <Input className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter the city!' }]}
          >
            <Input className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter the phone number!' }]}
          >
            <Input className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: '100%', padding: '10px', borderColor: '#FFD700' }} />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password">
            <Input.Password className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-yellow-300 text-black">
              {isAddingManager ? 'Add Manager' : 'Update Manager'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManagerManagement;
