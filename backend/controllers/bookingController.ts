import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import { mongooseBookingI, tokenUserI } from "../types";
import cloudinary from "cloudinary";
import { unlink } from "fs/promises";
import type { fileI } from "../types";
import { DateTime } from "luxon";
import { Room } from "../models/Room";
import { Booking } from "../models/Booking";
import moment from "moment";
import mongoose from "mongoose";
import internal from "stream";

// check that the booking doesent clash with any other bookings
// check that user and room exists

interface createBookingBody {
  room: string;
  duration: number;
  start: Date;
}

const createBooking = async (
  {
    body: { room: roomId, duration, start },
    user: { userId },
  }: { body: createBookingBody; user: tokenUserI },
  res: Response
) => {
  // check that the user is able to book that type of room, we will do this by adding a 'whoCanBook' field in the room model which is a space
  // seperate list of types of users who can book it (e.g. ['hdr_student', 'cse_staff']), we'll do this later

  // check that room exists
  const roomExists = await Room.findById(roomId);

  if (!roomExists) throw new BadRequestError(`No room with id: ${roomId}`);

  // wanna add the duration hours to the start date to get the date range which the booking will be, thus
  // allowing us to check if there are any bookings of the same room within that date and if so, throw an error
  const end = moment(start).add(duration, "hours");

  const isClashing = await Booking.find({
    start: {
      $lt: end,
    },
    end: {
      $gt: start,
    },
    room: roomId,
  });

  if (isClashing.length)
    throw new BadRequestError(
      `This booking clashes with an already existing booking`
    );

  const booking = await Booking.create({
    room: roomId,
    duration,
    start,
    user: userId,
    end,
  });
  res.status(StatusCodes.CREATED).json({ booking });
};
// check for 'active' bookings, that is, a booking from now to the future, not one that has already passes
const getCurrentUserBookings = async (
  { user: { userId }, query: {} }: Request,
  res: Response
) => {
  const bookings = await Booking.find({ user: userId })
    .populate({
      path: "room",
      select: "name size type",
    })
    .sort("start");

  res.status(StatusCodes.OK).json({ count: bookings.length, bookings });
};

const getAllBookings = async (req: Request, res: Response) => {
  const bookings = await Booking.find({})
    .populate({
      path: "room",
      select: "name size type",
    })
    .populate({
      path: "user",
      select: "name email zid type",
    })
    .sort("start");

  res.status(StatusCodes.OK).json({ count: bookings.length, bookings });
};
const getSingleBooking = async (
  { params: { id: bookingId } }: Request,
  res: Response
) => {
  const booking = await Booking.findOne({ _id: bookingId });

  if (!booking)
    throw new BadRequestError(`There is no room with id ${bookingId}`);

  res.status(StatusCodes.OK).json({ booking });
};

const deleteBooking = async (
  { params: { id: bookingId } }: Request,
  res: Response
) => {
  const bookingToDelete = await Booking.findById(bookingId);
  if (!bookingToDelete)
    throw new BadRequestError(`No product with id ${bookingId}`);

  await bookingToDelete.deleteOne();
  res.status(StatusCodes.OK).json({ success: "booking deleted" });
};

export {
  createBooking,
  getAllBookings,
  getSingleBooking,
  deleteBooking,
  getCurrentUserBookings,
};
