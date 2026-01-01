import { useEffect, useState } from "react";
import api from "../services/api";

export default function BloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const fetchBloodRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getAllBloodRequests();
      setRequests(response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load blood requests");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      await api.approveBloodRequest(requestId);
      await fetchBloodRequests();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      await api.rejectBloodRequest(requestId);
      await fetchBloodRequests();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading blood requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Blood Requests</h2>
        <button
          onClick={fetchBloodRequests}
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
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Units</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No blood requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {request.userId?.email || request.userId?.name || "N/A"}
                  </td>
                  <td className="p-3 font-medium">{request.bloodGroup}</td>
                  <td className="p-3">{request.unitsRequested}</td>
                  <td className="p-3">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">{getStatusBadge(request.status)}</td>
                  <td className="p-3">
                    {request.status.toLowerCase() === "pending" ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processingId === request._id}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === request._id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={processingId === request._id}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">No action needed</span>
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