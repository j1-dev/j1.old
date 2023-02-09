import React, { useState } from 'react';
import { useAuth } from '../api/authContext';
import LogInNavbar from '../components/LogInNavbar';
import { Tilt }  from '../api/TiltApi';

const Register = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { signup } = useAuth();

  const handleChange = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    await signup(user.email, user.password);
  };

  return (
    <div>
      <div className='w-1/2 float-right border-l-2 border-black h-screen'>
        <Tilt className='font-bold text-9xl w-full mt-80'>
          Register
        </Tilt>
      </div>
      <div className='w-1/2 float-right'>
        <form className="pt-60">
          <label htmlFor="email" className="p-3">
            Email
          </label>
          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            name="email"
            id="email"
            className="p-3 border"
            onChange={handleChange}
          />

          <label htmlFor="password" className="p-3">
            Password
          </label>
          <input
            type="password"
            placeholder='password'
            name="password"
            id="password"
            className="p-3 border"
            onChange={handleChange}
          />

          <button className="button" onClick={handleSubmit}>
            Register
          </button>
          <LogInNavbar />
        </form>
      </div>
    </div>
      
  );
};

export default Register;
