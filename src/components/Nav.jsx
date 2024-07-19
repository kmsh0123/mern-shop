import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserOutlined ,DownOutlined,SmileOutlined} from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import {useGetProfileQuery, useLogoutMutation } from '../feature/services/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../feature/Slice/authSlice';

const Nav = () => {
  const [token, setToken] = useState(Cookies.get('token'));
  const {data} = useGetProfileQuery(token);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  
  const LogoutHandler = async(user) => {
   try {
    const { data, error } = await logout({user,token})
    if (data?.success) {
      dispatch(removeUser());
      nav("/login");
    } else {
      throw new Error(data?.message || error?.data?.message || 'Something went wrong');
    }
  } catch (error) {
    message.error(error.message || 'Something went wrong');
  }
  }

  const items = [
    {
      key: '1',
      label: data?.user?.name
    },
    {
      key: '2',
      label: data?.user?.email
    }
  ];
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newToken = Cookies.get('token');
      if (newToken !== token) {
        setToken(newToken);
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <nav className='p-5 dark:text-black text-white relative dark:bg-white bg-black flex justify-between items-center'>
      <h1>Nav</h1>
      {!token ? (
        <div className='flex gap-10'>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </div>
      ) : (
        <div className='flex gap-10 items-center'>
          <button onClick={LogoutHandler} className='bg-red-500 p-2 px-5 rounded-lg text-white'>Logout</button>
        <Dropdown
           menu={{
            items,
          }}
          >
        <Avatar size={32} icon={<UserOutlined />} />
        </Dropdown>
        </div>
      )}
    </nav>
  );
};

export default Nav;
