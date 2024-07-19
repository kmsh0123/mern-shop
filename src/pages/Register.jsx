import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import AuthForm from '../components/AuthForm';
// import Link from "react-router-dom"

const Register = () => {
  return (
   <>
    <AuthForm isLoginPage={false}/>
   </>
  )
}

export default Register