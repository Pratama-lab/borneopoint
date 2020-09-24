import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';


const AuthContext = React.createContext(undefined)

class AuthState extends Component{
  constructor(props: any){
    super(props)
    this.setAuth = this.setAuth.bind(this)
    this.signOut = this.signOut.bind(this)
    this.setup = this.setup.bind(this)
  }
  state = {
    _id: undefined,
    email: undefined,
    name: undefined,
    // wallet: undefined,
    token: undefined,
    isSignedIn: false
  }
  setAuth = async ({ _id, name, email, profilePicture, token }, goBack) => {
    try{
      console.log('setting auth')
      console.log({ _id, name, email, profilePicture, token })
      if(_id && name && email && token && goBack){
        console.log('settingASYNC STORAGE')
        await AsyncStorage.setItem('@auth', JSON.stringify({ _id, name, email, profilePicture, token }))
        console.log('setting state')

        this.setState({ _id, name, email, profilePicture, token, isSignedIn: true }, () => goBack())
      }
    }catch(error){
      console.debug(error)
    }
  }
  setup = async () => {
    try{
      const authStringData = JSON.parse(await AsyncStorage.getItem('@auth'))
      console.debug('authStringData',authStringData)
      if(authStringData !== undefined && authStringData !== null)
        this.setState({
          ...authStringData,
          isSignedIn: true
        })
    }catch(error){
      console.debug(error)
    }
  }
  signOut = async (reset) => {
    try{
      await AsyncStorage.removeItem('@auth')
      this.setState({
        _id: undefined,
        email: undefined,
        name: undefined,
        // wallet: undefined,
        token: undefined,
        isSignedIn: false
      })
      reset({
        routes: [{ name: 'Splash' }],
      })
    }catch(error){
      console.debug(error)
    }
  }
  render = () => 
    <AuthContext.Provider value={{...this.state, setAuth: this.setAuth, signOut: this.signOut, setup: this.setup}}>
      {this.props.children}
    </AuthContext.Provider>
}

export{
  AuthState
}

export default AuthContext