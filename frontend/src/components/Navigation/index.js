// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  console.log(isLoaded)

  return (
    <div className='header'>
      <div className='homeLogo'>
        <NavLink className='homeLink' exact to="/">Not-Meetup</NavLink>
      </div>
      {/* {isLoaded && ( */}
        <ul className='profileButton'>
          <ProfileButton user={sessionUser} />
        </ul>
      {/* )} */}
    </div>
  );
}

export default Navigation;