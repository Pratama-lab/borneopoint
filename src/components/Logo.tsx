import React, { Component } from 'react'
import { Image } from 'react-native'

const logo = require('../assets/logo.png')

const Logo = (props:any) => 
  <Image 
  source={logo} 
  // resizeMode={'contain'}
  style={props.style}/>

  export default Logo