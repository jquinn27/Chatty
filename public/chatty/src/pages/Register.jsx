import React, {useState, useEffect} from 'react'
import styled from "styled-components"
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.svg"
import {ToastContainer, toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { registerRoute, validateUser } from '../utils/APIRoutes';


function Register() {

    const navigate = useNavigate();

    const [values, setValues]=useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (event) =>{
        event.preventDefault();
        if(handleValidation()){
          //valid. calls API
          const { password, email, username } = values;
          const {data} = await axios.post(registerRoute,{
            username,
            email,
            password
          });
          if(data.status===false){
            toast.error(data.msg, toastOptions)
          }
          if(data.status===true){
            localStorage.setItem('chat-app-user', JSON.stringify(data.user));
            navigate("/");
          }
          
        }
    }

    
    useEffect(() =>{
      async function userValid(){
        let localUser = JSON.parse(localStorage.getItem("chat-app-user"))
      
        if(localUser){
          const {data} = await axios.post(validateUser,{
            _id: localUser._id
          })
          if(data.status===false){
            localStorage.removeItem("chat-app-user")
            return
          }
          if(data.status===true){
            navigate("/")
          }
        }

        if(!localUser){
          return
        }

      
      }
      userValid()
    }, [])


    
    const toastOptions = {
      
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    
    }

    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    function isEmailValid(email) {
        if (!email)
            return false;

        if(email.length>254)
            return false;

        var valid = emailRegex.test(email);
        if(!valid)
            return false;

        // Further checking of some things regex can't handle
        var parts = email.split("@");
        if(parts[0].length>64)
            return false;

        var domainParts = parts[1].split(".");
        if(domainParts.some(function(part) { return part.length>63; }))
            return false;

        return true;
    }

    const handleValidation = () =>{
        const {username, email, password, confirmPassword} = values;

        if(password !==confirmPassword){
            toast.error("Password and confirm password should match.", toastOptions)
            return false;
        } else if(username.length<3){
          toast.error("Username must be longer than 3 characters.", toastOptions)
          return false;
        }
        else if(password.length<8){
          toast.error("Password must be longer than 8 characters.", toastOptions)
          return false;
        } else if(isEmailValid(email) !== true){
          toast.error("Email must be valid.", toastOptions)
          return false;
        }
        return true;
    }

    const handleChange = (event) =>{
        setValues({...values, [event.target.name]:event.target.value});
    }

  return (
    <>
    <FormContainer>
        <form action ="" onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="Logo"/>
                <h1>Chatty</h1>
            </div>
            <input type="text" placeholder='Username' name='username' onChange={e=>handleChange(e)}/>
            <input type="email" placeholder='Email' name='email' onChange={e=>handleChange(e)}/>
            <input type="password" placeholder='Password' name='password' onChange={e=>handleChange(e)}/>
            <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={e=>handleChange(e)}/>
            <button type='submit'>Create User</button>
            <span>Already have an account? <Link to="/login">Login</Link></span>
        </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #997af0;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      &:hover{
          color: #997af0;
      }
    }
  }
`;

export default Register