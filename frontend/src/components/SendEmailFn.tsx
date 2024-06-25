import { request } from "../utils/axios";

const sendEmailFn = async (booking_id: string, 
  isConfirmation: boolean,
  successFn: ()=>void = () => {},
  errorFn: ()=>void = () => {}
) => {
    console.log('sendEmail', booking_id)
    try {
      const {
        data: { success },
      } = await request.post('/bookings/sendEmail', {
        booking: booking_id,
        isConfirmation,
      });
      console.log('sendEmailResponse', success)
      if(success) {
        successFn()
      }
    } catch(error) {
      errorFn()
    }
  }

export default sendEmailFn;
