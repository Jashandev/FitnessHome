import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchUsersByFilter } from '../Store/Slices/usersSlice';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from 'antd';

// Filter options for user categories
const filterOptions = [
  { value: 'inactive', label: 'Inactive Users' },
  { value: 'expiringPlans', label: 'Plan Expired Users' },
  { value: 'paymentsDue', label: 'Payments Due Users' },
];

const UserFilterExport = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.Users);

  // Handle filtering users based on the selected filter option
  const handleFilter = async () => {
    if (!selectedFilter) return;

    try {
      await dispatch(fetchUsersByFilter({ filterType: selectedFilter.value }));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Export the filtered users to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users.map(user => ({
      Name: user.name,
      Email: user.email,
      City: user.city,
      Phone: user.phone,
      Plan: user.plan ? user.plan.planName : 'No Plan',
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `users_${selectedFilter ? selectedFilter.label : 'all'}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#1d3d24] text-yellow-500">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Filter and Export Users</h2>

        {/* Dropdown for selecting filter */}
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={setSelectedFilter}
          className="mb-4 text-black"
          placeholder="Select user filter..."
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#FFD700',
              borderRadius: '8px',
              color: '#000',
            }),
          }}
        />

        {/* Button to apply the filter */}
        <Button
          onClick={handleFilter}
          className="bg-yellow-300 text-black px-4 py-2 rounded-md shadow-md hover:bg-yellow-400"
        >
          Apply Filter
        </Button>

        {/* Display loading, error, or users */}
        {loading ? (
          <p className="text-blue-600 mt-4">Loading users...</p>
        ) : error ? (
          <p className="text-red-600 mt-4">Error: {error}</p>
        ) : users.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
            <thead>
              <tr className="bg-yellow-300 text-black">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Plan Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-black`}
                >
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.city}</td>
                  <td className="border px-4 py-2">{user.phone}</td>
                  <td className="border px-4 py-2">{user.plan ? user.plan.planName : 'No Plan'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No users found.</p>
        )}

        {/* Button to export to Excel */}
        {users.length > 0 && (
          <Button
            onClick={exportToExcel}
            className="mt-4 bg-green-500 text-black px-4 py-2 rounded-md shadow-md hover:bg-green-600"
          >
            Export to Excel
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFilterExport;
