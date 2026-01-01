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

  const getStockStatus = (units) => {
    if (units >= 10) return { label: "High", color: "bg-green-100 text-green-800", icon: "✓" };
    if (units >= 5) return { label: "Medium", color: "bg-yellow-100 text-yellow-800", icon: "!" };
    return { label: "Critical", color: "bg-red-100 text-red-800", icon: "⚠" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="section-header">Blood Inventory</h1>
        <p className="section-subtitle text-base">Manage blood stock levels and availability</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchInventory}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Inventory</span>
        </button>
      </div>

      {/* Inventory Cards Grid */}
      {inventory.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600 text-lg font-medium">No inventory data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.map((item) => {
            const status = getStockStatus(item.unitsAvailable);
            const isEditing = editingId === item._id;

            return (
              <div key={item._id} className="card-premium p-6 flex flex-col">
                {/* Blood Group */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm font-medium mb-1">Blood Group</p>
                  <p className="text-3xl font-bold text-primary">{item.bloodGroup}</p>
                </div>

                {/* Stock Status Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${status.color} w-fit mb-4`}>
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </div>

                {/* Units Available */}
                <div className="flex-1 mb-4">
                  <p className="text-gray-600 text-sm font-medium mb-2">Units Available</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editUnits}
                      onChange={(e) => setEditUnits(e.target.value)}
                      className="input-premium text-lg font-semibold"
                      min="0"
                      autoFocus
                    />
                  ) : (
                    <p className="text-4xl font-bold text-gray-900">{item.unitsAvailable}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(item._id)}
                        className="flex-1 btn-primary py-2 text-sm font-semibold flex items-center justify-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 btn-secondary py-2 text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 btn-outline py-2 text-sm font-semibold flex items-center justify-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}