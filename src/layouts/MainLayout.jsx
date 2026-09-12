import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // Open sidebar on desktop, closed on mobile
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-[100vh] overflow-hidden bg-gray-50 flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Full Height */}
      <AnimatePresence>
        {!isMobile && isSidebarOpen && (
          <motion.div
            initial={{ x: -256, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -256, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-64 h-screen flex-shrink-0"
          >
            <Sidebar onItemClick={() => isMobile && setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed z-60 w-64 h-screen"
          >
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Section with Header and Content */}
      <motion.div
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col min-w-0"
      >
        {/* Header - Only above content area */}
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content Area - Scrollable */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex-1 overflow-auto"
        >
          <div className="p-2 sm:p-4 w-full max-w-full">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MainLayout;
