import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../feature/services/api/authApi';
import { addUser } from '../feature/Slice/authSlice';
import { useDispatch } from 'react-redux';
import CryptoJS from 'crypto-js';

const AuthForm = ({ isLoginPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userRegister] = useRegisterMutation();
  const [userLogin] = useLoginMutation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const secretKey = import.meta.env.VITE_SECRET_KEY;

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const handleGoogleAuth = () => {
    try {
      window.open(`${import.meta.env.VITE_API_ENDPOINT}/auth/google/callback` , "_self");
    } catch (err) {
      message.error(err?.data?.message || err.error);
    }
  };

  const authHandler = async (user) => {
    setIsLoading(true);
    if (isLoginPage) {
      try {
        const data = await userLogin(user);
        dispatch(addUser({ user: data?.data?.user, token: data?.data?.token }));
        if (data?.data?.success) {
          if (rememberMe) {
            localStorage.setItem('authEmail', user.email);
            localStorage.setItem('authPassword', encryptPassword(user.password));
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('authEmail');
            localStorage.removeItem('authPassword');
            localStorage.removeItem('rememberMe');
          }
          nav("/");
          message.success(data?.data?.message);
        } else {
          message.error(data?.error?.data?.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      try {
        const data = await userRegister(user);
        if (data?.data?.success) {
          // Store email and password in localStorage
          localStorage.setItem('authEmail', user.email);
          localStorage.setItem('authPassword', encryptPassword(user.password));
          
          nav("/login");
          message.success(data?.data?.message);
        } else {
          message.error(data?.error?.data?.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoading(false);
  };

  const getInitialValues = () => {
    if (isLoginPage) {
      const email = localStorage.getItem('authEmail') || '';
      const encryptedPassword = localStorage.getItem('authPassword') || '';
      const password = encryptedPassword ? decryptPassword(encryptedPassword) : '';
      return { email, password };
    }
    return {};
  };

  useEffect(() => {
    if (isLoginPage) {
      const rememberMeValue = localStorage.getItem('rememberMe') === 'true';
      setRememberMe(rememberMeValue);
      if (!rememberMeValue) {
        localStorage.removeItem('authEmail');
        localStorage.removeItem('authPassword');
      }
    }
  }, [isLoginPage]);

  return (
    <Form
      layout="vertical"
      className="flex flex-col justify-center lg:min-h-screen min-h-[600px] max-w-md mx-auto p-10 lg:p-0"
      initialValues={getInitialValues()}
      onFinish={authHandler}
    >
      <h1 className="text-center text-blue-500 mb-3 text-2xl font-black">
        E-commerce {isLoginPage ? 'Login' : 'Register'}
      </h1>

      {!isLoginPage && (
        <Form.Item
          name="name"
          label={<span className="dark:text-white">Username</span>}
          rules={[
            {
              type: 'text',
              message: 'Please input your username!',
            },
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
          hasFeedback
        >
          <Input className="dark:bg-gray-800 dark:text-white" />
        </Form.Item>
      )}

      <Form.Item
        name="email"
        label={<span className="dark:text-white">E-mail</span>}
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
        hasFeedback
      >
        <Input className="dark:bg-gray-800 dark:text-white" />
      </Form.Item>

      <Form.Item
        name="password"
        layout="vertical"
        label={<span className="dark:text-white">Password</span>}
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password className="dark:bg-gray-800 dark:text-white mb-0" />
      </Form.Item>
     <div className='flex justify-between items-center'>
     {
        isLoginPage && (
          <Checkbox
            className='mb-3 text-black dark:text-white'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            Remember Me
          </Checkbox>
        )
      }
      {
        isLoginPage && (
          <Link to={"/forgot-password"} className='text-black dark:text-white'>
            Forgot Password
          </Link>
        )
      }
     </div>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          {isLoading ? 'Loading...' : isLoginPage ? 'Login' : 'Register'}
        </Button>
        <Button onClick={handleGoogleAuth} type="primary" htmlType="submit" className="w-full mt-2">
          Google
        </Button>
        <span className="flex justify-center gap-2 mt-3">
          {isLoginPage ? (
            <Link to="/register" className="dark:text-white">
              Don't have an Account? Register
            </Link>
          ) : (
            <Link to="/login" className="dark:text-white">
              Do have an Account? Login
            </Link>
          )}
        </span>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
