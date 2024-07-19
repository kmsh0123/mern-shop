import React, { useEffect, useState } from 'react';
import {
  DashboardOutlined,
  ProductOutlined,
  PlusOutlined,
  NotificationOutlined,
  UserOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/products', icon: <ProductOutlined />, label: 'Products' },
  { key: '/addProducts', icon: <PlusOutlined />, label: 'Add Products' },
  { key: '/notifications', icon: <NotificationOutlined />, label: 'Notifications' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(location.pathname);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    setSelectedKeys(location.pathname);
    if (location.pathname.startsWith('/profile')) {
      setProfileMenuOpen(true);
    }
  }, [location.pathname]);

  const handleMenuClick = (key) => {
    navigate(key);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="flex flex-col items-center py-4">
        <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
        <div className="w-full">
          {menuItems.map(({ key, icon, label }) => (
            <div
              key={key}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${selectedKeys === key ? 'bg-gray-700' : ''}`}
              onClick={() => handleMenuClick(key)}
            >
              <span className="mr-4">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
          <div
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${selectedKeys.startsWith('/profile') ? 'bg-gray-700' : ''}`}
            onClick={toggleProfileMenu}
          >
            <span className="mr-4"><UserOutlined /></span>
            <span>Profile</span>
            <span className="ml-auto">{profileMenuOpen ? <DownOutlined /> : <RightOutlined />}</span>
          </div>
          {profileMenuOpen && (
            <div className="pl-8">
              <div
                className={`flex items-center p-4 my-1 cursor-pointer hover:bg-gray-700 ${selectedKeys === '/profile/changePassword' ? 'bg-gray-700' : ''}`}
                onClick={() => handleMenuClick('/profile/changePassword')}
              >
                Change Password
              </div>
              <div
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${selectedKeys === '/profile/information' ? 'bg-gray-700' : ''}`}
                onClick={() => handleMenuClick('/profile/information')}
              >
                Information
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
