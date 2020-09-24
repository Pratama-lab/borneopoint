import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-community/google-signin'

async function onGoogleButtonPress() {
  try{
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn()
    console.debug('idToken', idToken)
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)


    const data = auth().signInWithCredential(googleCredential)
    const firebaseIdToken = await auth().currentUser.getIdTokenResult();
    // auth().signOut()
    // Sign-in the user with the credential
    return firebaseIdToken
  }catch(error){
    console.debug(error)
    return undefined
  }
}

export default onGoogleButtonPress