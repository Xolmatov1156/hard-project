import React, { useState } from 'react';
import Header from '../components/Header';
import { Input, Button, notification, Card, Typography } from 'antd';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function Add() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: (newUser) => axios.post('http://localhost:3000/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setName('');
      setAge('');
      notification.success({
        message: 'Success',
        description: 'User added successfully!',
      });
      navigate('/');
    },
    onError: (error) => {
      notification.error({
        message: 'Error',
        description: `Failed to add user: ${error.response?.data?.message || error.message}`,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age) {
      notification.warning({
        message: 'Validation Error',
        description: 'Please enter both name and age.',
      });
      navigate("/");
      return;
    }
    if (isNaN(age)) {
      notification.warning({
        message: 'Validation Error',
        description: 'Age must be a number.',
      });
      return;
    }

    addUserMutation.mutate({ name, age });
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-[91vh] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
        <Card
          title={<Title level={3} className="text-center">Add New User</Title>}
          bordered={false}
          className="w-full max-w-md shadow-md bg-white rounded-lg"
        >
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
              placeholder='Enter Name'
              size='large'
              className='rounded text-blue-500 placeholder:text-blue-500'
              allowClear
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder='Enter Age'
              size='large'
              className='rounded text-blue-500'
              type='number'
              required
              allowClear
              min={12}
              max={30}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Button
              type='primary'
              size='large'
              className='w-full hover:bg-blue-600 transition-all'
              htmlType='submit'
            >
              Add User
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

export default Add;
