import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from 'react-router-dom';
import './ProfileButton.css'



function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null)
    
    const toggleMenu = (e) => {
      e.stopPropagation();
      setShowMenu(!showMenu);
    };
    
    useEffect(() => {
      if (!showMenu) return;
  
      const closeMenu = (e) => {
        if (!dropdownRef?.current?.contains(e.target)) {
          setShowMenu(false);
        }
      };
  
      window.addEventListener('click', closeMenu);
    
      return () => window.removeEventListener('click', closeMenu);
    }, [showMenu]);
  
    const logout = (e) => {
      
      e.preventDefault();
      dispatch(sessionActions.logout());
    };
  
    return (
      <div className='profile-menu'>
        <button onClick={toggleMenu}>
          <i className="fa-solid fa-user-circle" />
        </button>
        {showMenu && (
          <ul id="profile-dropdown" className="profile-dropdown" ref={dropdownRef}>
            <li>
              <NavLink to={`/@/${user.username}`} onClick={toggleMenu}>{user.username}</NavLink>
            </li>
            <li>
              <NavLink className="nav-button" to='/upload' onClick={toggleMenu}>Upload Tracks</NavLink>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        )}
      </div>
    );
  }
  
export default ProfileButton;