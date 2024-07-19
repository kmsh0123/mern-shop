import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd';
import {useResetPasswordMutation} from '../feature/services/api/authApi';
import { useNavigate, useParams } from 'react-router-dom';


const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();  // Add form reference
    const [resetPassword] = useResetPasswordMutation();
    const {token} = useParams();

    const nav = useNavigate();
    const resetPasswordHandler = async (user) => {
        setIsLoading(true);
        try {
            const {data,error} = await resetPassword({ user, token });
            if(data?.success){
                nav("/login")
            } else {
                throw new Error(data?.message || error?.data?.message || 'Something went wrong');
              }
            } catch (error) {
              message.error(error.message || 'Something went wrong');
            }finally {
            setIsLoading(false);
        }
    }

    return (
        <Form
            form={form}  // Attach form reference
            layout="vertical"
            className="flex flex-col justify-center lg:min-h-screen min-h-[600px] max-w-md mx-auto p-10 lg:p-0"
            onFinish={resetPasswordHandler}
        >
            <h1 className="text-center text-blue-500 mb-3 text-2xl font-black">
                Reset Password
            </h1>

            <Form.Item
        name="newPassword"
        layout="vertical"
        label={<span className="dark:text-white">New Password</span>}
        rules={[
          {
            required: true,
            message: 'Please reset your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password className="dark:bg-gray-800 dark:text-white mb-0" />
      </Form.Item>

            <Form.Item>
            <button
                    type="submit"
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${
                        isLoading ? 'bg-blue-500 cursor-not-allowed opacity-70' : 'bg-blue-500 hover:bg-blue-700'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Reset Password...' : 'Reset Password'}
                </button>
            </Form.Item>
        </Form>
    )
}

export default ResetPassword;
