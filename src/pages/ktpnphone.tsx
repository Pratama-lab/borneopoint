import React from 'react'
import { View, Text, ImageBackground, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, BackHandler } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler'
import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'


export default class ktpnphone extends React.Component {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.state = {
            phone_number: undefined,
            ktp: undefined,
            ktp_image: '',
            uri: '',
            fileName: '',
            selfiektp: '',
            loading: false,
            name: undefined,
            email: undefined,
            status: '',
        }
    }

    componentDidMount = async () => {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
        const id_login = await AsyncStorage.getItem('@id_login')
        axios.get('https://borneopoint.co.id/api/get_user', {params: {
            id_login: id_login
        }})
        .then(resp => {
            this.setState({
                name: resp.data.name,
                email: resp.data.email,
                status: resp.data.status
            })
            // console.log(resp.data)
        })
    }

    createFormDataPhoto = (ktp_image, selfiektp, id_login) => {
	    const data = new FormData();
	    data.append('gambar_ktp', {
	      name: (ktp_image.fileName == null)? 'myphoto': ktp_image.fileName,
	      type: ktp_image.type,
	      uri: ktp_image.uri
	    });
	    data.append('gambar_selfie', {
	      name: (selfiektp.fileName == null)? 'myphoto': selfiektp.fileName,
	      type: selfiektp.type,
	      uri: selfiektp.uri
	    });
		data.append("id_login", id_login);
		data.append("name", this.state.name);
		data.append("email", this.state.email);
		data.append("phone", this.state.phone_number);
        data.append("no_ktp", this.state.ktp);
        data.append("verification", '');
	    return data;
	};

    submit = async () => {
        const id_login = await AsyncStorage.getItem('@id_login')
        this.setState({ loading: true })

        fetch('https://borneopoint.co.id/public/api/update_user_profile', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'multipart/form-data'
	      },
	      body: this.createFormDataPhoto(this.state.ktp_image, this.state.selfiektp, id_login)
	    })
		.then(response => response.json())
		.then(resp => {
            // console.log(resp)
	        // alert(JSON.stringify(resp));
			this.setState({
				loading: false
            })
            this.props.navigation.navigate('Waiting')
		})
		.catch(error => {
	        console.log('Upload Error', error);
	        // alert(JSON.stringify(error))
		});
    }

    ktpp = () => {
	    let options = {
	      storageOptions: {
	        skipBackup: true,
	        path: 'images',
	      },
	    };
		ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response.fileName);
                this.setState({
                uri: {uri: response.uri},
                ktp_image: response,
                fileName: response.fileName
                });
            }
		});
    }

    selfiewithktp = () => {
        let options = {
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response.fileName);
                this.setState({
                uri: {uri: response.uri},
                selfiektp: response,
                fileName: response.fileName
                });
            }
        });
    }
    
    renderFileUri() {
	    if (this.state.ktp_image) {
            return <FastImage
                source={{ uri: this.state.ktp_image.uri }}
                style={{ width: '100%', height: '100%', borderRadius: wp('3%') }}
            />
	    } else {
            return <>
                <Image source={require('../assets/ktp1.jpg')} style={{ width: '100%', height: '100%', borderRadius: wp('3%') }} />
                <View style={[ styles.container_loading, { borderRadius: wp('3%') }]}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={this.ktpp}>
                        <Image source={require('../assets/icons/arrow_up.png')} style={{ tintColor: 'white', width: wp('7%'), height: wp('5.5%') }} />
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp('5%') }}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
            </>
	    }
    }
    
    renderFile() {
	    if (this.state.selfiektp) {
            return <FastImage
                source={{ uri: this.state.selfiektp.uri }}
                style={{ width: '100%', height: '100%', borderRadius: wp('3%') }}
            />
	    } else {
            return <>
                <Image source={require('../assets/ktp-selfie.jpg')} style={{ width: '100%', height: '100%', borderRadius: wp('3%') }} />
                <View style={[ styles.container_loading, { borderRadius: wp('3%') }]}>
                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={this.selfiewithktp}>
                        <Image source={require('../assets/icons/arrow_up.png')} style={{ tintColor: 'white', width: wp('7%'), height: wp('5.5%') }} />
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: wp('5%') }}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
            </>
	    }
    }

    handleBackPress = () => {
        if (this.props.navigation.isFocused()) {
            BackHandler.exitApp()
        }
        return true;
    }

    render = () =>
        <>
            {this.state.loading ?
                <View style={[ styles.container_loading1, styles.horizontal_loading ]}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
                :
                null
            }
            <LinearGradient colors={[ '#6FC3F7', '#3269B3']} style={{ width: '100%', height: '100%' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginTop: wp('10%') }}>
                        <View style={{ width: wp('80%') }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%'), color: 'white' }}>KTP Number</Text>
                        </View>
                        <TextInput
                            style={{ width: wp('80%'), height: wp('12%'), backgroundColor: 'white', elevation: 4, borderRadius: wp('2.22223%'), marginTop: wp('3%'), marginBottom: wp('2%') }}
                            placeholder="Enter Your KTP Number"
                            keyboardType={'phone-pad'}
                            onChangeText={(text) => this.setState({ ktp: text })}
                            value={this.state.ktp}
                        />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: wp('5%') }}>
                        <View style={{ width: wp('80%') }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%'), color: 'white' }}>Phone Number</Text>
                        </View>
                        <TextInput
                            style={{ width: wp('80%'), height: wp('12%'), backgroundColor: 'white', elevation: 4, borderRadius: wp('2.22223%'), marginTop: wp('3%'), marginBottom: wp('2%') }}
                            placeholder="Enter Your Phone Number"
                            keyboardType={'phone-pad'}
                            onChangeText={(text) => this.setState({ phone_number: text })}
                            value={this.state.phone_number}
                        />
                    </View>
                    <View style={{ alignItems: 'center', marginTop: wp('5%') }}>
                        <View style={{ width: wp('80%') }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%'), color: 'white' }}>KTP</Text>
                        </View>
                        <View style={{ width: wp('80%'), height: wp('40%'), marginTop: wp('3%'), alignItems: 'center', justifyContent: 'center' }}>
                            {this.renderFileUri()}
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: wp('5%') }}>
                        <View style={{ width: wp('80%') }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp('5%'), color: 'white' }}>Selfie Your KTP</Text>
                        </View>
                        <View style={{ width: wp('65%'), height: wp('80%'), marginTop: wp('3%'), alignItems: 'center', justifyContent: 'center' }}>
                            {this.renderFile()}
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: wp('5%'), marginBottom: wp('5%') }}>
                        <TouchableOpacity onPress={this.submit} style={{ width: wp('30%'), backgroundColor: (this.state.ktp && this.state.phone_number && this.state.ktp_image && this.state.selfiektp ? '#FFF' : '#CCC'), borderRadius: wp('10%'), elevation: 4, alignItems: 'center' }} disabled={this.state.ktp === undefined || this.state.phone_number === undefined || this.state.ktp_image === '' || this.state.selfiektp === ''}>
                            <Text style={{ marginTop: wp('2%'), marginBottom: wp('2%'), fontWeight: 'bold' }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </>
}

const styles = StyleSheet.create({
    container_loading: {
        position:'absolute',
        width: '100%',
        height: '100%',
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,0.4)'
    },

    container_loading1: {
        flex: 1,
        position:'absolute',
        zIndex:2,
        width: '100%',
        height: '100%',
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,0.7)'
    },

    horizontal_loading: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
})

// 089676682323