# RedReserve UI Configuration

## Environment Variables

Create a `.env` file in the `ui-ux` directory with the following variable:

```
VITE_API_URL=http://localhost:5000
```

## API Integration

The frontend is now connected to the backend API. All API calls are handled through the `src/services/api.js` service.

### Available API Methods

**Authentication:**
- `api.register(userData)` - Register a new user
- `api.login(credentials)` - Login with email/password
- `api.logout()` - Logout user
- `api.refreshToken()` - Refresh access token

**Inventory:**
- `api.getInventory()` - Get all inventory items
- `api.createInventory(data)` - Create inventory item
- `api.updateInventory(id, data)` - Update inventory item
- `api.deleteInventory(id)` - Delete inventory item

**Blood Requests:**
- `api.getBloodRequests()` - Get all blood requests
- `api.createBloodRequest(data)` - Create blood request
- `api.updateBloodRequest(id, data)` - Update blood request

**Donors:**
- `api.getDonors()` - Get all donors
- `api.createDonor(data)` - Create donor record
- `api.updateDonor(id, data)` - Update donor record

**Admin:**
- `api.getAdminStats()` - Get dashboard statistics
- `api.getUsers()` - Get all users

## Usage Example

```javascript
import api from '../services/api';

// Login example
const handleLogin = async () => {
  try {
    const response = await api.login({ email, password });
    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};
```

## Authentication

- Tokens are stored in localStorage
- Cookies are used for HTTP-only tokens (backend managed)
- Use `useAuth` hook for authentication state
- Use `ProtectedRoute` component to protect routes

## Running the Application

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd ui-ux && npm run dev`
3. Backend runs on port 5000
4. Frontend runs on port 5173
