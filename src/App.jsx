import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import routes from './router/routes';
import './index.css'; // Import your Tailwind CSS file
import 'antd/dist/reset.css'; // Import Ant Design reset CSS
import { BsToggleOff, BsToggleOn } from "react-icons/bs"; // Import both icons

const App = () => {
  // Load the initial dark mode preference from local storage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ConfigProvider theme={darkMode ? 'dark' : 'light'}>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div onClick={toggleDarkMode} className="absolute z-10 right-[200px] top-[6px] m-[11px] cursor-pointer">
          {darkMode ? <BsToggleOn className='text-4xl text-blue-500' /> : <BsToggleOff className='text-4xl text-white' />}
        </div>
        <RouterProvider router={routes} />
      </div>
    </ConfigProvider>
  );
};

export default App;
