import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Room } from "../models/Room";
import { BadRequestError } from "../errors";
import { mongooseRoomI, tokenUserI } from "../types";

const createRoom = async (
  { body, user }: { body: mongooseRoomI; user: tokenUserI },
  res: Response
) => {
  const room = await Room.create({ ...body });
  res.status(StatusCodes.CREATED).json({ room });
};

const getAllRooms = async ({ user: { type } }: Request, res: Response) => {
  let rooms;
  if (type === "admin") rooms = Room.find({ $nor: [{ type: "normal" }] });
  if (type === "cse_staff")
    rooms = Room.find({
      $or: [{ type: "meeting room" }, { type: "staff room" }],
    });
  if (type === "hdr_student") rooms = Room.find({ type: "hot desk" });
  if (type === "non_cse_staff") rooms = Room.find({ type: "meeting room" });

  const normalRooms = await Room.find({ type: "normal" });
  rooms = await rooms;

  const result = [...normalRooms, ...rooms!];
  res.status(StatusCodes.OK).json({ count: result.length, result });
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
