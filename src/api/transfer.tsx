import axios from 'axios'

import baseURL from './baseURL'

const transfer = async ({ amount, userId, userToken,to } : { amount: number, userId: string, userToken: string, to: string }) => {
  try{
    const result = await axios({
      method	: 'POST',
      url			: `/user/${userId}/transferWallet`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + userToken },
      data		: {
        amount: amount,
        to: to
      }
    })
    return result
  }catch(error){
    console.debug(error)
  }
}

export default transfer