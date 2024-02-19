import "./../styles/Contact.scss"
import axios  from "axios";
import { ChangeEvent, useState } from "react"
import { INewUser } from "./../components/INewUser";
import { User } from "./../components/User";


export function Contact() {

     const [newContact, setNewContact] = useState<INewUser>({
 
         name: "",
         lastName: "",
         email: "",
         phone: "",
 
     });
 
     const [messageSend, setMessageSend] = useState(false)
     const [FormError, setFormError] = useState(false)
 
     const [showEmailError, setShowEmailError] = useState(false);
     const [showPhoneError, setShowPhoneError] = useState(false);
 
 
     function handleChange(e: ChangeEvent<HTMLInputElement>) {
         const name = e.target.name;
         setNewContact({ ...newContact, [name]: e.target.value })
     }
 
     function handleSubmit() {
         setFormError(false)
         setShowEmailError(false)
         setShowPhoneError(false)
 
         if (newContact.name === "" || newContact.lastname === "" || newContact.email === "" || newContact.phone === "") {
 
             setFormError(true)
 
             return
         }
 
         if (!/\S+@\S+\.\S+/.test(newContact.email)) {
 
 
             setShowEmailError(true)
 
             return
         }
 
         if (!/^\d+$/.test(newContact.phone)) {
 
             setShowPhoneError(true)
 
             return
 
         }
 
         if (newContact.phone.length < 10 || newContact.phone.length > 10) {
             setShowPhoneError(true)
             return
         }
 
         const customercontact = new User(newContact.name, newContact.lastname, newContact.email, newContact.phone)
 
         axios.post("https://school-restaurant-api.azurewebsites.net/customer/create", customercontact, { headers: { "content-type": "application/json" } })
             .then(response => {
                 setMessageSend(true)
                 setNewContact({
                     name: "",
                     lastName: "",
                     email: "",
                     phone: "",
                 })
                 setTimeout(() => {
                     setMessageSend(false)
                 }, 5000)
 
 
             })
             .catch(error => {
                 alert("Det gick tyvärr inte att skicka!")
             })
 
     }
 
     
     return (
         <main className="ContactContainer">
             <div>

                 <h3 className="header">Fyll i dina uppgifter så kontaktar vi dig</h3>
                 <form className="formField">
                     <div className="formInputDiv">
                     
                         <input type="text" name="name" value={newContact.name} onChange={handleChange} placeholder="Förnamn"></input>
                     </div>
                     <div className="formInputDiv">
                     
                         <input type="text" name="lastname" value={newContact.lastName} onChange={handleChange} placeholder="Efternamn"></input>
                     </div>
                     <div className="formInputDiv">
                    
                         <input type="email" name="email" value={newContact.email} onChange={handleChange} placeholder="E-post" ></input>
                     </div>
                     <div className="formInputDiv">
                         <input type="text" name="phone" value={newContact.phone} onChange={handleChange} placeholder="Telefon"></input>
                     </div>
                     <button type="button" className="sendBtn" onClick={handleSubmit} >SKICKA</button>
                 </form>
                 <div>
                     {FormError && <div className="Errormsg">Alla fällt är obligatoriska</div>}
                     {showEmailError && <div>Vänligen ange en giltig email</div>}
                     {showPhoneError && <div>Telefonnummer får bara bestå utav 10 siffor</div>}
                 </div>
             </div>
             {messageSend && <div>Ditt meddelande är skickat!</div>}
 
         </main>)
 }