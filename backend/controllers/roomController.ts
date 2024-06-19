import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Room } from "../models/Room";
import { BadRequestError } from "../errors";
import { mongooseRoomI, tokenUserI } from "../types";
import cloudinary from "cloudinary";
import { unlink } from "fs/promises";
import type { fileI } from "../types";
import { Review } from "../models/Review";
import mongoose from "mongoose";

const createRoom = async (
  { body, user }: { body: mongooseRoomI; user: tokenUserI },
  res: Response
) => {
  const room = await Room.create({ ...body });
  res.status(StatusCodes.CREATED).json({ room });
};

const getAllRooms = async (req: Request, res: Response) => {
  const rooms = await Room.find({});

  res.status(StatusCodes.OK).json({ count: rooms.length, rooms });
};
const getSingleRoom = async (
  { params: { id: roomId } }: Request,
  res: Response
) => {
  const product = await Room.findOne({ _id: roomId });

  if (!product) throw new BadRequestError(`There is no room with id ${roomId}`);

  res.status(StatusCodes.OK).json({ product });
};

const updateRoom = async (
  { body, params: { id: roomId } }: Request,
  res: Response
) => {
  const updatedRoom = await Room.findOneAndUpdate({ _id: roomId }, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedRoom) throw new BadRequestError(`No room with id ${roomId}`);

  res.status(StatusCodes.OK).json({ updatedRoom });
};
const deleteRoom = async (
  { params: { id: roomId } }: Request,
  res: Response
) => {
  const roomToDelete = await Room.findById(roomId);
  if (!roomToDelete) throw new BadRequestError(`No product with id ${roomId}`);

  await roomToDelete.deleteOne();
  res.status(StatusCodes.OK).json({ success: "product deleted" });
};

export { createRoom, getAllRooms, getSingleRoom, updateRoom, deleteRoom };
