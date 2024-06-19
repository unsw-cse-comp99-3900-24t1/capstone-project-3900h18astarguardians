import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";
import type { mongooseBookingI, mongooseBookingMethods } from "../types";
import moment from "moment";
type BookingModel = Model<
  mongooseBookingI,
  Record<string, never>,
  mongooseBookingMethods
>;

const bookingSchema = new Schema<
  mongooseBookingI,
  BookingModel,
  mongooseBookingMethods
>({
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "A booking must have an associated room"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A booking must have an associated user"],
  },
  start: {
    type: Date,
    required: [true, "A booking must have an associated start time"],
  },
  end: {
    type: Date,
    required: [true, "A booking must have an associated end time"],
  },
  duration: {
    type: Number,
    min: 1,
    max: 8,
  },
});
// bookingSchema.virtual("end").get(function () {
//   return moment(this.start as unknown as Date).add(this.duration, "hours");
// });
export const Booking = model<mongooseBookingI, BookingModel>(
  "Booking",
  bookingSchema
);
