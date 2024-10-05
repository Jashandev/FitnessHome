import React from 'react';
import { Form, Input, Button, InputNumber, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../Store/Slices/ExpensesSlice';

const AddExpense = () => {
  const dispatch = useDispatch();
  const { expenses } = useSelector((state) => state.Expenses);

  const onFinish = async (values) => {
    try {
      await dispatch(addExpense(values)).unwrap();
      message.success('Expense added successfully');
    } catch (error) {
      console.log(error);
      message.error('Failed to add expense');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Add Expense</h2>
        
        {/* Form to Add Expense */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="max-w-lg mx-auto mb-6"
          style={{ backgroundColor: '#1d3d24', padding: '20px', borderRadius: '10px', border: '1px solid #FFD700' }} // Highlight form area
        >
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              name="type"
              label={<span style={{ color: '#FFD700' }}>Expense Type</span>}
              rules={[{ required: true, message: 'Please enter the expense type' }]}
            >
              <Input placeholder="Enter expense type" style={{ borderColor: '#FFD700', borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span style={{ color: '#FFD700' }}>Description</span>}
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <Input.TextArea placeholder="Enter description" style={{ borderColor: '#FFD700', borderRadius: '8px' }} rows={3} />
            </Form.Item>

            <Form.Item
              name="amount"
              label={<span style={{ color: '#FFD700' }}>Amount</span>}
              rules={[{ required: true, message: 'Please enter the amount' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="Enter amount"
                style={{ width: '100%', borderColor: '#FFD700', borderRadius: '8px', padding: '8px' }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
            >
              Add Expense
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddExpense;
