import axios from 'axios'

import baseURL from './baseURL'

const getAllTransactionHistory = async ({userToken}: {userToken?: string}) => {
  try{
    const result = await axios({
      method	: 'GET',
      url			: `/transaction/getAllTransactionHistory`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json',  'Authorization': `Bearer ${userToken}`},
    })
    return result.data
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default getAllTransactionHistory