import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';

const Header = ({ onMenuClick, onSearch }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="hidden md:block">
              <SearchBar 
                onSearch={onSearch}
                placeholder="Search students..."
                className="w-80"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden"
            >
              <ApperIcon name="Search" size={20} />
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" size={20} />
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Settings" size={20} />
            </Button>
            
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-2">
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Mobile search */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search students..."
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;