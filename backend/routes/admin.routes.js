import express from 'express';
import { adminLogin,getAllUsers,deleteUser,adminlogout } from '../controllers/admin.controller.js';
import { getAllDonations, approveDonation, rejectDonation } from "../controllers/donor.controller.js";
import { getAllBloodRequests, approveBloodRequest, rejectBloodRequest } from "../controllers/Bloodrequest.controller.js";
import { verifyJWT, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/login', adminLogin);

// Admin donation routes
router.get('/donations', verifyJWT, isAdmin, getAllDonations);
router.patch('/donations/:donationId/approve', verifyJWT, isAdmin, approveDonation);
router.patch('/donations/:donationId/reject', verifyJWT, isAdmin, rejectDonation);

// Admin blood request routes
router.get('/blood-requests', verifyJWT, isAdmin, getAllBloodRequests);
router.patch('/blood-requests/:requestId/approve', verifyJWT, isAdmin, approveBloodRequest);
router.patch('/blood-requests/:requestId/reject', verifyJWT, isAdmin, rejectBloodRequest);
router.get('/users', verifyJWT, isAdmin, getAllUsers);
router.delete('/users/:id', verifyJWT, isAdmin, deleteUser);
router.post('/logout', verifyJWT, isAdmin, adminlogout);
export default router;