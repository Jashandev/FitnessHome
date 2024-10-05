import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchUsersByFilter } from '../Store/Slices/usersSlice';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `users_${selectedFilter ? selectedFilter.label : 'all'}.xlsx`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Filter and Export Users</h2>

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
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
        >
          Apply Filter
        </button>

        {/* Display loading, error, or users */}
        {loading ? (
          <p className="text-blue-600">Loading users...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : users.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg mt-4">
            <thead>
              <tr style={{ backgroundColor: '#FFD700', color: '#000' }}>
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
                  style={{
                    backgroundColor: index % 2 === 0 ? '#F0F0F0' : '#FFFFFF',
                    color: '#000',
                  }}
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
          <button
            onClick={exportToExcel}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
          >
            Export to Excel
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFilterExport;
