import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchTrainers, assignTrainer } from '../Store/Slices/AssignTrainer';
import { Select, Button, Spin, message } from 'antd';

const { Option } = Select;

const AssignTrainer = () => {
  const dispatch = useDispatch();
  const { users, trainers, status, error } = useSelector((state) => state.AssignTrainer);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTrainers());
  }, [dispatch]);

  const handleAssignTrainer = async () => {
    if (!selectedUser || !selectedTrainer) {
      message.error('Please select both a user and a trainer');
      return;
    }

    const res = await dispatch(assignTrainer({ userId: selectedUser, trainerId: selectedTrainer }));
    
    if (res.payload && res.payload.message === 'Trainer assigned successfully') {
      message.success('Trainer assigned successfully');
    } else {
      message.error('Failed to assign trainer');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(29, 61, 36)' }}>
      <div className="container mx-auto p-6" style={{ backgroundColor: 'rgb(29, 61, 36)', color: '#FFD700' }}>
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#FFD700', textAlign: 'center' }}>Assign Trainer to User</h2>

        {status === 'loading' && <Spin size="large" className="block mx-auto mb-4" />}

        {status === 'failed' && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="max-w-lg mx-auto" style={{ backgroundColor: '#1d3d24', padding: '20px', borderRadius: '10px', border: '1px solid #FFD700' }}>
          <div className="mb-4">
            <label className="block mb-2 text-lg" style={{ color: '#FFD700' }}>Select User</label>
            <Select
              value={selectedUser}
              onChange={(value) => setSelectedUser(value)}
              placeholder="Select User"
              className="w-full"
              style={{ borderColor: '#FFD700', borderRadius: '8px' }}
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg" style={{ color: '#FFD700' }}>Select Trainer</label>
            <Select
              value={selectedTrainer}
              onChange={(value) => setSelectedTrainer(value)}
              placeholder="Select Trainer"
              className="w-full"
              style={{ borderColor: '#FFD700', borderRadius: '8px' }}
            >
              {trainers.map((trainer) => (
                <Option key={trainer._id} value={trainer._id}>
                  {trainer.name} ({trainer.email})
                </Option>
              ))}
            </Select>
          </div>

          <Button
            type="primary"
            onClick={handleAssignTrainer}
            disabled={!selectedUser || !selectedTrainer}
            style={{ backgroundColor: 'rgb(221, 201, 122)', color: '#000', borderRadius: '8px' }}
            className="w-full"
          >
            Assign Trainer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignTrainer;
