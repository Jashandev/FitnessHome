import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Button, Checkbox, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginUser } from '../Store/Slices/AuthSlice';
import Cookies from 'js-cookie';
import { useNotificationApi } from '../Providers/NotificationProvider';
import logo from '../assets/logo.png'; // Importing the logo

function Login(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notify = useNotificationApi();

    useEffect(() => {
        if (Cookies.get('token')) {
            navigate('/Dashboard');
        }
    }, [navigate]);

    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState('optional');
    const onRequiredTypeChange = ({ requiredMarkValue }) => {
        setRequiredMarkType(requiredMarkValue);
    };

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: '${label} is required!',
        types: {
            number: 'Please enter valid number!',
        },
        number: {
            min: 'Please enter valid ${label}!',
        },
    };

    const onLoginFinish = async (values) => {
        const resultAction = await dispatch(loginUser({ bool: true, values }));
        if (loginUser.fulfilled.match(resultAction)) {
            const { error, msg, token, user } = resultAction.payload;
            notify(error ? 'error' : 'success', error ? 'Login Error' : 'Login Successful', msg, 'bottomLeft');
            if (!error) {
                // Set the cookies for token, userId, and userType
                Cookies.set('token', token, { expires: 7 });
                Cookies.set('id', user._id, { expires: 7 });
                Cookies.set('userType', user.userType, { expires: 7 });
                Cookies.set('userName', user.name, { expires: 7 });

                // Redirect to dashboard and force reload
                navigate('/Dashboard');
                window.location.reload(); // Force reload the page to refresh the data
            }
        }
    };

    const onLoginFinishFailed = async (values) => {
        const resultAction = await dispatch(loginUser({ bool: false, values }));
        if (loginUser.fulfilled.match(resultAction)) {
            const { error, msg } = resultAction.payload;
            notify(error ? 'error' : 'success', error ? 'Login Error' : 'Login Successful', msg, 'bottomLeft');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen" style={{ backgroundColor: '#1D3D24' }}>
            {/* Logo Section */}
            <img src={logo} alt="Fitness Home Logo" className="mb-6" style={{ width: '150px' }} />

            <Form className='w-68 h-68 overflow-hidden p-6 text-white'
                form={form}
                layout="vertical"
                initialValues={{ requiredMarkValue: requiredMark, remember: true }}
                onValuesChange={onRequiredTypeChange}
                requiredMark={requiredMark}
                onFinish={onLoginFinish}
                onFinishFailed={onLoginFinishFailed}
                autoComplete="off"
                validateMessages={validateMessages}
            >
                {/* E-mail Input */}
                <Form.Item
                    label={<span style={{ color: '#FFFFFF' }}>E-mail</span>}
                    name="Email"
                    tooltip="Enter your Email"
                    labelColor="rgb(230 244 255)"
                    rules={[{ required: true, type: 'email', message: 'Please enter your E-mail!' }]}
                >
                    <Input
                        placeholder="Enter Your E-mail"
                        type='string'
                        style={{ color: '#000000', borderColor: '#FFD700' }} // Input and border styling
                    />
                </Form.Item>

                {/* Password Input */}
                <Form.Item
                    label={<span style={{ color: '#FFFFFF' }}>Password</span>}
                    name="Password"
                    required
                    tooltip={{ title: 'Secure password', icon: <InfoCircleOutlined /> }}
                    rules={[{ required: true, message: 'Please select your Password!' }]}
                >
                    <Input.Password
                        placeholder="Enter Your Password"
                        style={{ color: '#000000', borderColor: '#FFD700' }}  // Input and border styling
                    />
                </Form.Item>

                {/* Remember Me Checkbox */}
                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox style={{ color: '#ffffff' }}>Remember me</Checkbox>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='h-8 w-full text-black' style={{ backgroundColor: 'rgb(221, 201, 122)' }}>
                        Login
                    </Button>
                </Form.Item>
            </Form>

            {/* Forgot Password Link */}
            <div className="cursor-pointer">
                <span className='mt-6 mb-2'><Link to={'/ForgotPwd'} className='h-8 w-full text-yellow-300'>Forgot Password</Link></span>
            </div>
        </div>
    );
}

export default Login;
