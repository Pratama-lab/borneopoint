import React from 'react'
import { View, Text, Image, TouchableOpacity, BackHandler } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { AuthContext } from '../context'


class Waiting extends React.Component {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
        this.state = {
        }
    }

    componentDidMount = () => {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }

    handleBackPress = () => {
        if (this.props.navigation.isFocused()) {
            BackHandler.exitApp()
        }
        return true;
    }

    render = () =>
        <LinearGradient colors={[ '#6FC3F7', '#3269B3']} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: wp('90%'), alignItems: 'center' }}>
                <Image source={require('../assets/task_planning.png')} style={{ width: wp('35%'), height: wp('35%') }} />
                <Text style={{ fontFamily: 'Ubuntu-Bold', color: 'white', fontSize: wp('8%') }}>Verifying</Text>
            </View>
            <View style={{ width: wp('90%'), marginTop: wp('8%'), marginBottom: wp('50%') }}>
                <Text style={{ fontFamily: 'Ubuntu-Bold', color: 'white', textAlign: 'center', fontSize: wp('4.5%') }}>Your account is being verified, please wait in a few days</Text>
            </View>
            <View style={{ width: wp('90%'), alignItems: 'center', position: 'absolute', bottom: wp('10%') }}>
                <TouchableOpacity onPress={() => this.props.navigation.reset({ routes: [{ name: 'Main' }] })} style={{ width: wp('20%'), backgroundColor: 'white', elevation: 4, borderRadius: wp('5%'), alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Ubuntu_Bold', fontSize: wp('5%'), marginTop: wp('2%'), marginBottom: wp('2%') }}>OK</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
}

export default (props) => 
    <AuthContext.Consumer>
        { authState => <Waiting authState={authState} {...props}/> }
    </AuthContext.Consumer>