import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'


export default class InputName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone_number: '',
            email: null,
            password: null
        }
    }

    componentDidMount = async () => {
        const phone = await AsyncStorage.getItem('@phone')
        this.setState({
            phone_number: phone
        })
    }

    signUp = () => {
        axios.get('https://admin.borneopoint.co.id/api/insert_user', {params: {
            nama: this.state.name,
            email: this.state.email,
            password: this.state.password,
            phone: this.state.phone_number
        }})
        .then((resp) => {
            console.log(resp.data.id_login)
            AsyncStorage.setItem('@id_login', resp.data.id_login)
            this.props.navigation.reset({
                routes: [{ name: 'KtpnPhone' }]
            })
        })
        .catch(err => {
            console.log("INSERT USER BY EMAIL => "+err)
        })
    }

    render = () =>
        <LinearGradient colors={[ '#6FC3F7', '#3269B3' ]} style={{ width: '100%', height: '100%' }}>
            <View style={{ width: '100%', height: wp('30%'), alignItems: 'center', marginTop: wp('40%') }}>
                <Image source={require('../assets/logo.png')} style={{ width: wp('60%'), height: wp('14.6%') }} />
            </View>
            <View style={{ width: '100%', alignItems: 'center', marginTop: wp('5%') }}>
                <View style={{ width: wp('60%') }}>
                    <Text style={{ fontSize: wp('7%'), color: 'white' }}>Enter Full Name</Text>
                </View>
                <View style={{ width: wp('60%'), height: wp('11%'), backgroundColor: 'white', borderRadius: wp('2.22223%'), marginTop: wp('3%'), elevation: 4, flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../assets/icons/phone-call.png')} style={{ width: wp('5%'), height: wp('5%'), marginLeft: wp('3%'), tintColor: (this.state.phone_number === '' ? '#D3D3D3' : 'black') }} />
                    <TextInput
                        style={{ marginLeft: wp('3%'), width: wp('48%') }}
                        placeholder="name"
                        onChangeText={(text) => this.setState({ name: text })}
                        value={this.state.name}
                    />
                </View>
                <TouchableOpacity onPress={this.signUp} style={{ width: wp('60%'), height: wp('11%'), backgroundColor: 'white', borderRadius: wp('2.22223%'), marginTop: wp('3%'), marginBottom: wp('3%'), elevation: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: wp('4.5%') }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
}