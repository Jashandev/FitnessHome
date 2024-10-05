import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const DashboardLayout = ({ children }) => {

	const [aside, setaside] = useState(false);

	return (
		<div className="min-h-screen flex flex-col">
			<Sidebar setaside={setaside} aside={aside} />
			<Navbar setaside={setaside} aside={aside} />
			<div className="flex-grow mt-20 ml-0 sm:ml-20">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default DashboardLayout;
