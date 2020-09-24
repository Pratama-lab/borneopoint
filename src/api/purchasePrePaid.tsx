import axios from 'axios'

import baseURL from './baseURL'

const purchasePrePaid = async ({ itemId, productId,userToken,hp } : { itemId: string, productId: string, userToken:string, hp?: string }) => {
  try{
    const result = await axios({
      method	: 'POST',
      url			: `/transaction/purchasePrePaid`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + userToken  },
      data		: {
        itemId    : itemId,
        productId : productId,
        hp
      }
    })
    console.log('result.data', result.data)
    return result.data
  }catch(error){
    console.debug(error.message)
    return error
  }
}

export default purchasePrePaid