import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { IBooking } from "./../components/IBooking";
import "./../styles/Admin.scss";
import { INewUser } from "./../components/INewUser";
import { Bookings } from "./../components/Bookings";
import { User } from "./../components/User";

export function Admin() {

    const restaurantID = "65d1304ad8a8a1c13f2ed3cd";

    const [bookingsFromApi, setBookingsFromApi] = useState<IBooking[]>([]);
    const [showDetailsSection, setShowDetailsSection] = useState(false);
    const [customer, setCustomer] = useState<INewUser>({
        name: "",
        lastname: "",
        email: "",
        phone: ""
    });

    const [detailedBooking, setDetailedBooking] = useState<Bookings>({
        restaurantId: "65d1304ad8a8a1c13f2ed3cd",
        date: "",
        time: "",
        numberOfGuests: 0,
        customer: {
            name: "",
            lastname: "",
            email: "",
            phone: ""
        }
    });

    const [newUser, setNewUser] = useState<INewUser>({
        name: "",
        lastname: "",
        email: "",
        phone: ""
    });

    const [tablesAt6oClock, SetTablesAt6oClock] = useState<number>(-1);
    const [tablesAt9oClock, SetTablesAt9oClock] = useState<number>(-1);

    const [chosenDate, setChosenDate] = useState<string>("");
    const [chosenTime, setChosenTime] = useState<string>("");
    const [chosenAmountOfGuests, setChosenAmountOfGuests] = useState<string>("");

    const [showError, setShowError] = useState(false);
    const [showRequiredError, setShowRequiredError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const [showPhoneError, setShowPhoneError] = useState(false);

    const [showUserForm, setShowUserForm] = useState(false);
    const [showBooking, setShowBooking] = useState(true);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showBookingDone, setShowBookingDone] = useState(false);

    const [GDPRstatus, setGDPRstatus] = useState(false);

    const [showEditBookingForm, setShowEditBookingForm] = useState(false);
    const [showBookingInputRequired, setShowBookingInputRequired] = useState(false);
    const [bookingToEditId, setBookingToEditId] = useState("");
    const [bookingToEditCustomerId, setBookingToEditCustomerId] = useState("");
    const [bookingToEdit, setBookingToEdit] = useState<IBooking>({
        _id: "",
        restaurantId: "65d1304ad8a8a1c13f2ed3cd",
        date: "",
        time: "",
        numberOfGuests: 0,
        customerId: ""
    });

    const [updatedBooking, setUpdatedBooking] = useState<IBooking>({
        _id: "",
        restaurantId: "65d1304ad8a8a1c13f2ed3cd",
        date: "",
        time: "",
        numberOfGuests: 0,
        customerId: ""
    });

    useEffect(() => {
        axios.get<IBooking[]>("https://school-restaurant-api.azurewebsites.net/booking/restaurant/65d1304ad8a8a1c13f2ed3cd")
            .then(response => {
                setBookingsFromApi([...response.data]);
            });
    }, [showBookingDone]);

    function showDetails(bookingIndex: number) {
        let chosenBooking = bookingsFromApi[bookingIndex];
        setBookingToEditId(chosenBooking._id);
        axios.get<INewUser[]>("https://school-restaurant-api.azurewebsites.net/customer/" + chosenBooking.customerId)
            .then(response => {
                let user: INewUser = {
                    name: response.data[0].name,
                    lastname: response.data[0].lastname,
                    email: response.data[0].email,
                    phone: response.data[0].phone
                };
                setBookingToEditCustomerId(chosenBooking.customerId);
                setShowBooking(false);
                setCustomer(user);
                let completeBooking = new Bookings(chosenBooking.restaurantId, chosenBooking.date, chosenBooking.time, chosenBooking.numberOfGuests, user);
                setDetailedBooking(completeBooking);
                setShowDetailsSection(true);
            });
    }

    function deleteBooking(bookingId: string, index: number) {
        axios.delete("https://school-restaurant-api.azurewebsites.net/booking/delete/" + bookingId)
            .then(response => {
                setShowBooking(true);
                setShowBookingDone(true);
                setTimeout(() => {
                    setShowBookingDone(false);
                }, 5000);
            });
    }

    function editBooking() {
        let ToEdit = detailedBooking;
        setBookingToEdit({
            _id: bookingToEditId,
            restaurantId: ToEdit.restaurantId,
            date: ToEdit.date,
            time: ToEdit.time,
            numberOfGuests: ToEdit.numberOfGuests,
            customerId: bookingToEditCustomerId
        });
        setShowDetailsSection(false);
        setShowEditBookingForm(true);
    }

    function closeDetailsSection() {
        setShowDetailsSection(false);
        setShowBooking(true);
    }

    function showBookingField() {
        setShowBookingForm(!showBookingForm);
        setShowBookingDone(false);
        setNewUser({
            name: "",
            lastname: "",
            email: "",
            phone: ""
        });
        SetTablesAt6oClock(-1);
        SetTablesAt9oClock(-1);
        setChosenDate("");
        setChosenTime("");
        setChosenAmountOfGuests("");
        setShowError(false);
        setShowRequiredError(false);
        setShowEmailError(false);
        setShowPhoneError(false);
        setShowUserForm(false);
        setGDPRstatus(false);
    }

    function handleChosenAmountOfGuests(e: ChangeEvent<HTMLInputElement>) {
        setChosenAmountOfGuests(e.target.value);
    }

    function handleChosenDate(e: ChangeEvent<HTMLInputElement>) {
        setChosenDate(e.target.value);
    }

    function checkIfOpenTable() {
        if (chosenDate === "" || chosenAmountOfGuests === "" || Number(chosenAmountOfGuests) > 90) {
            setShowRequiredError(true);
            return;
        }

        let amountOfTablesThisBookingWillNeed = Math.ceil(Number(chosenAmountOfGuests) / 6);
        let checkDate: string = chosenDate;
        let numberOfTablesAt6Left: number = 15;
        let numberOfTablesAt9Left: number = 15;

        for (let i = 0; i < bookingsFromApi.length; i++) {
            const order = bookingsFromApi[i];

            if (order.date === checkDate && order.time === "18:00") {
                let tablesNeededForThisBooking: number = 1;
                let assesInTheChairs: number = 0;
                let numberOfGuests: number = order.numberOfGuests;

                for (let i = 0; i < numberOfGuests; i++) {
                    assesInTheChairs++;
                    if (assesInTheChairs === 7) {
                        tablesNeededForThisBooking++;
                        assesInTheChairs = 1;
                    }
                }

                numberOfTablesAt6Left -= tablesNeededForThisBooking;

                if (amountOfTablesThisBookingWillNeed > numberOfTablesAt6Left) {
                    numberOfTablesAt6Left = 0;
                }
            } else if (order.date === checkDate && order.time === "21:00") {
                let tablesNeededForThisBooking: number = 1;
                let assesInTheChairs: number = 0;
                let numberOfGuests: number = order.numberOfGuests;

                for (let i = 0; i < numberOfGuests; i++) {
                    assesInTheChairs++;
                    if (assesInTheChairs === 7) {
                        tablesNeededForThisBooking++;
                        assesInTheChairs = 1;
                    }
                }

                numberOfTablesAt9Left -= tablesNeededForThisBooking;

                if (amountOfTablesThisBookingWillNeed > numberOfTablesAt9Left) {
                    numberOfTablesAt9Left = 0;
                }
            }
        }

        SetTablesAt6oClock(numberOfTablesAt6Left);
        SetTablesAt9oClock(numberOfTablesAt9Left);
        setShowRequiredError(false);
    }

    function choseTimeForDinner(time: string) {
        setChosenTime(time);
        setShowUserForm(true);
    }

    function cancelBooking() {
        setShowUserForm(false);
        setShowError(false);
        setShowRequiredError(false);
        setShowEmailError(false);
        setShowPhoneError(false);
        setGDPRstatus(false);
        setNewUser({
            name: "",
            lastname: "",
            email: "",
            phone: ""
        });
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        let name = e.target.name;
        setNewUser({ ...newUser, [name]: e.target.value });
    }

    function handleGDPR(e: ChangeEvent<HTMLInputElement>) {
        setGDPRstatus(e.target.checked);
    }

    function makeBooking() {
        setShowError(false);
        setShowEmailError(false);
        setShowPhoneError(false);

        if (newUser.name === "" || newUser.lastname === "" || newUser.email === "" || newUser.phone === "") {
            setShowError(true);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            setShowEmailError(true);
            return;
        }

        if (!/^\d+$/.test(newUser.phone)) {
            setShowPhoneError(true);
            return;
        }

        if (newUser.phone.length < 10 || newUser.phone.length > 10) {
            setShowPhoneError(true);
            return;
        }

        let user = new User(newUser.name, newUser.lastname, newUser.email, newUser.phone);
        let booking = new Bookings(restaurantID, chosenDate, chosenTime, parseInt(chosenAmountOfGuests), user);

        setShowError(false);
        setShowBookingForm(false);

        axios.post("https://school-restaurant-api.azurewebsites.net/booking/create", booking, { headers: { "content-type": "application/json" } })
            .then(response => {
                setShowBookingDone(true);

                setChosenDate("");
                setChosenTime("");
                setChosenAmountOfGuests("");
                SetTablesAt6oClock(-1);
                SetTablesAt9oClock(-1);
                setGDPRstatus(false);
                setNewUser({
                    name: "",
                    lastname: "",
                    email: "",
                    phone: ""
                });

                setTimeout(() => {
                    setShowBookingDone(false);
                }, 5000);
            })
            .catch(error => {
                console.log(error);
                alert("något gick tyvärr fel, försök igen senare.");
            });
    }

    function cancelUpdateBooking() {
        setShowBooking(true);
        setShowEditBookingForm(false);
        setShowBookingInputRequired(false);
    }

    function saveUpdatedBooking() {
        setShowBookingInputRequired(false);

        if (updatedBooking.date === "" || updatedBooking.time === "" || updatedBooking.numberOfGuests === 0) {
            setShowBookingInputRequired(true);
            return;
        }

        setUpdatedBooking({ ...updatedBooking, _id: bookingToEdit._id, customerId: bookingToEdit.customerId });

        let updatedBookingToPutToAPI = {
            id: bookingToEdit._id,
            restaurantId: "65d1304ad8a8a1c13f2ed3cd",
            date: updatedBooking.date,
            time: updatedBooking.time,
            numberOfGuests: Number(updatedBooking.numberOfGuests),
            customerId: bookingToEdit.customerId
        };

        axios.put<IBooking>("https://school-restaurant-api.azurewebsites.net/booking/update/" + updatedBookingToPutToAPI.id, updatedBookingToPutToAPI, { headers: { "content-type": "application/json" } })
            .then(response => {
                console.log(response);
                setShowBooking(true);
                setShowEditBookingForm(false);
                setShowBookingDone(true);

                setTimeout(() => {
                    setShowBookingDone(false);
                }, 5000);
            })
            .catch(error => {
                console.log(error);
                alert("något gick tyvärr fel, försök igen senare.");
            });
    }

    function handleEditFormTimeChange(e: ChangeEvent<HTMLSelectElement>) {
        let name = e.target.name;
        setUpdatedBooking({ ...updatedBooking, [name]: e.target.value });
    }

    function handleEditFormDateAndGuestsChange(e: ChangeEvent<HTMLInputElement>) {
        let name = e.target.name;
        setUpdatedBooking({ ...updatedBooking, [name]: e.target.value });
    }

    let bookingsHtml = bookingsFromApi.map((booking, i) => {
        return (<div key={i}>

            <div> Bokningsnr : {booking._id}</div>
            <div>Antal gäster : {booking.numberOfGuests}</div>
            <div>Datum : {booking.date}</div>
            <div>Tid : {booking.time}</div>
            <button className="Btn" onClick={() => { showDetails(i) }}>se detaljer  </button>
            <button className="deleteBtn" onClick={() => { deleteBooking(booking._id, i) }}>radera bokning</button>
        </div>)
    });

    let detailsHtml = (
        <div>
            <button className="deleteBtn" onClick={closeDetailsSection}>stäng </button>
            <button className="Btn" onClick={editBooking}>ändra bokning  </button>
            <div>Kund : {customer.name} {customer.lastname}</div>
            <div>Epost : {customer.email}</div>
            <div>Tel : {customer.phone}</div>
            <div>Antal gäster : {detailedBooking.numberOfGuests}</div>
            <div>Datum : {detailedBooking.date}</div>
            <div>Tid : {detailedBooking.time}</div>

        </div>)

    return (<div className="adminPageContainer">


        <section className="adminBookingSection">

            <div className="adminMainBtns"> {/* denna del visar knappar överst och låter admin skapa bokning */}

                <button className="Btn" onClick={showBookingField}>skapa bokning</button>
            </div>

            {showBookingDone && <div>Uppdaterat  </div>}


            {/* denna del visar bokningsfältet när en ny bokning skall skapas*/}

            {showBookingForm && <div>

                <h3>Vänligen välj datum och antal gäster.</h3>
                <input type="date" onChange={handleChosenDate} />
                <input type="text" onChange={handleChosenAmountOfGuests} value={chosenAmountOfGuests} placeholder="antal gäster max 90" />

                {showRequiredError && <div>Du måste ange ett datum och antal gäster</div>}
                <button className="Btn" onClick={checkIfOpenTable}>sök ledigt bord </button>

                {(tablesAt6oClock > 0 || tablesAt9oClock > 0) && <div>
                    {tablesAt6oClock > 0 && <div>Det finns {tablesAt6oClock} lediga bord kl 18.<button className="Btn" onClick={() => { choseTimeForDinner("18:00") }}>Välj denna tid  </button> </div>}
                    {tablesAt9oClock > 0 && <div>Det finns {tablesAt9oClock} lediga bord kl 21.<button className="Btn" onClick={() => { choseTimeForDinner("21:00") }}>Välj denna tid  </button></div>}
                </div>}
                {tablesAt6oClock === 0 && tablesAt9oClock === 0 && <div>Det fanns tyvärr inga lediga bord det datumet, vänligen prova ett annat datum.</div>}

                {showUserForm && <div>

                    <div>
                        <h3>Fyll i resterande uppgifter för att slutföra bokning</h3>
                        <div>
                            <p>Dina val: bord för {chosenAmountOfGuests} personer klockan {chosenTime} - {chosenDate}</p>
                        </div>
                        <div>
                            <label htmlFor="GDPR" className="GDPR">Jag har informerat kunden om GDPR och fått ett godkännande</label>
                            <input type="checkbox" id="GDPR" onChange={handleGDPR} />
                        </div>
                        <form>

                            <div>
                                <input type="text" name="name" value={newUser.name} onChange={handleChange} placeholder="förnamn" disabled={!GDPRstatus} />
                            </div>

                            <div>
                                <input type="text" name="lastname" value={newUser.lastname} onChange={handleChange} placeholder="efternamn" disabled={!GDPRstatus} />
                            </div>

                            <div>
                                <input type="email" name="email" value={newUser.email} onChange={handleChange} placeholder="epost" disabled={!GDPRstatus} />
                            </div>

                            <div>
                                <input type="tel" name="phone" value={newUser.phone} onChange={handleChange} placeholder="telefon" disabled={!GDPRstatus} />

                            </div>

                            <div>
                                <button type="button" className="deleteBtn" onClick={cancelBooking}>avbryt </button>
                                <button type="button" className="Btn" onClick={makeBooking}>boka </button>
                            </div>

                        </form>
                    </div>
                    {showError && <div>Alla fällt är obligatoriska</div>}
                    {showEmailError && <div>Vänligen ange en giltig email</div>}
                    {showPhoneError && <div>Telefonnummer får bara bestå utav 10 siffor</div>}
                </div>}
            </div>}

        </section>



        <main className="adminMain"> {/* main delen av sidan, växlar innehåll beroende på vad admin gör för stunden */}


            {showDetailsSection && <section className="adminDetailsContainer">{detailsHtml}</section>} {/* denna rad visar detaljvy utav den bokning admin valt */}


            {showEditBookingForm && <div className="adminUpdateBookingContainer animate__animated animate__flipInX"> {/* denna del visar gränssnitt när admin försöker redigera/ändra en befintlig bokning */}

                <h3>Ändra datum, tid eller antal gäster på bokningen.</h3>

                <div className="bookingField">
                    <label htmlFor="date">Välj datum :</label>
                    <input type="date" name="date" id="date" value={updatedBooking.date} onChange={handleEditFormDateAndGuestsChange} />
                </div>

                <div className="bookingField">
                    <label htmlFor="time">Välj tid :</label>
                    <select name="time" id="time" value={updatedBooking.time} onChange={handleEditFormTimeChange}>
                        <option value="18:00">18:00</option>
                        <option value="21:00">21:00</option>
                    </select>
                </div>

                <div className="bookingField">
                    <label htmlFor="guests">Välj antal gäster :</label>
                    <input type="number" name="numberOfGuests" id="guests" value={updatedBooking.numberOfGuests} onChange={handleEditFormDateAndGuestsChange} />
                </div>

                {showBookingInputRequired && <div className="warning animate__animated animate__headShake">Du måste ange datum, tid och antal gäster</div>}

                <div className="editBookingButtonsContainer">
                    <button type="button" className="Btn" onClick={saveUpdatedBooking}>Spara</button>
                    <button type="button" className="deleteBtn" onClick={cancelUpdateBooking}>Avbryt</button>
                </div>

            </div>}


            <section className="adminShowBookings"> {/* denna del visar lista med alla bokningar på sidan */}

                <h3> Samtliga bokningar : </h3>

                <div className="bookingContainer">{bookingsHtml}</div>

            </section>
        </main>

    </div>)
}
