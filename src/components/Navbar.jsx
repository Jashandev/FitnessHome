import React, { useState, useEffect } from 'react';
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout, resetPasswordWithOldPassword } from '../Store/Slices/AuthSlice';
import { useNotificationApi } from '../Providers/NotificationProvider';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies
import logo from '../assets/logo.png'; // Replace with the path to your custom logo

function Navbarcom(props) {
    const dispatch = useDispatch();
    const notify = useNotificationApi();
    let navigate = useNavigate();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [userName, setUserName] = useState(null);

    // Fetch userName from cookies
    useEffect(() => {
        const storedUserName = Cookies.get("userName"); // Retrieve userName from cookies
        console.log("Fetched userName from Cookies: ", storedUserName); // Debugging
        setUserName(storedUserName);
    }, []);

    function LogoutFn() {
        dispatch(logout());
        navigate('/login');
    }

    const toggleProfile = () => {
        props.setaside(false);
        setIsProfileOpen(!isProfileOpen);
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 1000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const validateMessages = {
        required: '${label} is required!',
        types: { email: 'Please enter valid E-mail!', number: 'Please enter valid number!' },
        number: { min: 'Please enter valid ${label}!' },
    };

    const onBookingFinish = async (values) => {
        const resultAction = await dispatch(resetPasswordWithOldPassword({ bool: true, values }));
        if (resetPasswordWithOldPassword.fulfilled.match(resultAction)) {
            const { error, msg } = resultAction.payload;
            notify(error ? 'error' : 'success', error ? 'Error occurred' : 'Password reset Successful', msg, 'bottomLeft');
        }
    };

    return (
        <>
            <nav className="border-gray-200 fixed top-0 w-screen z-20" style={{ backgroundColor: '#1D3D24' }}>
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/Dashboard" className="flex items-center space-x-3">
                        {/* Updated logo */}
                        <img src={logo} className="h-8" alt="Fitness Home Logo" />
                        <span className="self-center text-xl font-semibold text-yellow-500 hidden md:block">FitnessHome</span>
                    </Link>

                    <div className="flex items-center md:order-2 space-x-3">
                        {/* Greeting and User Icon */}
                        <span className="text-yellow-500">
                            {userName ? `Hello, ${userName}` : 'Hello'}
                        </span>

                        {/* Profile Icon */}
                        <button type="button" onClick={toggleProfile}
                            className="flex justify-center items-center text-sm bg-white border-2 border-solid border-black w-8 h-8 rounded-full focus:ring-4 focus:ring-gray-300"
                        >
                            <span className="sr-only">Open user menu</span>
                            <UserOutlined className="scale-150" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className={`my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow fixed right-0 top-12 ${isProfileOpen ? "block" : "hidden"}`}>
                            <div onClick={showModal} className="px-4 py-3 hover:bg-blue-700 hover:text-white cursor-pointer">
                                <span className="block text-lg">
                                    {userName ? userName.toUpperCase() : "Hello "}
                                </span>
                                <span className="block text-sm">Change Password</span>
                            </div>
                            <ul className="py-2">
                                <li>
                                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-600 hover:text-white">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" onClick={LogoutFn} className="block px-4 py-2 text-gray-700 hover:bg-gray-600 hover:text-white">
                                        Sign out
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Hamburger menu for mobile */}
                        <button data-collapse-toggle="navbar-user" type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            onClick={() => props.setaside(!props.aside)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Password Change Modal */}
                <Modal title="Change Password" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel} footer={null}>
                    <p>If you encounter any issues or need assistance, please don't hesitate to reach out to us.</p>
                    <Form {...layout} className='mt-8' name="nest-messages" onFinish={onBookingFinish} style={{ maxWidth: 400 }} validateMessages={validateMessages}>
                        <Form.Item name="oldpassword" label="Old Password" tooltip={{ title: 'Secure password', icon: <InfoCircleOutlined /> }} rules={[{ required: true, message: 'Please input your password!' }]} hasFeedback>
                            <Input.Password placeholder="Enter your Old Password" />
                        </Form.Item>
                        <Form.Item name="password" label="Password" tooltip={{ title: 'Secure password', icon: <InfoCircleOutlined /> }} rules={[{ required: true, message: 'Please input your password!' }]} hasFeedback>
                            <Input.Password placeholder="Enter your Password" />
                        </Form.Item>
                        <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback tooltip={{ title: 'Secure password', icon: <InfoCircleOutlined /> }} rules={[
                               { required: true, message: 'Please confirm your password!' },
                               ({ getFieldValue }) => ({
                                   validator(_, value) {
                                       if (!value || getFieldValue('password') === value) {
                                           return Promise.resolve();
                                       }
                                       return Promise.reject(new Error('The new password that you entered do not match!'));
                                   },
                               }),
                           ]}>
                               <Input.Password placeholder="Confirm Password" />
                           </Form.Item>
                           <Form.Item wrapperCol={{ offset: 8 }}>
                               <Button key="back" onClick={handleCancel} className="bg-sky-800 text-white w-24">Return</Button>
                               <Button type="primary" htmlType="submit" className="bg-sky-800 ml-6 text-white w-24">Submit</Button>
                           </Form.Item>
                       </Form>
                   </Modal>
               </nav>
           </>
       );
   }

   export default Navbarcom;
