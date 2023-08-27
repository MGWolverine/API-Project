// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='header'>
      <button className='homeButton'>
        <NavLink className='homeLink' exact to="/">Home</NavLink>
      </button>
      {isLoaded && (
        <ul className='profileButton'>
          <ProfileButton user={sessionUser} />
        </ul>
      )}
    </div>
  );
}

export default Navigation;