import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, InputNumber, Pagination, message } from 'antd';
import { fetchAllPlans, addPlan, updatePlan, removePlan } from '../Store/Slices/PlansSlice'; // Import actions

const PlanManagement = () => {
  const dispatch = useDispatch();
  const { plans, status, error } = useSelector((state) => state.Plans);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllPlans());
    }
  }, [dispatch, status]);

  const handleAddPlan = (values) => {
    dispatch(addPlan(values));
    form.resetFields();
    message.success('Plan added successfully');
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setIsModalVisible(true);
    form.setFieldsValue(plan);
  };

  const handleUpdatePlan = (values) => {
    dispatch(updatePlan({ id: editingPlan._id, updatedPlan: values }));
    setIsModalVisible(false);
    message.success('Plan updated successfully');
  };

  const handleRemovePlan = (id) => {
    dispatch(removePlan(id));
    message.success('Plan removed successfully');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTableChange = (page) => {
    setCurrentPage(page);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Plan Name',
      dataIndex: 'planName',
      key: 'planName',
      className: 'text-center',
    },
    {
      title: 'Duration (months)',
      dataIndex: 'planDuration',
      key: 'planDuration',
      className: 'text-center',
    },
    {
      title: 'Price (₹)',
      dataIndex: 'planPrice',
      key: 'planPrice',
      className: 'text-center',
    },
    {
      title: 'Description',
      dataIndex: 'planDescription',
      key: 'planDescription',
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
            onClick={() => handleEditPlan(record)}
            className="mr-2"
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000' }}
          >
            Edit
          </Button>
          {/* <Button type="danger" onClick={() => handleRemovePlan(record._id)} style={{ backgroundColor: '#FF5733', color: '#fff' }}>
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  // Pagination logic to display 10 plans per page
  const paginatedPlans = plans.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Plan Management</h2>

      {/* Add Plan Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8" style={{ maxWidth: '80%', margin: 'auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPlan}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Form.Item
            name="planName"
            label="Plan Name"
            rules={[{ required: true, message: 'Please enter the plan name!' }]}
          >
            <Input placeholder="Enter plan name" style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item
            name="planDuration"
            label="Duration (months)"
            rules={[{ required: true, message: 'Please enter the duration!' }]}
          >
            <InputNumber min={1} placeholder="Enter duration" style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item
            name="planPrice"
            label="Price (₹)"
            rules={[{ required: true, message: 'Please enter the price!' }]}
          >
            <InputNumber min={1} placeholder="Enter price" style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item
            name="planDescription"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input placeholder="Enter plan description" style={{ borderColor: '#FFD700', color: '#000' }} />
          </Form.Item>
          <Form.Item className="flex items-center">
            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000' }}>
              Add Plan
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Plan Table */}
      <Table
        dataSource={paginatedPlans}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={false}
        bordered
        style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}
        className="text-center"
      />

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={plans.length}
        onChange={handleTableChange}
        className="mt-4 text-center"
        style={{ color: '#FFD700' }}
      />

      {/* Edit Plan Modal */}
      <Modal
        title="Edit Plan"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{ borderRadius: '10px', padding: '20px' }} // Improve the modal appearance
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingPlan}
          onFinish={handleUpdatePlan}
        >
          <Form.Item
            name="planName"
            label="Plan Name"
            rules={[{ required: true, message: 'Please enter the plan name!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', padding: '10px' }} />
          </Form.Item>
          <Form.Item
            name="planDuration"
            label="Duration (months)"
            rules={[{ required: true, message: 'Please enter the duration!' }]}
          >
            <InputNumber min={1} style={{ borderColor: '#FFD700', color: '#000', width: '100%', padding: '10px' }} />
          </Form.Item>
          <Form.Item
            name="planPrice"
            label="Price (₹)"
            rules={[{ required: true, message: 'Please enter the price!' }]}
          >
            <InputNumber min={1} style={{ borderColor: '#FFD700', color: '#000', width: '100%', padding: '10px' }} />
          </Form.Item>
          <Form.Item
            name="planDescription"
            label="Description"
            rules={[{ required: true, message: 'Please enter the description!' }]}
          >
            <Input style={{ borderColor: '#FFD700', color: '#000', padding: '10px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000' }}>
              Update Plan
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PlanManagement;
