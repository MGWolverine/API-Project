import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/")
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <div className="prof-link">
        {sessionUser ? (
          <Link className="link startGroup" to="/groups/new">
            Start a new group
          </Link>
        ) : (
          <></>
        )}
        <button className="profile-button" onClick={openMenu}>
          <i className="fas fa-user-circle" />
        </button>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <>
              {/* <li>{user.username}</li> */}
              <li>
                Hello, {user.firstName}
              </li>
              <li>{user.email}</li>
              <hr></hr>
              <li>
                <button className="modal-logout-button" onClick={logout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
              <button
                onClick={(e) => {
                  const credential = "Demo-lition";
                  const password = "password";
                  closeMenu();
                  return dispatch(
                    sessionActions.login({ credential, password })
                  );
                }}
              >
                Log in as Demo User
              </button>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;
