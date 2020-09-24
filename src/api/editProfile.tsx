import axios from 'axios'

import baseURL from './baseURL'

const editProfile = async ({userToken, profilePicture, name, email}: { userToken: string, profilePicture?: string, name?: string, email?: string }) => {
  try{
    let bodyFormData = new FormData();
    if(email)
      bodyFormData.append('email', email)
    if(name)
      bodyFormData.append('name', name)
    console.log('input', {
      name,
      email,
      profilePicture
    })
    if(profilePicture){
      let filename = profilePicture.split('/').pop();

      const photos = {
        uri: profilePicture,
        name: filename,
        type: 'image/jpg'
      }
      bodyFormData.append('profilePicture', photos)
      // const response = await fetch(profilePicture)
      // const blob = await response.blob()
      // bodyFormData.append('profilePicture', blob)
    }

    // JSON.parse(JSON.stringify({
    //   uri: profilePicture,
    //   name: `selfie${Math.floor(Math.random() * 100)}.jpg`,
    //   type: 'image/jpg'
    // }))
    console.log('form data', bodyFormData)
    const result = await axios({
      method	: 'PATCH',
      url			: '/user/editAccount',
      baseURL : baseURL,
      timeout	: 12000,
      headers	: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json', 'Authorization': `Bearer ${userToken}`},
      data    : bodyFormData
    })
    console.log('myresutl', result.data)
    return result.data
  }catch(error){
    console.debug(error)
    console.log('err mess', error.message)
    return undefined
  }
}

export default editProfile