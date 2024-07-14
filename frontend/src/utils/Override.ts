import { request } from "../utils/axios";

const overrideBooking = async(bookingID: string) => {
    console.log(`overriding ${bookingID}`);
    request.patch(`/bookings/${bookingID}/overrideBooking`);
}

export default overrideBooking;