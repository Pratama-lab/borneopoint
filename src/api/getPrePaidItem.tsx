import axios from 'axios'

import baseURL from './baseURL'

const getPrePaidItem = async ({itemType, operator}: {operator?: any, itemType?:any}) => {
  try{
    const result = await axios({
      method	: 'GET',
      url			: 'https://borneopoint.co.id/public/price_list',
      params  : {
        itemType: itemType,
        // id: _id
        operator: operator
      },
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
    })
    return result.data
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default getPrePaidItem