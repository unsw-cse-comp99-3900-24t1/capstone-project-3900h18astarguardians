import React, { useEffect, useState } from 'react';
import { useGlobalContext } from "../utils/context";
import { request } from "../utils/axios";

const Reports  = () => {
  const { token } = useGlobalContext();
  const [isAdmin, setIsAdmin] = useState(false);

  // ensure token tells us an admin is viewing this page
  useEffect(() => {
    if (token?.type === "admin") {
      setIsAdmin(true);
    }
    fetchReports();


  }, [])

  const fetchReports = async () => {
    const data = {
      "start": "2024-07-06T14:00:00.373Z",
      "end": "2023-07-23T14:00:00.373Z"
    }

    const usageResponse = await request.get('/bookings/usageReport', {data});
    console.log(usageResponse);

  }
  


  return <>
   {!isAdmin && <h1>Only admins can see Usage reports!</h1>}
   {isAdmin &&
    <h1>Reports</h1>

   }
  </>
};

export default Reports;
