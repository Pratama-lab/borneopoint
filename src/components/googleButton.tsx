import React, { Component } from 'react'
import {TouchableOpacity, View, Image, Text} from 'react-native'

import styles from '../styles/googleButton.component'

const googleIcon = require('../assets/icons/google.png')

type GoogleButtonProps= {
  style?: any
  onPress?: any
}

type GoogleButtonState= {
}
class GoogleButton extends Component<GoogleButtonProps,GoogleButtonState>{
  constructor(props: any){
    super(props)
  }
  render = () => 
    <TouchableOpacity style={{...styles.container,...this.props.style}} onPress={this.props.onPress}>
      <View style={styles.iconContainer}>
        <Image style={styles.icon} source={googleIcon}></Image>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Google</Text>
      </View>
    </TouchableOpacity>
}

export default GoogleButton