import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { request } from "../utils/axios";



const MyBookings  = () => {
    // fetch data
    const [bookings, setBookings] = useState('');


    const navigate = useNavigate();
    const checkLoggedIn = async () => {
        try {
        await request.get("/users/showMe");
        } catch (e) {
        console.log(e);
        }
    };
    const getBookings = async () => {
        try {
            const resp = await request.get("/bookings/showAllMyBookings");
            const data = resp.data;
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        checkLoggedIn();
        getBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>
        <h1> |{bookings}| </h1>
        <h1> hi </h1>
    </>
    // <h1> Bookings here </h1>
};

export default MyBookings;
