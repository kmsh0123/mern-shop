import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { useChangePasswordMutation } from '../feature/services/api/authApi';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../feature/Slice/authSlice';

const ChangePassword = () => {
  const token = Cookies.get("token");
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const changePasswordHandler = async (user) => {
    try {
      const { data, error } = await changePassword({ user, token });
      if (data?.success) {
        dispatch(removeUser());
        nav("/login");
      } else {
        throw new Error(data?.message || error?.data?.message || 'Something went wrong');
      }
    } catch (error) {
      message.error(error.message || 'Something went wrong');
    }
  };

  return (
    <>
      <h1 className="p-4">Change Password</h1>
      <Form
        layout="vertical"
        className="flex flex-col max-w-md p-4"
        onFinish={changePasswordHandler}
      >
        <Form.Item
          name="currentPassword"
          layout="vertical"
          label={<span className="dark:text-white">Old Password</span>}
          rules={[
            {
              required: true,
              message: 'Please input your old password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password className="dark:bg-gray-800 dark:text-white mb-0" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          layout="vertical"
          label={<span className="dark:text-white">New Password</span>}
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password className="dark:bg-gray-800 dark:text-white mb-0" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={isLoading}>
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
