import React, { useState }  from 'react';
import Header from '../components/Header';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, Col, Row, Button, Modal, Input, notification } from 'antd';
import useDebounce from '../hook/useDebounse';

function Dashboard() {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const { data: usersData = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/users');
      return response.data;
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => axios.delete(`http://localhost:3000/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      notification.success({
        message: 'Success',
        description: 'User deleted successfully!',
      });
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: `Failed to delete user: ${error.message}`,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser) => axios.put(`http://localhost:3000/users/${updatedUser.id}`, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setEditingUser(null);
      setUserName('');
      setUserAge('');
      notification.success({
        message: 'Success',
        description: 'User updated successfully!',
      });
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: `Failed to update user: ${error.message}`,
      });
    },
  });

  const handleDelete = (userId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteUserMutation.mutate(userId);
      },
    });
  };

  const handleUpdate = (user) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserAge(user.age);
  };

  const handleSave = () => {
    if (!userName || !userAge) {
      notification.warning({
        message: 'Validation Error',
        description: 'Please enter both name and age.',
      });
      return;
    }
    if (isNaN(userAge)) {
      notification.warning({
        message: 'Validation Error',
        description: 'Age must be a number.',
      });
      return;
    }

    updateUserMutation.mutate({ ...editingUser, name: userName, age: userAge });
  };

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-[91vh] p-6">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-[300px] h-[40px] mx-auto block"
        />

        <Row gutter={16} justify="center">
          {filteredUsers.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={item.name}
                bordered={false}
                className="mb-6 capitalize"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                actions={[
                  <Button key="edit" onClick={() => handleUpdate(item)}>
                    Edit
                  </Button>,
                  <Button key="delete" danger onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                ]}
              >
                <p><strong>Age:</strong> {item.age}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title="Edit User"
          visible={!!editingUser}
          onOk={handleSave}
          onCancel={() => setEditingUser(null)}
        >
          <Input
            placeholder='Enter Name'
            size='large'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            placeholder='Enter Age'
            size='large'
            type='number'
            value={userAge}
            onChange={(e) => setUserAge(e.target.value)}
            className='mt-4'
          />
        </Modal>
      </div>
    </>
  );
}

export default Dashboard;
