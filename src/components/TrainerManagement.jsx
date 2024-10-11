import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTrainers, addTrainer, updateTrainer, removeTrainer } from '../Store/Slices/TrainersSlice'; // Import actions
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // For handling date fields

const TrainerManagement = () => {
  const dispatch = useDispatch();
  const { trainers, status } = useSelector((state) => state.Trainers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingTrainer, setIsAddingTrainer] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllTrainers());
    }
  }, [dispatch, status]);

  const handleAddTrainer = () => {
    setIsAddingTrainer(true);
    setIsModalVisible(true);
    form.resetFields(); // Reset the form for adding a new trainer
  };

  const handleUpdateTrainer = (trainer) => {
    setEditingTrainer(trainer);
    setIsAddingTrainer(false);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...trainer,
      dob: trainer.dob ? moment(trainer.dob) : null, // Pre-fill date of birth if available
    });
  };

  const handleRemoveTrainer = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this trainer?',
      onOk: async () => {
        try {
          await dispatch(removeTrainer(id));
          message.success('Trainer removed successfully');
        } catch (error) {
          message.error('Failed to remove trainer');
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

    if (isAddingTrainer) {
      dispatch(addTrainer(values));
      message.success('Trainer added successfully');
    } else {
      dispatch(updateTrainer({ id: editingTrainer._id, updatedTrainer: values }));
      message.success('Trainer updated successfully');
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
      dataIndex: 'phone', // Assuming a phone field exists
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
            onClick={() => handleUpdateTrainer(record)}
            className="bg-yellow-300 text-black"
          >
            Update
          </Button>
          <Button type="danger" onClick={() => handleRemoveTrainer(record._id)} className="bg-red-500 text-white">
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
        <h2 className="text-3xl font-bold mb-6 text-center">Trainer Management</h2>

        {/* Add Trainer Button */}
        <div className="text-right mb-4">
          <Button
            type="primary"
            onClick={handleAddTrainer}
            className="bg-yellow-300 text-black"
          >
            Add Trainer
          </Button>
        </div>

        {/* Trainer Table */}
        <Table
          columns={columns}
          dataSource={trainers}
          loading={status === 'loading'}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: '100%' }} // Enable horizontal scroll for the table
          className="bg-white rounded-lg overflow-hidden mt-4"
        />
      </div>

      {/* Add/Edit Trainer Modal */}
      <Modal
        title={isAddingTrainer ? "Add Trainer" : "Edit Trainer"}
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
            label="Trainer Name"
            rules={[{ required: true, message: 'Please enter the trainer name!' }]}
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
            <DatePicker style={{ width: '100%', borderColor: '#FFD700' }} />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password">
            <Input.Password className="border-yellow-500 text-black" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-yellow-300 text-black">
              {isAddingTrainer ? 'Add Trainer' : 'Update Trainer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerManagement;
