import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RequestBlood() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodGroup: "",
    unitsRequested: 1,
    urgency: "normal",
    reason: "",
    hospitalName: "",
    contactNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.bloodGroup || !formData.reason || !formData.hospitalName || !formData.contactNumber) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.unitsRequested < 1 || formData.unitsRequested > 10) {
      setError("Units requested must be between 1 and 10");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.createBloodRequest(formData);
      
      if (response.statusCode === 201 || response.success) {
        setSuccess("Blood request submitted successfully! Waiting for admin approval.");
        setTimeout(() => {
          navigate("/my-requests");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to submit blood request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Request Blood
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="bloodGroup"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blood Group Required <span className="text-red-600">*</span>
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                required
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="unitsRequested"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Units Requested <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="unitsRequested"
                name="unitsRequested"
                required
                min="1"
                max="10"
                value={formData.unitsRequested}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="urgency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Urgency Level <span className="text-red-600">*</span>
            </label>
            <select
              id="urgency"
              name="urgency"
              required
              value={formData.urgency}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="hospitalName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hospital Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="hospitalName"
              name="hospitalName"
              required
              value={formData.hospitalName}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter hospital name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contact Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter contact number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Request <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="4"
              required
              value={formData.reason}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Please describe the reason for blood requirement..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your request will be reviewed by our admin team. 
              You will be notified once it's approved. Please ensure all information is accurate.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
