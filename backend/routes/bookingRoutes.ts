import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getSingleBooking,
  getCurrentUserBookings,
} from "../controllers/bookingController";
import { getSingleProductReviews } from "../controllers/reviewController";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/full-auth";

import { Router } from "express";
const router = Router();

router.route("/").get(getAllBookings).post([authenticateUser], createBooking);
router
  .route("/showAllMyBookings")
  .get([authenticateUser], getCurrentUserBookings);

router
  .route("/:id")
  .get(getSingleBooking)
  .delete([authenticateUser], deleteBooking);

router.route("/:id/reviews").get(getSingleProductReviews);

export { router as bookingRouter };
