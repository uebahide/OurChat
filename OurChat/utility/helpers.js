import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setProfile(userName, userId){
  try {
    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('userId', userId)
  } catch (error) {
    console.log(error)
  }
}

export async function getProfile(){
  try {
    const userName = await AsyncStorage.getItem('userName');
    const userId = await AsyncStorage.getItem('userId')
    return {
      'userName': userName,
      'userId': userId
    }
  } catch (error) {
    console.log(error)
  }
}