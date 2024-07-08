import moment from "moment";
import { Booking } from "../models/Booking";

export const bookingsNotCheckedInQuery = (start: string, end: string) =>
  Booking.find({
    isCheckedIn: false,
    start: { $lte: new Date(end) },
    // transforming a moment date to js date does not yield expected result
    // because it zeroes the utc format, so
    // this clusterfuck is there for $lt
    end: {
      $gte: new Date(start),
      // dumb way to get current date
      $lt: new Date(moment().add(10, "hours").format()),
    },
  });
