import React, { Component } from 'react'
import { ScrollView, Text, View } from 'react-native'
import styles from '../styles/termsAndCondition'

class TermsAndCondition extends Component{
  constructor(props){
    super(props)
  }
  render = () => 
  <ScrollView style={styles.pageContainer} contentContainerStyle={styles.contentPageContainer}>
    {/* <View> */}
      <Text style={styles.termTitleText}>Terms And Condition</Text>
    {/* </View> */}
    {/* <View> */}
      <Text style={styles.descriptionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
    {/* </View> */}
  </ScrollView>
}

export default TermsAndCondition