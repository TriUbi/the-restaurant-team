import { ChangeEvent, useEffect, useState } from "react";
import "./../styles/Admin.scss";
import { IBooking } from "../models/IBooking";
import axios from "axios";
import { Bookings } from "../models/Booking";

export const Admin = () => {
  const restaurantID = "65cdf38894d2af1c6aeae91d";

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showLogIn, setShowLogIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showBookingDone, setShowBookingDone] = useState(true);

  const [showChange, setShowChange] = useState(false);
  const [bookingToUpdate, setBookingToUpdate] = useState<IBooking>({
    _id: "",
    restaurantId: restaurantID,
    date: "",
    time: "",
    numberOfGuests: 0,
    customerId: "",
  });
  const [updatedBooking, setUpdatedBooking] = useState<IBooking>({
    _id: "",
    restaurantId: restaurantID,
    date: "",
    time: "",
    numberOfGuests: 0,
    customerId: "",
  });

  useEffect(() => {
    axios
      .get<IBooking[]>(
        "https://school-restaurant-api.azurewebsites.net/booking/restaurant/65cdf38894d2af1c6aeae91d"
      )
      .then((response) => {
        setBookings([...response.data]);
      });
  }, []);

  const handleSwitch = () => {
    setShowLogIn(true);
    setShowButton(false);
  };
  const LogIn = () => {
    if (
      userName === "admin" ||
      (userName === "Admin" && password === "admin") ||
      password === "Admin"
    ) {
      setShowAdmin(true);
      setShowLogIn(false);
    }
  };
  const handleBookingChange = () => {
    setShowChange(true);
    setShowAdmin(false);
  };

  const sendChangedData = async (bookingID: string) => {
    setUpdatedBooking({
      ...updatedBooking,
      _id: bookingToUpdate._id,
      customerId: bookingToUpdate.customerId,
    });

    const updatedBookingData = {
      id: bookingToUpdate,
      restaurantId: restaurantID,
      date: updatedBooking.date,
      time: updatedBooking.time,
      numberOfGuests: updatedBooking.numberOfGuests,
      customerId: bookingToUpdate.customerId,
    };

    const response = await axios.put(
      "https://school-restaurant-api.azurewebsites.net/booking/update/" +
        bookingID,
      updatedBookingData
    );
  };
  const handleRemoveBooking = async (bookingID: string) => {
    const response = await axios.delete(
      "https://school-restaurant-api.azurewebsites.net/booking/delete/" +
        bookingID
    );
    setBookings((prevBookings) =>
      prevBookings.filter((Allbooking) => Allbooking._id !== bookingID)
    );

    setShowBookingDone(true);
  };

  const handleTimeChange = (time: string) => {
    setUpdatedBooking({ ...updatedBooking, time });
  };
  
  const handleUpdateBooking = () => {
    sendChangedData(bookingToUpdate._id);
  };
  
  return (
    <>
      <div className="body">
        {showButton && (
          <div>
            <button onClick={handleSwitch}>Log in</button>
          </div>
        )}
        {showLogIn && (
          <div className="container">
            <div className="container-div">
              <div className="input-div">
                <div className="div-text">
                  Welcome to the Adminpage <br />
                  Please log in to continue:
                </div>
                <div>
                  <div>
                    <input className="input-admin"
                      type="text"
                      placeholder="Användarnamn"
                      value={userName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setUserName(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <input className="input-admin"
                      type="password"
                      placeholder="Lösenord"
                      value={password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                    />
                  </div>
                  <div className="btn-div">
                    <button className="btn" onClick={LogIn}>
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAdmin && (
          <div className="container">
            <div className="admin-page">
              {bookings.map((allBookings) => {
                return (
                  <div key={allBookings._id} className="li-div">
                    <li key={allBookings._id}>
                      Booking ID:{allBookings._id} CustomerID:
                      {allBookings.customerId} Date: {allBookings.date} Time:
                      {allBookings.time} Guests:{allBookings.numberOfGuests}
                    </li>

                    <button
                      onClick={() => handleRemoveBooking(allBookings._id)}
                    >
                      Remove
                    </button>
                    <button onClick={handleBookingChange}>Change info</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {showChange && (
          <div className="update">
            <p>Choose another date:</p>
            <input
              type="date"
              value={updatedBooking.date}
              onChange={(e) =>
                setUpdatedBooking({ ...updatedBooking, date: e.target.value })
              }
            />
            Choose different time:
            <button className="Btn" onClick={() => handleTimeChange("18:00")}>18:00</button>
            <button className="Btn" onClick={() => handleTimeChange("21:00")}>21:00</button>
            Choose amount of guests:
            <input
              type="number"
              value={updatedBooking.numberOfGuests}
              onChange={(e) =>
                setUpdatedBooking({
                  ...updatedBooking,
                  numberOfGuests: parseInt(e.target.value),
                })
              }
            />
            <button onClick={handleUpdateBooking}>Update Booking</button>
          </div>
        )}
      </div>
    </>
  );
};
