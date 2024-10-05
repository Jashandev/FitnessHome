import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllInvoices } from '../Store/Slices/InvoicesSlice.js'; // Make sure to implement this slice
import { Table, Spin, message, DatePicker, Button } from 'antd';
import { ExportOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ViewInvoices = () => {
  const dispatch = useDispatch();
  const { invoices, status, error } = useSelector((state) => state.Invoices);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    dispatch(fetchAllInvoices()); // Fetch all invoices on component mount
  }, [dispatch]);

  useEffect(() => {
    if (invoices.length > 0) {
      setFilteredInvoices(invoices);
    }
  }, [invoices]);

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates;
      const filtered = invoices.filter((invoice) => {
        const invoiceDate = moment(invoice.paymentDate).startOf('day');
        return invoiceDate.isSameOrAfter(start.$d, 'day') && invoiceDate.isSameOrBefore(end.$d, 'day');
      });
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredInvoices.map((invoice) => ({
        'User': `${invoice.user?.name || 'Unknown'} (${invoice.user?.email || 'No contact'})`,
        'Plan': invoice.plan?.planName || 'N/A',
        'Amount': invoice.amount,
        'Discount': invoice.discount,
        'Final Amount': invoice.finalAmount,
        'Payment Date': moment(invoice.paymentDate).format('YYYY-MM-DD'),
        'Due Date': moment(invoice.dueDate).format('YYYY-MM-DD')
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'invoices.xlsx');
  };

  const downloadInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    doc.text('Invoice', 10, 10);
    doc.autoTable({
      head: [['Item', 'Value']],
      body: [
        ['User', `${invoice.user?.name || 'Unknown'} (${invoice.user?.email || 'No contact'})`],
        ['Plan', invoice.plan?.planName || 'N/A'],
        ['Amount', invoice.amount],
        ['Discount', invoice.discount],
        ['Final Amount', invoice.finalAmount],
        ['Payment Date', moment(invoice.paymentDate).format('YYYY-MM-DD')],
        ['Due Date', moment(invoice.dueDate).format('YYYY-MM-DD')],
      ],
    });
    doc.save(`invoice_${invoice._id}.pdf`);
  };

  if (status === 'loading') return <Spin />;

  if (status === 'failed') {
    message.error(error || 'Failed to load invoices');
    return null;
  }

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => `${record.user?.name || 'Unknown'} (${record.user?.email || 'No contact'})`,
    },
    {
      title: 'Plan',
      dataIndex: ['plan', 'planName'],
      key: 'plan',
      render: (text, record) => record.plan?.planName || 'N/A',
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    { title: 'Final Amount', dataIndex: 'finalAmount', key: 'finalAmount' },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => downloadInvoicePDF(record)}
          style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
        >
          Download PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>View Invoices</h2>

        {/* Date Filter and Export Button */}
        <div className="mb-4 flex items-center space-x-4">
          <RangePicker 
            onChange={handleDateRangeChange} 
            style={{ borderColor: '#FFD700', borderRadius: '8px', color: '#000' }} 
          />
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={exportToExcel}
            disabled={filteredInvoices.length === 0}
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
          >
            Export to Excel
          </Button>
        </div>

        {/* Invoices Table */}
        <Table
          dataSource={filteredInvoices}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
          style={{ backgroundColor: '#fff', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
};

export default ViewInvoices;
