import React from 'react'
import { View, Text, ScrollView, BackHandler } from 'react-native'
import FastImage from 'react-native-fast-image'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { AuthContext } from '../context'


class InfoDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    componentDidMount = () => {
        axios.get('https://borneopoint.co.id/public/api/get_media_detail', {params: {
            id: this.props.route.params.id
        }})
        .then(resp => {
            console.log("DEALS ID => ", this.props.route.params.id)
            console.log("RESPON => ", resp.data)
            this.setState({
                loading: false,
                image: resp.data[0].images,
                deskripsi: resp.data[0].description
            })
        })
    }

    componentWillMount = () => {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    }

    render = () => 
    <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ width: '100%', alignItems: 'center', marginTop: wp('3%') }}>
            <FastImage source={{ uri: 'https://borneopoint.co.id/public/storage/media_images/'+this.state.image }} style={{ width: wp('90%'), height: wp('40%'), borderRadius: wp('2.22223%'), marginTop: wp('2%'), marginBottom: wp('2%') }} />
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginTop: wp('5%'), marginBottom: wp('5%') }}>
            <View style={{ borderBottomWidth: 1, width: wp('90%'), borderBottomColor: '#CCC' }} />
            <View style={{ width: wp('90%'), marginTop: wp('5%') }}>
                <Text style={{ textAlign: 'justify', fontFamily: 'Ubuntu-Regular' }}>{this.state.deskripsi}</Text>
            </View>
        </View>
    </ScrollView>
}

export default (props) => 
<AuthContext.Consumer>{
  authState => <InfoDetail authState={authState} {...props}/>
}</AuthContext.Consumer>