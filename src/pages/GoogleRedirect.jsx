// GoogleRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { addUser } from '../feature/Slice/authSlice';

const GoogleRedirect = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
    if (token) {
      dispatch(addUser({ user, token }));
      message.success('Logged in successfully with Google');
      nav('/');
    } else {
      message.error('Failed to log in with Google');
      nav('/login');
    }
  }, [dispatch, nav]);

  return null;
};

export default GoogleRedirect;
