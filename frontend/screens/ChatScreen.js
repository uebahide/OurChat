import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useFocusEffect } from '@react-navigation/native'
import { getProfile } from '../utility/helpers'
import { io } from 'socket.io-client';

export default function ChatScreen() {
  const [messages, setMessages] = useState([])
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [serverId, setServerId] = useState("")
  const [port, setPort] = useState("")
  const [socketInstance, setSocketInstance] = useState(null)

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const profile = await getProfile();
          setUserName(profile.userName);
          setUserId(profile.userId);
          setServerId(profile.serverId);
          setPort(profile.port);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
  
      const socket = io(`http://${serverId}:${port}`);
      socket.on('connect', () => {
        console.log('socket connected');
      });
      socket.on('disconnect', () => {
        console.log('socket disconnect');
      });
      socket.on('message', (history) => {
        const messages_history = history.map(msg => ({
          _id: msg.id,
          text: msg.text,
          createdAt: msg.createdAt,
          user: {
            _id: msg.userId,
            name: msg.userName,
          }
        }))
        setMessages([...messages_history])
      })
  
      setSocketInstance(socket)
      return () => socket.disconnect();
    }, [userName. userId, serverId, port])
  );

  useEffect(() => {
    
    // const fetchData = async () => {
    //   try{
    //     const profile = await getProfile()
    //     setUserName(profile.userName)
    //     setUserId(profile.userId)
    //   }catch(error){
    //     console.log(error)
    //   }
    // }

    // fetchData()
  }, [])

  const onSend = useCallback((messages = []) => {
    if(userName != "" && userId != ""){
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      )
      const data = {
        id: messages[0]._id,
        message: messages[0].text,
        userId: userId,
        userName: userName
      }

      socketInstance.emit('message', data)
    }
  }, [userName, userId, socketInstance])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: userId,
        name: userName
      }}
    />
  )
}