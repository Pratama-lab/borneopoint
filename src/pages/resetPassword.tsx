import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styles from '../styles/resetPassword'
import axios from 'axios'


export default class ResetPassword extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      email_valid: '',
      loading: true
    }
  }

  componentDidMount = () => {
    this.setState({
      loading: false
    })
  }

  resetPassword = () => {
    this.setState({ loading: true })
    axios.post('http://borneopoint.co.id/api/password/reset', {email: this.state.email})
    .then(resp => {
      console.log(resp.data.data)
      if (resp.data.data.message === 'We have e-mailed your password reset link!') {
        this.setState({ loading: false })
        ToastAndroid.show("We have e-mailed your password reset link!", ToastAndroid.LONG)
      } else if (resp.data.data.message === 'Please wait before retrying.') {
        this.setState({ loading: false })
        ToastAndroid.show("Please wait before retrying.", ToastAndroid.LONG)
      }
    })
    .catch(err => {
      console.log("RESET PASSWORD => "+err)
    })
  }

  validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      this.setState({ email: text, email_valid: 'Email is Not Correct' })
      return false;
    }
    else {
      this.setState({ email: text, email_valid: 'Email is Correct' })
      console.log("Email is Correct");
    }
  }

  render = () => 
    <>
      {this.state.loading ?
        <View style={[ styless.container_loading, styless.horizontal_loading ]}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
        :
        null
      }
      <View style={styles.pageContainer}>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            textContentType={'emailAddress'}
            placeholder={'Email'}
            keyboardType={'email-address'}
            onChangeText={(text) => this.validate(text)}
            value={this.state.email}
          />
        </View>
        {this.state.email_valid === 'Email is Not Correct' ?
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: wp('90%') }}>
              <Text style={{ color: 'red' }}>Email is not correct</Text>
            </View>
          </View>
          :
          null
        }
        <TouchableOpacity style={styles.resetButton} onPress={this.resetPassword}>
          <Text style={styles.resetText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </>
}

// export default ResetPassword

const styless = StyleSheet.create({
  container_loading: {
      flex: 1,
      position:'absolute',
      zIndex: 10,
      width: '100%',
      height: '100%',
      justifyContent: "center",
      backgroundColor: 'rgba(0,0,0,0.1)'
  },
  
    horizontal_loading: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
  },
})