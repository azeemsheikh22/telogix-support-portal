import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Department = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "IT Support" },
    { id: 2, name: "Billing" },
    { id: 3, name: "Sales" },
    { id: 4, name: "HR" },
  ]);

  const [formData, setFormData] = useState({ name: "" });
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

    if (!formData.name.trim()) {
      alert("Please enter department name");
      return;
    }

    if (editingId) {
      // Update department
      setDepartments(
        departments.map((dept) =>
          dept.id === editingId ? { ...dept, name: formData.name } : dept
        )
      );
      setEditingId(null);
    } else {
      // Create new department
      const newDept = {
        id: Math.max(...departments.map((d) => d.id), 0) + 1,
        name: formData.name,
      };
      setDepartments([...departments, newDept]);
    }

    setFormData({ name: "" });
  };

  // Handle edit
  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({ name: dept.name });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((dept) => dept.id !== id));
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department</h1>
        </div>
      </div>

      {/* Create/Update Form */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          {editingId ? "Update Department" : "Create Department"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer font-medium"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              {editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors cursor-pointer font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {departments.length === 0 ? (
          <p className="text-center text-gray-500 py-8 text-sm">
            No departments found
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
                    Name
                  </th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr
                    key={dept.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {dept.id}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {dept.name}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(dept)}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer font-medium"
                        >
                          <FontAwesomeIcon icon={faPencil} className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors cursor-pointer font-medium"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Department;
