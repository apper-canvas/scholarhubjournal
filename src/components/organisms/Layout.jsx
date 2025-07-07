import { useState } from 'react';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSearch = (searchTerm) => {
    // This can be passed to child components or handled globally
    console.log('Search:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={handleMenuClick} onSearch={handleSearch} />
          
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;