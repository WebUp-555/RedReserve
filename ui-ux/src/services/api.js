const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Determine which token to use based on the endpoint
    let token;
    if (endpoint.startsWith('/api/admin') || 
        endpoint.startsWith('/api/inventory')) {
      token = localStorage.getItem('adminToken');
    } else {
      token = localStorage.getItem('userToken');
    }
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please make sure the backend is running.');
      }
      
      const data = await response.json();

      if (!response.ok) {
        // Extract meaningful error message from backend
        const errorMessage = data.message || data.error || 'Something went wrong';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // If it's already our custom error, rethrow it
      if (error.message) {
        throw error;
      }
      // Handle network errors
      throw new Error('Network error. Please check your connection.');
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request('/api/auth/refresh-token', {
      method: 'POST',
    });
  }

  // Inventory endpoints
  async getInventory() {
    return this.request('/api/inventory');
  }

  async updateInventory(id, data) {
    return this.request(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createInventory(data) {
    return this.request('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteInventory(id) {
    return this.request(`/api/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  // Blood Request endpoints
  async getBloodRequests() {
    return this.request('/api/blood-requests');
  }

  async createBloodRequest(data) {
    return this.request('/api/blood-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBloodRequest(id, data) {
    return this.request(`/api/blood-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Donor endpoints
  async getDonors() {
    return this.request('/api/donations');
  }

  async createDonor(data) {
    return this.request('/api/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyDonations() {
    return this.request('/api/donations/me');
  }

  async updateDonor(id, data) {
    return this.request(`/api/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Blood Request endpoints
  async getBloodRequests() {
    return this.request('/api/blood-requests');
  }

  async createBloodRequest(data) {
    return this.request('/api/blood-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBloodRequests() {
    return this.request('/api/blood-requests/me');
  }

  async updateBloodRequest(id, data) {
    return this.request(`/api/blood-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  async adminLogin(credentials) {
    return this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async adminLogout() {
    return this.request('/api/admin/logout', {
      method: 'POST',
    });
  }

  async getUsers() {
    return this.request('/api/admin/users');
  }

  async deleteUser(id) {
    return this.request(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAllDonations() {
    return this.request('/api/admin/donations');
  }

  async approveDonation(donationId) {
    return this.request(`/api/admin/donations/${donationId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectDonation(donationId) {
    return this.request(`/api/admin/donations/${donationId}/reject`, {
      method: 'PATCH',
    });
  }

  async getAllBloodRequests() {
    return this.request('/api/admin/blood-requests');
  }

  async approveBloodRequest(requestId) {
    return this.request(`/api/admin/blood-requests/${requestId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectBloodRequest(requestId) {
    return this.request(`/api/admin/blood-requests/${requestId}/reject`, {
      method: 'PATCH',
    });
  }
}

export default new ApiService();
