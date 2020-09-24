import axios from 'axios'

import baseURL from './baseURL'

const getAccountInfo = async ({userId,userToken}: {userId: string, userToken?: string}) => {
  try{
    // const userToken: string = ''
    // const userId: string = ''
    const result = await axios({
      method	: 'GET',
      url			: `/user/${userId}/getAccountInfo`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${userToken}`},
    })
    return result.data
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default getAccountInfo