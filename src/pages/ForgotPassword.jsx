import React, { useState } from 'react'
import { Button, Form, Input, message } from 'antd';
import { useForgotPasswordMutation } from '../feature/services/api/authApi';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();  // Add form reference
    const [forgotPassword] = useForgotPasswordMutation();

    const forgotPasswordHandler = async (user) => {
        setIsLoading(true);
        try {
            const { data } = await forgotPassword(user);
            message.success(data?.message);
            form.resetFields();  // Clear form fields
        } catch (error) {
            message.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form
            form={form}  // Attach form reference
            layout="vertical"
            className="flex flex-col justify-center lg:min-h-screen min-h-[600px] max-w-md mx-auto p-10 lg:p-0"
            onFinish={forgotPasswordHandler}
        >
            <h1 className="text-center text-blue-500 mb-3 text-2xl font-black">
                Forgot Password
            </h1>

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
                <Input />
            </Form.Item>

            <Form.Item>
            <button
                    type="submit"
                    className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${
                        isLoading ? 'bg-blue-500 cursor-not-allowed opacity-70' : 'bg-blue-500 hover:bg-blue-700'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Forgot Password...' : 'Forgot Password'}
                </button>
            </Form.Item>
        </Form>
    )
}

export default ForgotPassword;
