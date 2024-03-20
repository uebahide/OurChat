import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setProfile(userName, userId, serverId, port){
  try {
    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('userId', userId)
    await AsyncStorage.setItem('serverId', serverId)
    await AsyncStorage.setItem('port', port)
  } catch (error) {
    console.log(error)
  }
}

export async function getProfile(){
  try {
    const userName = await AsyncStorage.getItem('userName');
    const userId = await AsyncStorage.getItem('userId')
    const serverId = await AsyncStorage.getItem('serverId')
    const port = await AsyncStorage.getItem('port')
    return {
      'userName': userName,
      'userId': userId,
      'serverId': serverId,
      'port': port,
    }
  } catch (error) {
    console.log(error)
  }
}