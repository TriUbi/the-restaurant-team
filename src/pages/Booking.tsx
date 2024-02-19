import "./../styles/Booking.scss";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import bild from "./../assets/SidePicBooking.png";

import axios from "axios";
import { IBooking } from "../components/IBooking";
import { Customer } from "../components/Customer";
import { INewCustomer } from "../components/INewCustomer";
import Calendar from "react-calendar";

export const Booking = () => {
  const restaurantID = "65cdf38894d2af1c6aeae91d";
  const [date, setDate] = useState("");
  const [userInputNumber, setUserInputNumber] = useState("");

  const [chosenTime, setChosenTime] = useState("");
  const [timesButton, setTimesButton] = useState(false);
  const [ShowForm, setShowForm] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showBookedMessage, setShowBookedMessage] = useState(false);

  const [newCustomer, setNewCustomer] = useState<INewCustomer>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [bookings, setBookings] = useState<IBooking[]>([]);

  useEffect(() => {
    axios
      .get<IBooking[]>(
        "https://school-restaurant-api.azurewebsites.net/booking/restaurant/65cdf38894d2af1c6aeae91d"
      )
      .then((response) => {
        setBookings([...response.data]);
      });
  }, []);

  const chosenTimeToEat = (time: string) => {
    setChosenTime(time);
    setShowForm(false);
    setShowCustomerForm(true);
  };

  const handleCalendarClick = (value: Date) => {
    const dateString = value.toLocaleDateString();

    setDate(dateString);
    console.log(dateString);
  };
  const CheckIfAvailableTables = () => {
    setTimesButton(true);
  };
  const CancelBooking = () => {
    setDate("");
    setChosenTime("");
    setUserInputNumber("");
    setShowCustomerForm(false);
    setShowForm(true);
    setTimesButton(false)
  };

  const NavigateToHomePage = () => {
    window.location.href = "/";
  };

  const CreateBooking = () => {
    setShowBookedMessage(true);
    setShowCustomerForm(false);
    let customer = new Customer(
      newCustomer.name,
      newCustomer.lastName,
      newCustomer.email,
      newCustomer.phone
    );
    const payload = {
      restaurantId: restaurantID,
      date: date,
      time: chosenTime,
      numberOfGuests: parseInt(userInputNumber),
      customer,
    };
    const getData = async () => {
      try {
        const response = await axios.post(
          "https://school-restaurant-api.azurewebsites.net/booking/create",

          payload
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  };

  return (
    <>
      <div className="body">
        <div className="leftside">
          <div className="header">
            <h3 className="header-h4">Restaurang TastyBurgers</h3>
          </div>
          {ShowForm && (
            <div>
              <section className="section-container">
                <header className="section-header">
                  <p>
                    Välkommen att boka ditt bord online. <br />
                    Vänligen ange antal gäster och dag ni vill ankomma...
                    <br />
                    I nästa slide väljer ni tid samt ser ifall eran valda tid
                    och dag är tillgänglig. <br />
                  </p>
                </header>
                <hr />
              </section>
              <form
                className="input-form"
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                }}
              >
                <input
                  className="input-number"
                  type="number"
                  min={1}
                  max={6}
                  placeholder="Ange antalet gäster 1-6"
                  value={userInputNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUserInputNumber(e.target.value);
                  }}
                />

                <div className="calendar-div">
                  <Calendar
                    onClickDay={(value) => handleCalendarClick(value)}
                    value={date}
                  />
                </div>
                <hr />
                <button
                  className="next-button"
                  onClick={CheckIfAvailableTables}
                >
                  Nästa
                </button>
              </form>
              <hr />
              <section className="times-section">
                {timesButton && (
                  <div className="times-div">
                    <button
                      className="time-btn"
                      onClick={() => chosenTimeToEat("18:00")}
                    >
                      18:00
                    </button>
                    <button
                      className="time-btn"
                      onClick={() => chosenTimeToEat("21:00")}
                    >
                      21:00
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {showCustomerForm && (
            <div className="customer-details">
              <div>
                <h3>
                  Vänligen fyll i resterande uppgifter för att slutföra er
                  bokning.
                </h3>
                <div>
                  Antal gäster: {userInputNumber} klockan: {chosenTime} datum:
                  {date}
                </div>
              </div>
              <form
                className="form"
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                }}
              >
                <div className="form-div">
                  <div className="input-div">
                    <input
                      className="input-text"
                      type="text"
                      name="name"
                      placeholder="Namn"
                      value={newCustomer.name}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="input-div">
                    <input
                      className="input-text"
                      type="text"
                      name="lastName"
                      placeholder="Efternamn"
                      value={newCustomer.lastName}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-div">
                    <input
                      className="input-text"
                      type="text"
                      name="email"
                      placeholder="email"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="input-div">
                    <input
                      className="input-text"
                      type="text"
                      name="phone"
                      placeholder="Telefon"
                      value={newCustomer.phone}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="yeye">
                    <button className="next-button" onClick={CreateBooking}>
                      Slutför
                    </button>
                    <button className="next-button" onClick={CancelBooking}>
                      Avbryt
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {showBookedMessage && (
            <>
              <div className="input-div">
                <p className="end-message">
                  Din bokning är nu skapad! Vi ser fram emot erat besök.
                </p>
              </div>
              <div className="input-div">
                <button className="time-btn" onClick={NavigateToHomePage}>
                  Till Start
                </button>
              </div>
            </>
          )}
        </div>
        <div className="picdiv">
          <img src={bild} className="bild" />
        </div>
      </div>
    </>
  );
};
