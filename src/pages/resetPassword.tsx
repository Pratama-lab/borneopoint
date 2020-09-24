import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, Text } from 'react-native'
import styles from '../styles/resetPassword'

class ResetPassword extends Component{
  constructor(props){
    super(props)
  }
  render = () => 
    <View style={styles.pageContainer}>
      <View style={styles.emailInputContainer}>
        <TextInput style={styles.emailInput} textContentType={'emailAddress'} placeholder={'Email'}/>
      </View>
      <TouchableOpacity style={styles.resetButton}>
        <Text style={styles.resetText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
}

export default ResetPassword