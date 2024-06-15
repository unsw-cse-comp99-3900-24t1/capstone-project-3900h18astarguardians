import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";
import type { mongooseRoomI, mongooseRoomMethodsI } from "../types";

type OrderModel = Model<
  mongooseRoomI,
  Record<string, never>,
  mongooseRoomMethodsI
>;

const roomSchema = new Schema<mongooseRoomI, OrderModel, mongooseRoomMethodsI>({
  name: {
    type: String,
    required: [true, "an room must have a name"],
  },
  size: {
    type: Number,
    required: [true, "an room must have a size"],
  },
  type: {
    type: String,
    required: [true, "an room must have a type"],
  },
});
export const Room = model<mongooseRoomI, OrderModel>("Room", roomSchema);
