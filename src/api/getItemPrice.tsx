import axios from 'axios'

import baseURL from './baseURL'

const getItemPrice = async () => {
  try{
    const result = await axios({
      method	: 'GET',
      url			: `/infoAndPromotion/getAllInfoAndPromotion`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    })
    return result
  }catch(error){
    console.debug(error)
  }
}

export default getItemPrice