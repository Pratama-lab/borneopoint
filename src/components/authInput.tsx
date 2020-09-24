import React, { Component } from 'react'
import {View, TextInput, Image} from  'react-native'

import styles from '../styles/authInput.component'
// import { TextInput } from 'react-native-gesture-handler'

type AuthInputProps = {
  style?    : any
  type      : 'email' | 'password' | 'name'
  getValue  : Function
}

type AuthInputState = {
  text?     : string
}

const email       = require('../assets/icons/email.png')
const emailBlack  = require('../assets/icons/emailBlack.png')
const key         = require('../assets/icons/key.png')
const keyBlack    = require('../assets/icons/keyBlack.png')
const man         = require('../assets/icons/man.png')
const manBlack    = require('../assets/icons/manBlack.png')

class AuthInput extends Component<AuthInputProps, AuthInputState>{
  constructor(props: any){
    super(props)
    this.state = {
      text: undefined
    }
  }
  handleValueChange = (text: any) => {
    try{
      console.log(text)
      this.setState({
        text: text
      })
      this.props.getValue(text)
    }catch(error){ console.debug(error) }
  }
  selectSource = () => {
    if(this.state.text !== undefined)
      if(this.state.text.length > 0)
        if(this.props.type === 'email')
          return emailBlack
        else if(this.props.type === 'password')
          return keyBlack
        else 
          return manBlack
      else
        if(this.props.type === 'email')
          return email
        else if(this.props.type === 'password')
          return key
        else 
          return man
    else
      if(this.props.type === 'email')
        return email
      else if(this.props.type === 'password')
        return key
      else 
        return man
  }
  render = () => 
    <View style={{
      ...styles.container,
      ...this.props.style,
    }}>
      <View style={styles.iconContainer}>
        <Image style={styles.icon} source={this.selectSource()} fadeDuration={0}/>
      </View>
      <TextInput 
        autoCapitalize={'none'}
        textContentType={this.props.type === 'email' ? 'emailAddress' : this.props.type === 'password' ? 'password' : 'name'}
        style={styles.textInput}
        multiline={false}
        placeholder={this.props.type}
        secureTextEntry={this.props.type === 'password'}
        onChangeText={this.handleValueChange}/>
    </View>
}

export default AuthInput