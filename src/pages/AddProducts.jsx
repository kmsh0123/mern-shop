import React from 'react';
import { Button, Form, Input, Checkbox, Select, Col, Row,message } from 'antd';
import Cookies from "js-cookie"
import { useCreateProductMutation } from '../feature/services/api/productApi';
import { useNavigate } from 'react-router-dom';

// Constants
const PRODUCT_OPTIONS = [
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Warranty', value: 'Warranty' },
  { label: 'Voucher', value: 'Voucher' },
];

const CATEGORY_OPTIONS = [
  { value: 'Health & Beauty', label: 'Health & Beauty' },
  { value: 'Electronic Devices', label: 'Electronic Devices' },
  { value: 'Electronic Accessories', label: 'Electronic Accessories' },
  { value: 'TV & Home Appliances', label: 'TV & Home Appliances' },
  { value: `Women's Fashion`, label: `Women's Fashion` },
  { value: `Men's Fashion`, label: `Men's Fashion` },
  { value: 'Groceries & Pets', label: 'Groceries & Pets' },
  { value: 'Automotive & Motorbike', label: 'Automotive & Motorbike' },
  { value: 'Home & Lifestyle', label: 'Home & Lifestyle' },
  { value: 'Babies & Toys', label: 'Babies & Toys' },
  { value: 'Sports & Outdoor', label: 'Sports & Outdoor' },
  { value: 'Watches & Accessories', label: 'Watches & Accessories' },
];


const AddProducts = () => {
 const token = Cookies.get("token");
 const [productCreate] = useCreateProductMutation();
const { TextArea } = Input;
const nav = useNavigate();

 const ProductCreateHandle = async(user) => {
  try {
    const { data, error } = await productCreate({user,token})
    if (data?.success) {
      message.success(data?.message)
      nav("/products");
    } else {
      throw new Error(data?.message || error?.data?.message || 'Something went wrong');
    }
  } catch (error) {
    message.error(error.message || 'Something went wrong');
  }
};

const handleSelectChange = (value) => {
  console.log(`selected ${value}`);
};

const handleCheckboxChange = (value) => {
  console.log(`selected ${value}`);
};

return(
  <div className="p-4">
    <h1 className="dark:text-white text-3xl font-black">What you want to sell?</h1>
    <Form
      layout="vertical"
      className="flex flex-col max-w-2xl"
      onFinish={ProductCreateHandle}
    >
      <Form.Item
        name="product_name"
        label={<span className="dark:text-white">Product Name</span>}
        rules={[
          { required: true, message: 'Please input your Product Name!' },
        ]}
        hasFeedback
      >
        <Input className="dark:bg-gray-800 dark:text-white" />
      </Form.Item>

      <Form.Item
        name="product_description"
        label={<span className="dark:text-white">Product Description</span>}
        rules={[
          { required: true, message: 'Please input your description!' },
        ]}
        hasFeedback
      >
        <TextArea rows={4} className="dark:bg-gray-800 dark:text-white" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="product_price"
            label={<span className="dark:text-white">Price</span>}
            rules={[
              { required: true, message: 'Please input your price!' },
            ]}
            hasFeedback
          >
            <Input className="dark:bg-gray-800 dark:text-white" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="product_category"
            label={<span className="dark:text-white">Product Category</span>}
            rules={[
              { required: true, message: 'Please select your product category!' },
            ]}
            hasFeedback
          >
            <Select
              onChange={handleSelectChange}
              options={CATEGORY_OPTIONS}
              className="dark:bg-gray-800 dark:text-white"
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="product_used"
            label={<span className="dark:text-white">Used For</span>}
            rules={[
              { required: true, message: 'Please input the use of your product!' },
            ]}
            hasFeedback
          >
            <Input className="dark:bg-gray-800 dark:text-white" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="product_detail"
        label={<span className="dark:text-white">This product has</span>}
        rules={[
          { required: true, message: 'Please choose at least one option!' },
        ]}
        hasFeedback
      >
        <Checkbox.Group
          options={PRODUCT_OPTIONS}
          onChange={handleCheckboxChange}
          className="dark:text-white"
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" className="w-full">
        Sell Product
      </Button>
    </Form>
  </div>
);

}

export default AddProducts;
