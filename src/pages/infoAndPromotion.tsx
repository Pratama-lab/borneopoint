import React, { Component } from 'react'
import { ScrollView,Text, Image,View } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

class InfoAndPromotion extends Component<any>{
  constructor(props){
    super(props)
  }
  render= () => 
    <ScrollView style={{flex: 1}} contentContainerStyle={{padding: widthPercentageToDP('5%')}}>
      <View style={{elevation: 2}}>
        <Image 
          style={{width: '100%', aspectRatio: 16/9, marginBottom: widthPercentageToDP('5%'), borderRadius: widthPercentageToDP('2.5%')}}
          resizeMode={'cover'}
          source={{
            uri: 'https://picsum.photos/300/200',
            cache: 'only-if-cached'
          }}/>
      </View>
      <Text style={{fontWeight: 'bold', fontSize: widthPercentageToDP('5%')}}>{this.props.route.params.name}</Text>
      <Text style={{fontSize: widthPercentageToDP('4%')}}>{this.props.route.params.description}</Text>
    </ScrollView>
}

export default InfoAndPromotion