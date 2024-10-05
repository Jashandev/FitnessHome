var Host = import.meta.env.VITE_BACKEND_URL;
import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Spin, Alert } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        
        // Make an API call with token in headers (without Bearer)
        const response = await axios.get(`${Host}/api/authication`, {
          headers: {
            'token': Cookies.get('token'),  // Send token as 'token' header
          },
        });

        setUser(response.data.user);  // Assuming the response returns an array with the logged-in user data
        setLoading(false);
      } catch (error) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Spin size="large" /></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><Alert message={error} type="error" /></div>;
  }

  return (
    <div className="container mx-auto p-6 mb-24">
      <h1 className="text-center text-4xl font-bold mb-8 text-yellow-400">User Dashboard</h1>
      
      {/* User Information Card */}
      <Card
        title="User Information"
        className="shadow-lg rounded-lg"
        bordered={false}
        style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}
      >
        <Descriptions column={1} labelStyle={{ color: '#FFD700', fontWeight: 'bold' }}>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="City">{user.city}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Blood Group">{user.bloodGroup}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Plan Details */}
      {user.plan ? (
        <Card
          title="Plan Information"
          className="shadow-lg rounded-lg"
          bordered={false}
          style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}
        >
          <Descriptions column={1} labelStyle={{ color: '#FFD700', fontWeight: 'bold' }}>
            <Descriptions.Item label="Plan Name">{user.plan.planName}</Descriptions.Item>
            <Descriptions.Item label="Plan Price">{user.plan.planPrice}</Descriptions.Item>
            <Descriptions.Item label="Plan Duration">{user.plan.planDuration} Months</Descriptions.Item>
            <Descriptions.Item label="Plan Description">{user.plan.planDescription}</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Card className="shadow-lg rounded-lg" bordered={false} style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}>
          <p>No plan information available.</p>
        </Card>
      )}

      {/* Invoice Details */}
      {user.Invoice ? (
        <Card
          title="Invoice Information"
          className="shadow-lg rounded-lg"
          bordered={false}
          style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}
        >
          <Descriptions column={1} labelStyle={{ color: '#FFD700', fontWeight: 'bold' }}>
            <Descriptions.Item label="Amount">{user.Invoice.amount}</Descriptions.Item>
            <Descriptions.Item label="Final Amount">{user.Invoice.finalAmount}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{new Date(user.Invoice.dueDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Payment Status">{user.Invoice.status}</Descriptions.Item>
            <Descriptions.Item label="Description">{user.Invoice.description}</Descriptions.Item>
            <Descriptions.Item label="Payment Date">{new Date(user.Invoice.paymentDate).toLocaleDateString()}</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Card className="shadow-lg rounded-lg" bordered={false} style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}>
          <p>No invoice information available.</p>
        </Card>
      )}

      {/* Trainer Details */}
      {user.trainer ? (
        <Card
          title="Trainer Information"
          className="shadow-lg rounded-lg"
          bordered={false}
          style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}
        >
          <Descriptions column={1} labelStyle={{ color: '#FFD700', fontWeight: 'bold' }}>
            <Descriptions.Item label="Trainer Name">{user.trainer.name}</Descriptions.Item>
            <Descriptions.Item label="Trainer Email">{user.trainer.email}</Descriptions.Item>
            <Descriptions.Item label="Trainer Phone">{user.trainer.phone}</Descriptions.Item>
            <Descriptions.Item label="Trainer City">{user.trainer.city}</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Card className="shadow-lg rounded-lg" bordered={false} style={{ backgroundColor: '#2f4f4f', color: '#FFD700', marginBottom: '20px' }}>
          <p>No trainer information available.</p>
        </Card>
      )}
    </div>
  );
};

export default UserDetails;
