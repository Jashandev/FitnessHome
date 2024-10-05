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
    form.resetFields(); // Reset the form for adding new trainer
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
      // Dispatch action to add trainer
      dispatch(addTrainer(values));
      message.success('Trainer added successfully');
    } else {
      // Dispatch action to update trainer
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
        <div className="flex justify-center">
          <Button
            type="primary"
            onClick={() => handleUpdateTrainer(record)}
            className="mr-2"
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000' }}
          >
            Update
          </Button>
          <Button type="danger" onClick={() => handleRemoveTrainer(record._id)} style={{ backgroundColor: '#FF5733', color: '#fff' }}>
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
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Trainer Management</h2>

        {/* Add Trainer Button */}
        <div className="text-right mb-4">
          <Button
            type="primary"
            onClick={handleAddTrainer}
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000' }}
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
          style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}
          className="text-center"
        />
      </div>

      {/* Add/Edit Trainer Modal */}
      <Modal
        title={isAddingTrainer ? "Add Trainer" : "Edit Trainer"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ borderRadius: '10px', padding: '20px' }} // Improve modal appearance
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
            <Input style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter the city!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter the phone number!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: '100%', padding: '10px', borderColor: '#FFD700' }} />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm Password">
            <Input.Password style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000' }}>
              {isAddingTrainer ? 'Add Trainer' : 'Update Trainer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainerManagement;
