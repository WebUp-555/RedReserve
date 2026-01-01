import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getMyBloodRequests();
      setRequests(response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load blood requests");
      console.error(err);
    } finally {
      setLoading(false);
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
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const getUrgencyBadge = (urgency) => {
    const styles = {
      normal: "bg-gray-100 text-gray-800",
      urgent: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[urgency.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {urgency}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Blood Requests</h2>
        <button
          onClick={() => navigate("/request")}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          + New Request
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Requests Yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't submitted any blood requests yet.
          </p>
          <button
            onClick={() => navigate("/request")}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
          >
            Submit Your First Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      {request.bloodGroup}
                    </span>
                    <span className="text-gray-600">
                      {request.unitsRequested} {request.unitsRequested === 1 ? "unit" : "units"}
                    </span>
                    {getUrgencyBadge(request.urgency || "normal")}
                  </div>
                  <p className="text-sm text-gray-500">
                    Submitted on {new Date(request.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>{getStatusBadge(request.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {request.hospitalName && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Hospital</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.hospitalName}
                    </p>
                  </div>
                )}
                {request.contactNumber && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Contact</p>
                    <p className="text-sm font-medium text-gray-900">
                      {request.contactNumber}
                    </p>
                  </div>
                )}
              </div>

              {request.reason && (
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Reason</p>
                  <p className="text-sm text-gray-700">{request.reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> All requests are reviewed by our admin team. 
          You will be contacted once your request is approved.
        </p>
      </div>
    </div>
  );
}
