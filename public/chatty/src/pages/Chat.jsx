import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import axios from "axios"
import { allUsersRoute, validateUser } from "../utils/APIRoutes"
import {useNavigate} from "react-router-dom"
import Contacts from "../components/Contacts"
import Welcome from "../components/Welcome"
import ChatContainer from '../components/ChatContainer'


function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() =>{
    async function userValid(){
      let localUser = JSON.parse(localStorage.getItem("chat-app-user"))
    
      if(localUser){
        const {data} = await axios.post(validateUser,{
          _id: localUser._id
        })
        if(data.status===false){
          localStorage.removeItem("chat-app-user")
          navigate("/login")
          return
        }
        if(data.status===true){
          setCurrentUser(localUser)
          return
        }
      }

      if(!localUser){
        navigate("/login")
        return
      }

    
    }
    userValid();
    setIsLoaded(true);
  }, [])


  useEffect(() =>{
    async function myFunction(){
      if(currentUser){
        if(currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data.data)
        }
        else{
          navigate('/setAvatar');
        }
      }
    }
    myFunction()
  },[currentUser])

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>
        {
          isLoaded && currentChat === undefined ?
          <Welcome/> : 
          <ChatContainer currentChat = {currentChat}/>
        }
        
      </div>
    </Container>
  )
}

const Container = styled.div`
  height:100vh;
  width:100vw;
  display: flex;
  flex-direction: column;
  justify-content:center;
  gap:1rem;
  align-items: center;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px){
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat