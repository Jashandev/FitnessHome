import React, { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Button, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../Store/Slices/AuthSlice'; // You'll need to implement this action in AuthSlice
import { useNotificationApi } from '../Providers/NotificationProvider';
import logo from '../assets/logo.png'; // Importing the logo

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotificationApi();

  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('optional');
  const onRequiredTypeChange = ({ requiredMarkValue }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: 'Not a valid email!',
    },
  };

  const onForgotPasswordFinish = async (values) => {
    const resultAction = await dispatch(forgotPassword({ email: values.Email }));
    if (forgotPassword.fulfilled.match(resultAction)) {
      const { error, msg } = resultAction.payload;
      notify(error ? 'error' : 'success', error ? 'Request Failed' : 'Email Sent', msg, 'bottomLeft');
      if (!error) {
        navigate('/login');
      }
    }
  };

  const onForgotPasswordFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    notify('error', 'Request Failed', 'Please enter a valid email address.', 'bottomLeft');
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen" style={{ backgroundColor: '#1D3D24' }}>
      {/* Logo Section */}
      <img src={logo} alt="Fitness Home Logo" className="mb-6" style={{ width: '150px' }} />

      {/* Form Section */}
      <Form
        className='w-full max-w-sm p-6'
        form={form}
        layout="vertical"
        initialValues={{ requiredMarkValue: requiredMark }}
        onValuesChange={onRequiredTypeChange}
        requiredMark={requiredMark}
        onFinish={onForgotPasswordFinish}
        onFinishFailed={onForgotPasswordFinishFailed}
        autoComplete="off"
        validateMessages={validateMessages}
      >
        {/* E-mail Input */}
        <Form.Item
          label={<span style={{ color: '#FFFFFF' }}>E-mail</span>}
          name="Email"
          tooltip={{ title: 'Enter your Email', icon: <InfoCircleOutlined /> }}
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter a valid email!',
            },
          ]}
        >
          <Input 
            placeholder="Enter Your E-mail" 
            type='string' 
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className='h-10 w-full text-black' style={{ backgroundColor: 'rgb(221, 201, 122)' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      {/* Back to Login Link */}
      <div className="cursor-pointer">
        <Link to={'/login'} className='text-blue-600' style={{ color: '#FFD700' }}>Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
