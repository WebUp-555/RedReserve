import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonateBlood() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodGroup: "",
    appointmentDate: "",
    medicalHistory: "",
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

    if (!formData.bloodGroup || !formData.appointmentDate) {
      setError("Please fill in all required fields");
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Appointment date must be today or in the future");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.createDonor(formData);
      
      if (response.statusCode === 201 || response.success) {
        setSuccess("Donation appointment booked successfully! Waiting for admin approval.");
        setTimeout(() => {
          navigate("/my-donations");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to book donation appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Book Blood Donation Appointment
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
          <div>
            <label
              htmlFor="bloodGroup"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blood Group <span className="text-red-600">*</span>
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
              htmlFor="appointmentDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferred Appointment Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              required
              value={formData.appointmentDate}
              onChange={handleChange}
              disabled={isLoading}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="medicalHistory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Medical History (Optional)
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows="4"
              value={formData.medicalHistory}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Please mention any medical conditions, medications, or recent surgeries..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Before Donating Blood:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Get a good night's sleep</li>
              <li>• Eat a healthy meal before donation</li>
              <li>• Drink plenty of water</li>
              <li>• Bring a valid ID</li>
              <li>• Avoid alcohol 24 hours before donation</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Booking..." : "Book Appointment"}
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
