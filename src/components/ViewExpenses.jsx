import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllExpenses } from '../Store/Slices/ExpensesSlice';
import { Table, Spin, message, DatePicker, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ViewExpenses = () => {
    const dispatch = useDispatch();
    const { expenses, status, error } = useSelector((state) => state.Expenses);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        dispatch(fetchAllExpenses());
    }, [dispatch]);

    useEffect(() => {
        if (expenses.length > 0) {
            setFilteredExpenses(expenses);
        }
    }, [expenses]);

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            const [start, end] = dates;
            const filtered = expenses.filter((expense) => {
                const expenseDate = moment(expense.date).startOf('day');
                return expenseDate.isSameOrAfter(start.$d, 'day') && expenseDate.isSameOrBefore(end.$d, 'day');
            });
            setFilteredExpenses(filtered);
        } else {
            setFilteredExpenses(expenses);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredExpenses.map((expense) => ({
                Type: expense.type,
                Description: expense.description,
                Amount: expense.amount,
                Date: moment(expense.date).format('YYYY-MM-DD'),
                'Expense Done By': `${expense.createdBy?.name || 'Unknown'} (${expense.createdBy?.email || expense.createdBy?.phone || 'No contact'})`
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
        XLSX.writeFile(workbook, 'expenses.xlsx');
    };

    if (status === 'loading') return <Spin />;

    if (status === 'failed') {
        message.error(error || 'Failed to load expenses');
        return null;
    }

    const columns = [
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => moment(text).format('YYYY-MM-DD')
        },
        {
            title: 'Expense Done By',
            dataIndex: ['createdBy', 'name'],
            key: 'createdBy',
            render: (text, record) => {
                const name = record.createdBy?.name || 'Unknown';
                const contact = record.createdBy?.email || record.createdBy?.phone || 'No contact';
                return `${name} (${contact})`;
            }
        }
    ];

    return (
        <div className="min-h-screen bg-green-900 text-yellow-500">
            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">View Expenses</h2>

                {/* Date Filter and Export Button */}
                <div className="mb-4 flex flex-wrap items-center justify-between space-y-4 md:space-y-0">
                    <RangePicker 
                        onChange={handleDateRangeChange} 
                        style={{ borderColor: '#FFD700', borderRadius: '8px' }} 
                    />
                    <Button
                        type="primary"
                        icon={<ExportOutlined />}
                        onClick={exportToExcel}
                        disabled={filteredExpenses.length === 0}
                        className="bg-yellow-300 text-black rounded-md"
                    >
                        Export to Excel
                    </Button>
                </div>

                {/* Expenses Table */}
                <Table
                    dataSource={filteredExpenses}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: '100%' }} // Enable scroll on smaller screens
                    className="bg-white rounded-lg"
                />
            </div>
        </div>
    );
};

export default ViewExpenses;
