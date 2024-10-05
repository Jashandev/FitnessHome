import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { fetchUsersByEmail, fetchPlans, assignPlan } from '../Store/Slices/AssignPlan';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Option } = Select;

const AssignPlan = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchPlans()).then((response) => setPlans(response.payload));
    dispatch(fetchUsersByEmail(null)).then((response) => setUsers(response.payload));
  }, [dispatch]);

  const handleEmailSearch = (email) => {
    dispatch(fetchUsersByEmail(email || null)).then((response) => setUsers(response.payload));
  };
  
  const handlePlanChange = (value) => {
    const selected = plans.find((p) => p._id === value);
    setSelectedPlan(selected);
    setFinalAmount(selected.planPrice - discount);
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    if (selectedPlan) {
      setFinalAmount(selectedPlan.planPrice - value);
    }
  };

  const handleAssignPlan = async () => {
    if (!selectedUser || !selectedPlan) {
      message.error('Please select both a user and a plan');
      return;
    }

    const currentDate = new Date();

    if (!selectedUser.Invoice || !selectedUser.Invoice.dueDate) {
      // Allow process if Invoice is not found or dueDate is not set
      console.log('No invoice or dueDate found, allowing the process.');
    } else {
      const dueDate = new Date(selectedUser.Invoice.dueDate); // Parse the dueDate from the Invoice
      if (dueDate > currentDate) {
        message.error('This user already has an active plan.');
        return;
      } else {
        // If the dueDate is less than or equal to the current date, allow access
        console.log('Invoice due date is in the past or today, allowing the process.');
      }
    }

    const response = await dispatch(
      assignPlan({
        userId: selectedUser._id,
        planId: selectedPlan._id,
        discount,
      })
    );

    if (response.payload && response.payload.message === 'Plan assigned/changed successfully') {
      const invoice = response.payload.invoice;
      
      // Generate PDF invoice
      const doc = new jsPDF();
      doc.text(`Invoice for ${selectedPlan.planName}`, 10, 10);
      doc.autoTable({
        head: [['Item', 'Price']],
        body: [
          [selectedPlan.planName, `₹${selectedPlan.planPrice}`],
          ['Discount', `₹${invoice.discount}`],
          ['Total', `₹${invoice.finalAmount}`],
        ],
      });
      doc.save('invoice.pdf');
  
      message.success('Plan assigned and invoice generated successfully');
    } else {
      message.error('Failed to assign plan');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Assign Plan</h2>

        <Form
          layout="vertical"
          className="max-w-lg mx-auto"
          style={{ backgroundColor: '#1d3d24', padding: '20px', borderRadius: '10px', border: '1px solid #FFD700' }}
        >
          <Form.Item label={<span style={{ color: '#FFD700' }}>Search User by Email</span>}>
            <Input.Search placeholder="Enter user email" onSearch={handleEmailSearch} style={{ borderColor: '#FFD700', borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: '#FFD700' }}>Select User</span>}>
            <Select onChange={(value) => setSelectedUser(users.find((u) => u._id === value))} style={{ borderColor: '#FFD700', borderRadius: '8px' }}>
              {users?.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={<span style={{ color: '#FFD700' }}>Select Plan</span>}>
            <Select onChange={handlePlanChange} style={{ borderColor: '#FFD700', borderRadius: '8px' }}>
              {plans?.map((plan) => (
                <Option key={plan._id} value={plan._id}>
                  {`${plan.planName}; Duration: ${plan.planDuration} month(s)`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedPlan && (
            <>
              <Form.Item label={<span style={{ color: '#FFD700' }}>Plan Price</span>}>
                <Input 
                  value={`₹${selectedPlan.planPrice}`} 
                  disabled 
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Discount</span>}>
                <InputNumber min={0} value={discount} onChange={handleDiscountChange} style={{ borderColor: '#FFD700', borderRadius: '8px', width: '100%' }} />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Net Price</span>}>
                <Input 
                  value={`₹${finalAmount}`} 
                  disabled 
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
                />
              </Form.Item>
            </>
          )}

          <Button
            type="primary"
            onClick={handleAssignPlan}
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
          >
            Assign Plan
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AssignPlan;
