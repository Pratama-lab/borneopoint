import axios from 'axios'

import baseURL from './baseURL'

const register = async ({ name, email, password, firebaseIdToken } : { name?:string, email?: string, password?: string, firebaseIdToken?: string }) => {
  try{
    console.log({
      name,
      email,password,firebaseIdToken
    })
    const result = await axios({
      method	: 'POST',
      url			: `/user/register`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      data		: {
        name: name,
        email: email,
        password: password,
        firebaseIdToken: firebaseIdToken
      }
    })
    return result.data
  }catch(error){
    console.debug(error)
  }
}

export default register