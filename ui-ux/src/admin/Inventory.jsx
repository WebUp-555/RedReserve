import { useEffect, useState } from "react";
import api from "../services/api";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUnits, setEditUnits] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.getInventory();
      setInventory(response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load inventory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditUnits(item.unitsAvailable);
  };

  const handleSave = async (id) => {
    try {
      await api.updateInventory(id, { unitsAvailable: parseInt(editUnits) });
      await fetchInventory();
      setEditingId(null);
      setEditUnits("");
    } catch (err) {
      setError(err.message || "Failed to update inventory");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUnits("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Blood Inventory</h2>
        <button
          onClick={fetchInventory}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Units Available</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">
                  No inventory data available
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.bloodGroup}</td>
                  <td className="p-3">
                    {editingId === item._id ? (
                      <input
                        type="number"
                        value={editUnits}
                        onChange={(e) => setEditUnits(e.target.value)}
                        className="border rounded px-2 py-1 w-24"
                        min="0"
                      />
                    ) : (
                      <span
                        className={
                          item.unitsAvailable < 5
                            ? "text-red-600 font-semibold"
                            : ""
                        }
                      >
                        {item.unitsAvailable}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === item._id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleSave(item._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}