import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";

const Designation = () => {
  const [designations, setDesignations] = useState([
    { id: 1, title: "Manager", description: "Team lead and manager" },
    { id: 2, title: "Developer", description: "Software developer" },
    { id: 3, title: "Designer", description: "UI/UX designer" },
    { id: 4, title: "Analyst", description: "Business analyst" },
  ]);

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle create/update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter designation title");
      return;
    }

    if (editingId) {
      // Update designation
      setDesignations(
        designations.map((desig) =>
          desig.id === editingId ? { ...desig, title: formData.title, description: formData.description } : desig
        )
      );
      setEditingId(null);
    } else {
      // Create new designation
      const newDesig = {
        id: Math.max(...designations.map((d) => d.id), 0) + 1,
        title: formData.title,
        description: formData.description,
      };
      setDesignations([...designations, newDesig]);
    }

    setFormData({ title: "", description: "" });
  };

  // Handle edit
  const handleEdit = (desig) => {
    setEditingId(desig.id);
    setFormData({ title: desig.title, description: desig.description });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      setDesignations(designations.filter((desig) => desig.id !== id));
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "" });
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
          <h1 className="text-2xl font-bold text-gray-900">Designation</h1>
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
          {editingId ? "Update Designation" : "Create Designation"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter designation title"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
              rows="3"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none"
            />
          </div>

          <div className="flex gap-2.5">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              {editingId ? "Update" : "Create"}
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

      {/* Designations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
      >
        {designations.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">
            No designations found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 text-sm">
                    ID
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 text-sm">
                    Title
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 text-sm">
                    Description
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {designations.map((desig, index) => (
                  <motion.tr
                    key={desig.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {desig.id}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {desig.title}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {desig.description}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleEdit(desig)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer font-medium"
                        >
                          <FontAwesomeIcon icon={faPencil} className="text-xs" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(desig.id)}
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

export default Designation;
