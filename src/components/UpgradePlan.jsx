import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { fetchUsersByEmail, fetchPlans, upgradePlan, fetchLastInvoiceByUserId } from '../Store/Slices/UpgradePlan';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { useNotificationApi } from '../Providers/NotificationProvider';

const { Option } = Select;

const UpgradePlan = () => {
  const dispatch = useDispatch();
  const notify = useNotificationApi(); // Notification API

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [existingPlanValue, setExistingPlanValue] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [dueDate, setDueDate] = useState(null); // Store the due date from the last invoice

  useEffect(() => {
    dispatch(fetchPlans()).then((response) => setPlans(response.payload));
  }, [dispatch]);

  const handleEmailSearch = (email) => {
    dispatch(fetchUsersByEmail(email || null)).then((response) => setUsers(response.payload));
  };  

  const handleUserSelect = (value) => {
    const user = users.find((u) => u._id === value);
    setSelectedUser(user);

    if (user && user.plan) {
      // Fetch the last invoice to get the due date
      dispatch(fetchLastInvoiceByUserId(user.Invoice._id)).then((response) => {
        if (!response.payload) {
          // Notify the user if no invoice is found
          notify('error', 'No Plan Found', 'User has no active plan. Redirecting to Assign Plan...', 'bottomLeft');
          
          // Redirect user to Assign Plan page after 3 seconds
          setTimeout(() => {
            window.location.href = '/Dashboard/AssignPlan';
          }, 3000);
          return;
        }

        const invoice = response.payload;
        setDueDate(invoice.dueDate); // Set the due date from the invoice

        const currentDate = dayjs();
        const daysLeft = dayjs(invoice.dueDate).diff(currentDate, 'day'); // Calculate days left
        setDaysLeft(daysLeft);

        // Now calculate the existing plan value based on the days left
        const planDetails = plans.find((plan) => plan._id === user.plan._id);
        const fullDurationInDays = planDetails.planDuration * 30; // Assuming 30 days per month
        const existingPlanValue = (planDetails.planPrice / fullDurationInDays) * (fullDurationInDays - daysLeft);
        if (fullDurationInDays <  daysLeft) {
          setExistingPlanValue(0);      
        } else setExistingPlanValue(existingPlanValue);
        

        // Calculate discount as a percentage of days left
        const percentageDaysLeft = ( daysLeft / fullDurationInDays) * 100;
        const discountAmount = (planDetails.planPrice * percentageDaysLeft) / 100;
        if (fullDurationInDays <  daysLeft) {
          setDiscount(planDetails.planPrice);    
        } else  setDiscount(discountAmount);
       
      });
    }
  };

  const handlePlanChange = (value) => {
    const selected = plans.find((p) => p._id === value);
    setSelectedPlan(selected);
    setFinalAmount(selected.planPrice - discount);
  };

  const handleUpgradePlan = async () => {
    if (!selectedUser || !selectedPlan) {
      message.error('Please select both a user and a plan');
      return;
    }

    const response = await dispatch(
      upgradePlan({
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
          ['Existing Plan Deduction', `₹${existingPlanValue}`],
          ['Total', `₹${invoice.finalAmount}`],
        ],
      });
      doc.save('invoice.pdf');

      // Notify the user of success
      notify('success', 'Plan Upgraded', 'Plan upgraded and invoice generated successfully', 'bottomLeft');
    } else {
      // Notify the user of failure
      notify('error', 'Upgrade Failed', 'Failed to upgrade plan', 'bottomLeft');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Upgrade Plan</h2>

        <Form
          layout="vertical"
          className="max-w-lg mx-auto"
          style={{ backgroundColor: '#1d3d24', padding: '20px', borderRadius: '10px', border: '1px solid #FFD700' }}
        >
          <Form.Item label={<span style={{ color: '#FFD700' }}>Search User by Email</span>}>
            <Input.Search placeholder="Enter user email" onSearch={handleEmailSearch} style={{ borderColor: '#FFD700', borderRadius: '8px' }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: '#FFD700' }}>Select User</span>}>
            <Select onChange={handleUserSelect} style={{ borderColor: '#FFD700', borderRadius: '8px' }}>
              {users?.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedUser && selectedUser.plan && (
            <>
              <Form.Item label={<span style={{ color: '#FFD700' }}>Existing Plan</span>}>
                <Input
                  value={`${selectedUser.plan.planName || 'N/A'} 
                  (₹${selectedUser.plan.planPrice || 'N/A'})`}
                  disabled
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }}
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Days Left in Current Plan</span>}>
                <Input 
                  value={`${daysLeft} days`} 
                  disabled 
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Due Date</span>}>
                <Input 
                  value={`${dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : 'N/A'}`} 
                  disabled 
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Select New Plan</span>}>
                <Select onChange={handlePlanChange} style={{ borderColor: '#FFD700', borderRadius: '8px' }}>
                  {plans
                    ?.filter((plan) => plan._id !== selectedUser.plan._id)
                    .map((plan) => (
                      <Option key={plan._id} value={plan._id}>
                        {`${plan.planName}; Duration: ${plan.planDuration} month(s)`}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </>
          )}

          {selectedPlan && (
            <>
              <Form.Item label={<span style={{ color: '#FFD700' }}>New Plan Price</span>}>
                <Input 
                  value={`₹${selectedPlan.planPrice}`} 
                  disabled 
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Existing Plan Deduction</span>}>
                <Input 
                  value={`₹${existingPlanValue}`} 
                  disabled 
                  style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#FFD700' }}>Discount (Automatically Calculated)</span>}>
                <InputNumber min={0} value={discount} disabled style={{ borderColor: '#FFD700',backgroundColor: '#ffff99', borderRadius: '8px', width: '100%', color: '#000' }} />
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
            onClick={handleUpgradePlan}
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
          >
            Upgrade Plan
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UpgradePlan;
