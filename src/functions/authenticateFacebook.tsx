import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

async function onFacebookButtonPress() {
  // Attempt login with permissions
  try{
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if(result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if(!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    
    // Sign-in the user with the credential
    const authData = auth().signInWithCredential(facebookCredential);
    const firebaseIdToken = await auth().currentUser.getIdTokenResult();
    // auth().signOut()
    return firebaseIdToken
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default onFacebookButtonPress