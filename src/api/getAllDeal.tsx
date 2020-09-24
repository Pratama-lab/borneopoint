import axios from 'axios'

import baseURL from './baseURL'

const getAllDeal = async () => {
  try{
    const result = await axios({
      method	: 'GET',
      url			: `/deal/getAllDeal`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    })
    return result.data
  }catch(error){
    console.debug(error)
  }
}

export default getAllDeal