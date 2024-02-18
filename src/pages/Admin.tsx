import { ChangeEvent, useState } from "react";
import "./../styles/Admin.scss";

export const Admin = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showLogIn, setShowLogIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
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
                    <input
                      type="text"
                      placeholder="Användarnamn"
                      value={userName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setUserName(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <input
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
            <div className="admin-page"> Hello Admin</div>
          </div>
        )}
      </div>
    </>
  );
};
