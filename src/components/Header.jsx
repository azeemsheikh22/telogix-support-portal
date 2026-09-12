import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUser,
  faBell,
  faSignOutAlt,
  faUserCog,
  faEnvelope,
  faShoppingCart,
  faCheck,
  faExclamationTriangle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'lead',
      icon: faUsers,
      title: 'New Lead Received',
      message: 'Tech Solutions Inc. has been added as a new lead',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      icon: faExclamationTriangle,
      title: 'Deal at Risk',
      message: 'Enterprise Systems deal requires immediate attention',
      time: '15 minutes ago',
      isRead: false
    },
    {
      id: 3,
      type: 'message',
      icon: faEnvelope,
      title: 'Customer Inquiry',
      message: 'New message from Global Solutions',
      time: '1 hour ago',
      isRead: true
    },
    {
      id: 4,
      type: 'success',
      icon: faCheck,
      title: 'Deal Won',
      message: 'Deal #DEAL004 with StartUp Ventures has been closed',
      time: '2 hours ago',
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between px-2 sm:px-4 h-16">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
          >
            <FontAwesomeIcon icon={faBars} className="text-base text-gray-700" />
          </button>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            {/* Date and Time - Hide on very small screens */}
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-700">
                {formatDate(now)}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(now)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative cursor-pointer p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faBell} className="text-base text-gray-700" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {isNotificationOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-800">Notifications</h3>
                        <span className="text-xs text-gray-500">{notifications.length} total</span>
                      </div>
                      
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-l-4 transition-all duration-200 ${
                              notification.isRead 
                                ? 'border-gray-200 opacity-75' 
                                : 'border-blue-500 bg-blue-50'
                            }`}
                          >
                            <div className={
                              notification.type === 'lead' ? 'p-2 rounded-full bg-blue-100' :
                              notification.type === 'warning' ? 'p-2 rounded-full bg-yellow-100' :
                              notification.type === 'message' ? 'p-2 rounded-full bg-purple-100' :
                              notification.type === 'success' ? 'p-2 rounded-full bg-emerald-100' :
                              'p-2 rounded-full bg-gray-100'
                            }>
                              <FontAwesomeIcon 
                                icon={notification.icon} 
                                className={
                                  notification.type === 'lead' ? 'text-sm text-blue-600' :
                                  notification.type === 'warning' ? 'text-sm text-yellow-600' :
                                  notification.type === 'message' ? 'text-sm text-purple-600' :
                                  notification.type === 'success' ? 'text-sm text-emerald-600' :
                                  'text-sm text-gray-600'
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full cursor-pointer mt-4 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-xs font-medium"
                      >
                        View All Notifications
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-9 h-9 cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center hover:shadow-lg transition-all duration-200"
            >
              <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden"
                  >
                    <div className="p-4">
                      {/* User Info */}
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{user?.name || ' '}</div>
                          <div className="text-xs text-gray-500">{user?.email || 'admin@telogix.com'}</div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <motion.a
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faUserCog} className="text-gray-500 text-xs" />
                          <span className="text-gray-700 text-sm">Profile</span>
                        </motion.a>
                        
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>

                      {/* Sign Out */}
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer transition-all duration-200"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-red-500 text-xs" />
                        <span className="text-red-600 text-sm">Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;