import axios from 'axios'

import baseURL from './baseURL'

const userSearch = async ({email,_id}: {email?: string, _id?: string}) => {
  try{
    // const userToken: string = ''
    // const userId: string = ''
    console.log(email)
    console.log(_id)
    const result = await axios({
      method	: 'GET',
      url			: `/user`,
      params  : {
        email: email,
        id: _id
      },
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
    })
    return result.data
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default userSearch