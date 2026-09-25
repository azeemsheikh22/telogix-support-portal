import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faChevronRight,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';

import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get active item from current route
  const currentPath =
    location.pathname.split('/').filter(Boolean).pop() || 'dashboard';

  const [activeItem, setActiveItem] = useState(currentPath);
  const [expandedMenus, setExpandedMenus] = useState({});

  // Sync active menu with URL
  useEffect(() => {
    const path =
      location.pathname.split('/').filter(Boolean).pop() || 'dashboard';

    setActiveItem(path);

    // Automatically open Reports when one of its sub-pages is active
    const reportPages = [
      'nr-report',
      'ignition-disconnect',
      'data-delay',
    ];

    if (reportPages.includes(path)) {
      setExpandedMenus((prev) => ({
        ...prev,
        reports: true,
      }));
    }
  }, [location.pathname]);

  const handleItemClick = (itemId, hasSubMenu = false) => {
    if (hasSubMenu) {
      setExpandedMenus((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }));

      return;
    }

    setActiveItem(itemId);

    navigate(`/dashboard/${itemId}`);

    if (onItemClick) {
      onItemClick();
    }
  };

  const handleSubItemClick = (itemId) => {
    setActiveItem(itemId);

    navigate(`/dashboard/${itemId}`);

    if (onItemClick) {
      onItemClick();
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: faHome,
      label: 'Dashboard',
    },

    // {
    //   id: 'tickets',
    //   icon: faClipboardList,
    //   label: 'Tickets',
    //   badge: '42',
    // },

    // {
    //   id: 'department',
    //   icon: faBriefcase,
    //   label: 'Department',
    // },

    // {
    //   id: 'designation',
    //   icon: faIdBadge,
    //   label: 'Designation',
    // },

    // {
    //   id: 'user-register',
    //   icon: faUserPlus,
    //   label: 'User Register',
    // },

    // Reports Dropdown
    {
      id: 'reports',
      icon: faChartBar,
      label: 'Reports',
      hasSubMenu: true,
      subItems: [
        {
          id: 'nr-report',
          label: 'NR Report',
        },
        {
          id: 'ignition-disconnect',
          label: 'Ignition Disconnect',
        },
        {
          id: 'data-delay',
          label: 'Data Delay',
        },
      ],
    },
  ];

  return (
    <Motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800 w-64 h-full text-white shadow-xl border-r border-gray-700 flex flex-col overflow-hidden"
    >
      {/* Logo Section */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="p-4 border-b border-gray-700 flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <Motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">T</span>
          </Motion.div>

          <div>
            <h2 className="text-base font-bold">Telogix</h2>
            <p className="text-xs text-gray-400">Management</p>
          </div>
        </div>
      </Motion.div>

      {/* Navigation Menu */}
      <nav className="p-3 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isSubItemActive =
              item.hasSubMenu &&
              item.subItems?.some(
                (subItem) => activeItem === subItem.id
              );

            const isActive =
              activeItem === item.id ||
              isSubItemActive ||
              (item.hasSubMenu && expandedMenus[item.id]);

            return (
              <Motion.li
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.3,
                }}
              >
                {/* Main Menu Item */}
                <Motion.button
                  type="button"
                  aria-expanded={item.hasSubMenu ? Boolean(expandedMenus[item.id]) : undefined}
                  whileHover={{
                    scale: 1.01,
                    x: 3,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className={`
                    w-full flex cursor-pointer items-center justify-between
                    gap-2 px-3 py-2.5 rounded-lg
                    transition-all duration-200 text-sm
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  onClick={() =>
                    handleItemClick(item.id, item.hasSubMenu)
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Motion.div
                      whileHover={{ rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="w-4 h-4"
                      />
                    </Motion.div>

                    <span className="font-medium text-sm">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Badge */}
                    {item.badge && (
                      <Motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                        }}
                        className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center"
                      >
                        {item.badge}
                      </Motion.span>
                    )}

                    {/* Dropdown Arrow */}
                    {item.hasSubMenu && (
                      <Motion.div
                        animate={{
                          rotate: expandedMenus[item.id] ? 90 : 0,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="text-xs w-3 h-3"
                        />
                      </Motion.div>
                    )}
                  </div>
                </Motion.button>

                {/* Sub Menu */}
                {item.hasSubMenu && (
                  <Motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: expandedMenus[item.id] ? 'auto' : 0,
                      opacity: expandedMenus[item.id] ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="ml-3 mt-1 space-y-0.5">
                      {item.subItems.map(
                        (subItem, subIndex) => (
                          <Motion.button
                            type="button"
                            tabIndex={expandedMenus[item.id] ? 0 : -1}
                            aria-current={activeItem === subItem.id ? 'page' : undefined}
                            key={subItem.id}
                            initial={{
                              opacity: 0,
                              x: -10,
                            }}
                            animate={{
                              opacity: expandedMenus[item.id]
                                ? 1
                                : 0,
                              x: expandedMenus[item.id]
                                ? 0
                                : -10,
                            }}
                            transition={{
                              delay: subIndex * 0.1,
                            }}
                            whileHover={{
                              scale: 1.01,
                              x: 3,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            className={`
                              w-full flex cursor-pointer
                              items-center gap-2 px-3 py-2 mt-1
                              rounded-md transition-all duration-200
                              text-xs
                              ${
                                activeItem === subItem.id
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }
                            `}
                            onClick={() =>
                              handleSubItemClick(subItem.id)
                            }
                          >
                            {/* Dot */}
                            <div
                              className={`
                                w-1.5 h-1.5 rounded-full
                                bg-current opacity-70
                                ${
                                  activeItem === subItem.id
                                    ? 'bg-white'
                                    : ''
                                }
                              `}
                            />

                            <span className="font-medium">
                              {subItem.label}
                            </span>
                            {subItem.comingSoon && <span className="ml-auto rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300">Soon</span>}
                          </Motion.button>
                        )
                      )}
                    </div>
                  </Motion.div>
                )}
              </Motion.li>
            );
          })}
        </ul>
      </nav>
    </Motion.aside>
  );
};

export default Sidebar;

