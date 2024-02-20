import axios from "axios";
import { ChangeEvent, useState } from "react"
import { INewCustomer } from "../models/INewCustomer";
import { Customer } from "../models/Customer";
import "./../styles/Contact.scss"


export function Contact() {

    const [newContact, setNewContact] = useState<INewCustomer>({

        name: "",
        lastname: "",
        email: "",
        phone: "",

    });

    const [messageSend, setMessageSend] = useState(false)
    const [FormError, setFormError] = useState(false)

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const name = e.target.name;
        setNewContact({ ...newContact, [name]: e.target.value })
    }

    function handleSubmit() {
        setFormError(false)

        if (newContact.name === "" || newContact.lastname === "" || newContact.email === "" || newContact.phone === "") {

            setFormError(true)

            return
        }

        const customercontact = new Customer(newContact.name, newContact.lastname, newContact.email, newContact.phone)

        axios.post("https://school-restaurant-api.azurewebsites.net/customer/create/65cdf38894d2af1c6aeae91d", customercontact, { headers: { "content-type": "application/json" } })
            .then(() => {
                setMessageSend(true)
                setNewContact({
                    name: "",
                    lastname: "",
                    email: "",
                    phone: "",
                })
                setTimeout(() => {
                    setMessageSend(false)
                }, 5000)


            })
    }

    
    return (
        <main>
            <div className="Body">
                <h1 className="Contact-Header">Tasty Burger</h1>
                <h3 className="jaja">Fyll i dina uppgifter så kontaktar vi dig</h3>
                <form>
                    <div>
                    
                        <input type="text" name="name" value={newContact.name} onChange={handleChange} placeholder="Förnamn"></input>
                    </div>
                    <div>
                    
                        <input type="text" name="lastname" value={newContact.lastname} onChange={handleChange} placeholder="Efternamn"></input>
                    </div>
                    <div>
                   
                        <input type="email" name="email" value={newContact.email} onChange={handleChange} placeholder="E-post" ></input>
                    </div>
                    <div>
                        <input type="text" name="phone" value={newContact.phone} onChange={handleChange} placeholder="Telefon"></input>
                    </div>
                    <button type="button" className="sendBtn" onClick={handleSubmit} >SKICKA</button>
                </form>
                <div>
                    {FormError && <div>Alla fällt är obligatoriska</div>}
                </div>
            
                {messageSend && <div>Ditt meddelande är skickat!</div>}
            </div>
        </main>)
}