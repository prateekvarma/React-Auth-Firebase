import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredPassword,
        returnSecureToken: false //we won't recieve any response from firebase
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then((res) => {
      if(res.ok) {
        //if res ok, return promise after converted to json()
        res.json().then((res) => console.log(res)); // we shouldn't recieve a response as returnSecureToken: false
        history.replace('/');
        alert("successfuly changed password")
      } else {
        //Res NOT ok, return promise after converted to json()
        res.json().then((res) => console.log(res));
        alert("Password could not be changed!")
      }
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordInputRef} type='password' id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
