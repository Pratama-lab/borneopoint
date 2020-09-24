import axios from 'axios'

import baseURL from './baseURL'

const login = async ({ email, password, firebaseIdToken } : { email?: string, password?: string, firebaseIdToken?: string }) => {
  try{
    const result = await axios({
      method	: 'POST',
      url			: `/user/login`,
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      data		: {
        email: email,
        password: password,
        firebaseIdToken: firebaseIdToken
      }
    });
    return result.data
  }catch(error){
    console.debug(error.message)
    return error
  }
}

export default login