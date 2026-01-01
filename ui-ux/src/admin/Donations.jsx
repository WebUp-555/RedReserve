import { useEffect, useState } from "react";
import api from "../services/api";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.getAllDonations();
      setDonations(response.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load donations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (donationId) => {
    try {
      setProcessingId(donationId);
      await api.approveDonation(donationId);
      await fetchDonations();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to approve donation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (donationId) => {
    try {
      setProcessingId(donationId);
      await api.rejectDonation(donationId);
      await fetchDonations();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to reject donation");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
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
        <p className="text-gray-500">Loading donations...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Donation Records</h2>
        <button
          onClick={fetchDonations}
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
              <th className="p-3 text-left">Donor</th>
              <th className="p-3 text-left">Blood Group</th>
              <th className="p-3 text-left">Units</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No donation records found
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {donation.donorId?.email ||
                      donation.donorId?.name ||
                      "N/A"}
                  </td>
                  <td className="p-3 font-medium">{donation.bloodGroup}</td>
                  <td className="p-3">{donation.units || 1}</td>
                  <td className="p-3">
                    {donation.appointmentDate
                      ? new Date(donation.appointmentDate).toLocaleDateString()
                      : new Date(donation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">{getStatusBadge(donation.status)}</td>
                  <td className="p-3">
                    {donation.status.toLowerCase() === "pending" ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleApprove(donation._id)}
                          disabled={processingId === donation._id}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === donation._id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(donation._id)}
                          disabled={processingId === donation._id}
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