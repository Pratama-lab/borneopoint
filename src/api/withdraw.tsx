import axios from 'axios'

import baseURL from './baseURL'

const withdraw = async ({ amount, userId, userToken } : { amount: number, userId: string, userToken: string }) => {
  try{
    const result = await axios({
      method	: 'POST',
      url			: `/user/${userId}/withdrawWallet`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + userToken },
      data		: {
        amount: amount,
      }
    })
    return result
  }catch(error){
    console.debug(error)
  }
}

export default withdraw