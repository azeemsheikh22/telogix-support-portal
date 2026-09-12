import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
import Select from "react-select";

const UserRegister = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "john_doe",
      fullName: "John Doe",
      email: "john@example.com",
      roleId: 1,
      role: "Admin",
      departmentId: 1,
      department: "IT Support",
      designationId: 1,
      designation: "Manager",
    },
    {
      id: 2,
      username: "jane_smith",
      fullName: "Jane Smith",
      email: "jane@example.com",
      roleId: 2,
      role: "User",
      departmentId: 2,
      department: "Billing",
      designationId: 2,
      designation: "Developer",
    },
  ]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    roleId: null,
    departmentId: null,
    designationId: null,
  });

  const [editingId, setEditingId] = useState(null);

  // Sample data for dropdowns
  const roles = [
    { value: 1, label: "Admin" },
    { value: 2, label: "User" },
    { value: 3, label: "Agent" },
  ];

  const departments = [
    { value: 1, label: "IT Support" },
    { value: 2, label: "Billing" },
    { value: 3, label: "Sales" },
    { value: 4, label: "HR" },
  ];

  const designations = [
    { value: 1, label: "Manager" },
    { value: 2, label: "Developer" },
    { value: 3, label: "Designer" },
    { value: 4, label: "Analyst" },
  ];

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle select change
  const handleSelectChange = (name, option) => {
    setFormData({
      ...formData,
      [name]: option ? option.value : null,
    });
  };

  // Handle create/update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim() || !formData.fullName.trim() || !formData.email.trim()) {
      alert("Please fill all required fields");
      return;
    }

    if (!formData.roleId || !formData.departmentId || !formData.designationId) {
      alert("Please select role, department, and designation");
      return;
    }

    const roleLabel = roles.find((r) => r.value === formData.roleId)?.label || "";
    const departmentLabel = departments.find((d) => d.value === formData.departmentId)?.label || "";
    const designationLabel = designations.find((d) => d.value === formData.designationId)?.label || "";

    if (editingId) {
      // Update user
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? {
                ...user,
                username: formData.username,
                fullName: formData.fullName,
                email: formData.email,
                roleId: formData.roleId,
                role: roleLabel,
                departmentId: formData.departmentId,
                department: departmentLabel,
                designationId: formData.designationId,
                designation: designationLabel,
              }
            : user
        )
      );
      setEditingId(null);
    } else {
      // Create new user
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        roleId: formData.roleId,
        role: roleLabel,
        departmentId: formData.departmentId,
        department: departmentLabel,
        designationId: formData.designationId,
        designation: designationLabel,
      };
      setUsers([...users, newUser]);
    }

    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      roleId: null,
      departmentId: null,
      designationId: null,
    });
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      password: "",
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
      departmentId: user.departmentId,
      designationId: user.designationId,
    });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      roleId: null,
      departmentId: null,
      designationId: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register</h1>
        </div>
      </motion.div>

      {/* Create/Update Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow border border-gray-200 p-5"
      >
        <h2 className="text-base font-bold text-gray-800 mb-4">
          {editingId ? "Update User" : "Register New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <Select
                options={roles}
                value={roles.find((r) => r.value === formData.roleId) || null}
                onChange={(option) => handleSelectChange("roleId", option)}
                placeholder="Select role"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "36px",
                    fontSize: "14px",
                  }),
                }}
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <Select
                options={departments}
                value={departments.find((d) => d.value === formData.departmentId) || null}
                onChange={(option) => handleSelectChange("departmentId", option)}
                placeholder="Select department"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "36px",
                    fontSize: "14px",
                  }),
                }}
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation *
              </label>
              <Select
                options={designations}
                value={designations.find((d) => d.value === formData.designationId) || null}
                onChange={(option) => handleSelectChange("designationId", option)}
                placeholder="Select designation"
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "36px",
                    fontSize: "14px",
                  }),
                }}
              />
            </div>
          </div>

          <div className="flex gap-2.5">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              {editingId ? "Update User" : "Register User"}
            </motion.button>

            {editingId && (
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors cursor-pointer font-medium"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
      >
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">
            No users found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user.department}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {user.designation}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(user)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer font-medium"
                        >
                          <FontAwesomeIcon icon={faPencil} className="text-xs" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(user.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors cursor-pointer font-medium"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UserRegister;
