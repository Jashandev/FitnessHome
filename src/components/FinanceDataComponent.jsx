import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDebitEntries, fetchCreditEntries } from '../Store/Slices/financeSlice';
import { Table, Spin, message, DatePicker, Button } from 'antd';
import * as XLSX from 'xlsx';
import { ExportOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

const FinanceData = () => {
  const dispatch = useDispatch();
  const { debitEntries, creditEntries, loading, error } = useSelector((state) => state.Finance);
  const [filteredDebitEntries, setFilteredDebitEntries] = useState([]);
  const [filteredCreditEntries, setFilteredCreditEntries] = useState([]);
  const [profitLoss, setProfitLoss] = useState(0);

  useEffect(() => {
    dispatch(fetchDebitEntries());
    dispatch(fetchCreditEntries());
  }, [dispatch]);

  useEffect(() => {
    if (debitEntries.length > 0 && creditEntries.length > 0) {
      setFilteredDebitEntries(debitEntries);
      setFilteredCreditEntries(creditEntries);
      calculateProfitLoss(debitEntries, creditEntries);
    }
  }, [debitEntries, creditEntries]);

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      const filteredDebit = debitEntries.filter((entry) => {
        const entryDate = moment(entry.date).startOf('day');
        return entryDate.isSameOrAfter(start, 'day') && entryDate.isSameOrBefore(end, 'day');
      });
      const filteredCredit = creditEntries.filter((entry) => {
        const entryDate = moment(entry.date).startOf('day');
        return entryDate.isSameOrAfter(start, 'day') && entryDate.isSameOrBefore(end, 'day');
      });

      setFilteredDebitEntries(filteredDebit);
      setFilteredCreditEntries(filteredCredit);
      calculateProfitLoss(filteredDebit, filteredCredit);
    } else {
      setFilteredDebitEntries(debitEntries);
      setFilteredCreditEntries(creditEntries);
      calculateProfitLoss(debitEntries, creditEntries);
    }
  };

  const calculateProfitLoss = (debitEntries, creditEntries) => {
    const totalDebit = debitEntries.reduce((total, entry) => total + entry.amount, 0);
    const totalCredit = creditEntries.reduce((total, entry) => total + entry.amount, 0);
    setProfitLoss(totalCredit - totalDebit);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      [
        ...filteredDebitEntries.map((entry) => ({
          Type: 'Debit',
          description: entry.description,
          user: `${entry.createdBy.name} (${entry.createdBy.email})`,
          Amount: `₹${entry.amount}`,
          Date: moment(entry.date).format('YYYY-MM-DD'),
        })),
        ...filteredCreditEntries.map((entry) => ({
          Type: 'Credit',
          description: entry.description,
          user: `${entry.user.name} (${entry.user.email})`,
          Amount: `₹${entry.amount}`,
          Date: moment(entry.date).format('YYYY-MM-DD'),
        })),
      ]
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Finance Data');
    XLSX.writeFile(workbook, 'finance_data.xlsx');
  };

  const columnsDebit = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => <span>{description}</span>,
    },
    {
      title: 'User',
      dataIndex: 'createdBy',
      key: '_id',
      render: (createdBy) => <span>{createdBy.name} ({createdBy.email})</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span style={{ color: 'red' }}>₹{amount}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
  ];

  const columnsCredit = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => <span>{description}</span>,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: '_id',
      render: (user) => <span>{user.name} ({user.email})</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span style={{ color: 'green' }}>₹{amount}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
  ];

  if (loading) return <Spin />;

  if (error) {
    message.error(error.msg || 'Failed to load finance data');
    return null;
  }

  return (
    <div className="min-h-screen bg-green-900 text-yellow-500">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Finance Data</h2>

        {/* Date Filter and Export Button */}
        <div className="mb-4 flex flex-wrap items-center justify-between space-y-4 md:space-y-0">
          <RangePicker 
            onChange={handleDateRangeChange} 
            style={{ borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
          />
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={exportToExcel}
            className="bg-yellow-300 text-black rounded-md"
          >
            Export to Excel
          </Button>
        </div>

        {/* Debit Entries Table */}
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'red' }}>Debit Entries</h3>
        <Table
          dataSource={filteredDebitEntries}
          columns={columnsDebit}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: '100%' }} // Ensure table is scrollable on smaller screens
          className="bg-white rounded-lg mb-6"
        />

        {/* Credit Entries Table */}
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'green' }}>Credit Entries</h3>
        <Table
          dataSource={filteredCreditEntries}
          columns={columnsCredit}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: '100%' }} // Ensure table is scrollable on smaller screens
          className="bg-white rounded-lg"
        />

        {/* Profit/Loss Display */}
        <div className="mt-6 text-xl font-bold" style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
          Overall {profitLoss >= 0 ? 'Profit' : 'Loss'}: ₹{Math.abs(profitLoss).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default FinanceData;
