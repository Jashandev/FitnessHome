import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, InputNumber, Select, message, Spin } from 'antd';
import { fetchUsersByEmail } from '../Store/Slices/AssignPlan'; // Reusing fetchUsersByEmail
import { generateInvoice } from '../Store/Slices/GenerateInvoice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Option } = Select;

const GenerateInvoice = () => {
  const [items, setItems] = useState([{ name: '', amount: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0); // State for total after discount
  const dispatch = useDispatch();

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsersByEmail(null)).then((response) => setUsers(response.payload));
  }, [dispatch]);

  // Update total whenever items or discount change
  useEffect(() => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    setTotal(totalAmount - discount);
  }, [items, discount]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', amount: 0 }]);
  };

  const handleGenerateInvoice = async () => {
    if (!selectedUser) {
      message.error('Please select a user');
      return;
    }

    if (items.some(item => !item.name || item.amount === 0)) {
      message.error('Please provide valid item names and amounts');
      return;
    }

    setLoading(true);

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const finalAmount = totalAmount - discount;

    const description = items.map((item) => `${item.name}: $${item.amount}`).join(', ');

    const invoiceData = {
      userId: selectedUser,
      amount: totalAmount,
      discount,
      finalAmount,
      dueDate: new Date().toISOString(),
      status: 'paid',
      description,
    };

    const response = await dispatch(generateInvoice(invoiceData));

    setLoading(false);

    if (response.payload.message === "Invoice created successfully") {
      const doc = new jsPDF();
      doc.text('Invoice', 10, 10);
      doc.autoTable({
        head: [['Item', 'Amount']],
        body: [
          ...items.map(item => [item.name, `$${item.amount}`]),
          ['Discount', `$${discount}`],
          ['Total', `$${finalAmount}`],
        ],
      });
      doc.save('invoice.pdf');

      message.success('Invoice generated and saved successfully');
    } else {
      message.error('Failed to generate invoice');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Generate Invoice</h2>

        <div className="max-w-lg mx-auto" style={{ backgroundColor: '#1d3d24', padding: '20px', borderRadius: '10px', border: '1px solid #FFD700' }}>
          <Form layout="vertical">
            <Form.Item label={<span style={{ color: '#FFD700' }}>Select User</span>}>
              <Select
                placeholder="Select a user"
                onChange={(value) => setSelectedUser(value)}
                style={{ borderColor: '#FFD700', borderRadius: '8px', marginBottom: '20px' }}
              >
                {users?.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.email}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {items.map((item, index) => (
              <div key={index} className="mb-4 flex space-x-4">
                <Input
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  style={{ borderColor: '#FFD700', borderRadius: '8px', width: '70%' }}
                />
                <InputNumber
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(value) => handleItemChange(index, 'amount', value)}
                  style={{ borderColor: '#FFD700', borderRadius: '8px', width: '30%' }}
                />
              </div>
            ))}

            <Button
              onClick={handleAddItem}
              style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px', marginBottom: '20px' }}
            >
              Add Another Item
            </Button>

            <Form.Item label={<span style={{ color: '#FFD700' }}>Discount</span>}>
              <InputNumber
                min={0}
                value={discount}
                onChange={setDiscount}
                style={{ borderColor: '#FFD700', borderRadius: '8px', width: '100%' }}
              />
            </Form.Item>

            <Form.Item label={<span style={{ color: '#FFD700' }}>Total</span>}>
              <Input
                value={`₹${total}`}
                disabled
                style={{ backgroundColor: '#fff', borderColor: '#FFD700', borderRadius: '8px', color: '#000' }}
              />
            </Form.Item>

            <Button
              type="primary"
              onClick={handleGenerateInvoice}
              disabled={loading}
              style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px', width: '100%' }}
            >
              {loading ? <Spin /> : 'Generate Invoice'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;
