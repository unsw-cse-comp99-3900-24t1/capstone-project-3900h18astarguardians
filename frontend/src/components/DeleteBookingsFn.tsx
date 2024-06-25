import { request } from "../utils/axios";

const deleteBookingsFn = async (event_id: string, 
  setIsLoading: (arg0: boolean)=>void,
  successFn: (msg: string)=>void,
  errorFn: (msg: string)=>void
) => {
    console.log('deleteBookings', event_id)
    try {
      setIsLoading(true);
      const {
        data: { success },
      } = await request.delete(`/bookings/${event_id}`);
      console.log('deleteBookingsResponse', success)
      if(success) {
        successFn("Successfully delete bookings")
      }
    } catch(error) {
      errorFn("Failed to delete bookings")
    } finally {
      setIsLoading(false);
    }
  }

export default deleteBookingsFn;
