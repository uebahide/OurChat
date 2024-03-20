import * as React from 'react';
import { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { getProfile, setProfile } from '../utility/helpers';


export default function ProfileScreen({navigation}){
  const [text, setText] = React.useState("");
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [serverId, setServerId] = useState("")
  const [port, setPort] = useState("")

  React.useEffect(() => {
    const fetchData = async () => {
      try{
        const profile = await getProfile()
        setUserName(profile.userName)
        setUserId(profile.userId)
        setServerId(profile.serverId)
        setPort(profile.port)
      }catch(error){
        console.log(error)
      }
    }

    fetchData()
  }, [])
  
  const register = async () => {
    if(userName != "" && userId != "" && serverId != "" && port != ""){
      await setProfile(userName, userId, serverId, port)
      navigation.navigate('Chat')
    }
  }

  return (
    <>
      <TextInput
        label="user name"
        placeholder='enter name'
        value={userName}
        onChangeText={text => setUserName(text)}
      />
      <TextInput
        label="user id"
        placeholder='id'
        value={userId}
        onChangeText={text => setUserId(text)}
      />
      <TextInput
        label="server ip"
        placeholder='ip'
        value={serverId}
        onChangeText={text => setServerId(text)}
      />
      <TextInput
        label="server port"
        placeholder='port '
        value={port}
        onChangeText={text => setPort(text)}
      />
      <Button 
        icon="update"
        mode="contained" 
        onPress={register}>
        Register
      </Button>
    </>
  );
};