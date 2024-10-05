import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import logo from '../assets/logo.png'; // Importing the logo

const DashboardIntro = () => {
  return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#1D3D24' }}>
      <div className="text-center">
        {/* Logo Section */}
        <img src={logo} alt="Fitness Home Logo" className="mx-auto mb-8" style={{ width: '200px' }} />

        {/* Text Section */}
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#FFD700' }}>Welcome to Fitness Home</h1>
        <p className="text-xl mb-10" style={{ color: '#FFD700' }}>Manage your gym efficiently with our easy-to-use platform.</p>

        {/* Button Section */}
        <Link to="/login">
          <Button type="primary" style={{ backgroundColor: 'rgb(221, 201, 122)' , color: '#000' }} size="large">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardIntro;
