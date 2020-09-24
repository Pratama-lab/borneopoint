import React, { Component, PureComponent } from 'react'
import { View } from 'react-native'

class Layout extends PureComponent{
  constructor(props: any){
    super(props)
  }
  render = () => 
    <View style={{
      height: '100%'
    }}>
    { this.props.children}
    </View>
}

export default Layout