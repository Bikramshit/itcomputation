import express from 'express';
import { ApproveUser, changePasssword,  deleteMyProfile,  deleteUser,  forgetPassword,  getAllUsers,  getMyProfile, login, logout, MakeAdmin, register, resetPassword, updateProfile } from '../controllers/userController.js';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

// Register routes
router.route('/register').post(register);

// Login routes
router.route('/login').post(login);
// Logout routes
router.route('/logout').get(logout);

// get my profile
router.route('/profile').get(isAuthenticated ,getMyProfile);
router.route('/profile').delete( isAuthenticated, deleteMyProfile);

// change password
router.route('/change-password').put(isAuthenticated ,changePasssword);

// Update Profile
router.route('/update-profile').put(isAuthenticated ,updateProfile);

// Forget password
router.route("/forgot-password").post(forgetPassword);

// Reset password
router.route("/reset-password/:token").put(isAuthenticated ,resetPassword);

// Admin Only

router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

router.route("/admin/user/:id").put(isAuthenticated, authorizeAdmin, ApproveUser).delete(isAuthenticated,authorizeAdmin,deleteUser);






export default router;