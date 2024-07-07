import { Room } from "../models/Room";

export const availableBetweenQuery = (start: Date, end: Date) =>
  Room.aggregate()
    .lookup({
      from: "bookings",
      localField: "_id",
      foreignField: "room",
      as: "bookings",
    })
    .match({
      bookings: {
        $not: {
          $elemMatch: {
            start: { $lt: end },
            end: { $gt: start },
          },
        },
      },
    })
    .project({
      bookings: 0,
    });
