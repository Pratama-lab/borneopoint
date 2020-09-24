import { GoogleSignin } from '@react-native-community/google-signin';

const configure = () => {
  try{
    GoogleSignin.configure({
      webClientId: '393091376216-mksvqdm67n4hej87mr6tsnko4mk2uvcc.apps.googleusercontent.com',
      offlineAccess: true
    });
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default configure

