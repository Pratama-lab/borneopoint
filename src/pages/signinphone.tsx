import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-community/async-storage'


export default class Phone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            code: '',
            confirm: null,
            timer: 60
        }
    }

    signInWithPhone = async (phoneNumber) => {
        this.setState({ timer: 120 })
        axios.get('https://admin.borneopoint.co.id/api/check_phone', {params: {
            phone: this.state.phone_number
        }})
        .then(async (resp) => {
            // console.log(resp.data.data.message)
            if (resp.data.data.message === 'User Not Found') {
                ToastAndroid.show("This phone number is not registered", ToastAndroid.SHORT)
            } else {
                AsyncStorage.setItem('@id_login', resp.data.data.data.id_login)
                try {
                    const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
                    console.log("confirm => ", confirmation)
                    this.setState({ confirm: confirmation })
                    let timer_interval = setInterval(() => {
                        if(this.state.timer === 0){
                            clearInterval(timer_interval)
                        } else {
                            this.setState({
                                timer: this.state.timer - 1
                            })
                        }
                    }, 1000)
                } catch (error) {
                    console.log("Invalid => ", error)
                    if (error.code === 'auth/unknown') {
                        ToastAndroid.show("Too many otp request, please try again later", ToastAndroid.SHORT)
                    }
                }
            }
        })
    }

    confirmCode = async () => {
        try {
            await this.state.confirm.confirm(this.state.code)
            ToastAndroid.show("Success", ToastAndroid.SHORT)
            this.props.navigation.reset({
                routes: [{ name: 'Main' }],
            })
        } catch (error) {
            if (error.code === 'auth/session-expired') {
                ToastAndroid.show("The sms code has expired. Please re-send the verification code to try again", ToastAndroid.SHORT)
            } else if (error.code === 'auth/invalid-verification-code') {
                ToastAndroid.show("Invalid verification code", ToastAndroid.SHORT)
            }
            console.log('Invalid Code => '+error)
        }
    }

    render = () =>
        <LinearGradient colors={[ '#6FC3F7', '#3269B3' ]} style={{ width: '100%', height: '100%', alignItems: 'center' }}>
            <View style={{ width: '100%', height: wp('30%'), alignItems: 'center', marginTop: wp('40%') }}>
                <Image source={require('../assets/logo.png')} style={{ width: wp('60%'), height: wp('14.6%') }} />
            </View>
            <View style={{ width: '100%', alignItems: 'center', marginTop: wp('5%') }}>
                <View style={{ width: wp('60%') }}>
                    <Text style={{ fontSize: wp('7%'), color: 'white' }}>Sign In</Text>
                </View>
                {!this.state.confirm ?
                    <>
                        <View style={{ width: wp('60%'), height: wp('11%'), backgroundColor: 'white', borderRadius: wp('2.22223%'), marginTop: wp('3%'), elevation: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../assets/icons/phone-call.png')} style={{ width: wp('5%'), height: wp('5%'), marginLeft: wp('3%'), tintColor: (this.state.phone_number === '' ? '#D3D3D3' : 'black') }} />
                            <TextInput
                                style={{ marginLeft: wp('3%'), width: wp('48%') }}
                                placeholder="phone number"
                                keyboardType={"phone-pad"}
                                onChangeText={(text) => this.setState({ phone_number: text })}
                                value={this.state.phone_number}
                            />
                        </View>
                        <View style={{ width: wp('60%'), marginTop: wp('1%') }}>
                            <Text style={{ fontSize: wp('3%'), marginLeft: wp('1%') }}>Example: +6285222334444</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.signInWithPhone(this.state.phone_number)} style={{ width: wp('60%'), height: wp('11%'), backgroundColor: 'white', borderRadius: wp('2.22223%'), marginTop: wp('3%'), marginBottom: wp('3%'), elevation: 4, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('4.5%') }}>Send Code</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <View style={{ width: wp('60%'), height: wp('11%'), backgroundColor: 'white', borderRadius: wp('2.22223%'), marginTop: wp('3%'), elevation: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={this.state.code === '' ? require('../assets/icons/key.png') : require('../assets/icons/keyBlack.png')} style={{ width: wp('5%'), height: wp('5%'), marginLeft: wp('3%') }} />
                            <TextInput
                                style={{ marginLeft: wp('3%'), width: wp('48%') }}
                                placeholder="Code"
                                keyboardType={"number-pad"}
                                onChangeText={(text) => this.setState({ code: text })}
                                value={this.state.code}
                            />
                        </View>
                        <View style={{ width: wp('60%'), alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.timer === 0 ?
                                <Text style={{ color: 'white' }} onPress={() => this.signInWithPhone(this.state.phone_number)}>Resend Code</Text>
                                :
                                <Text style={{ color: 'white' }}>Resend Code ({this.state.timer})</Text>
                            }
                        </View>
                        <TouchableOpacity onPress={this.confirmCode} style={{ width: wp('60%'), height: wp('11%'), backgroundColor: 'white', borderRadius: wp('2.22223%'), marginTop: wp('3%'), marginBottom: wp('3%'), elevation: 4, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('4.5%') }}>Confirm</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
        </LinearGradient>
}