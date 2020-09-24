import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  optionSectionContainer: {
    marginTop: wp('5%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%')
    // flexDirection: 'row'
  },
  optionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold'
  },
  bankItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    padding: wp('2%'),
    alignItems: 'center',
    borderRadius: wp('2.22223%')
  },
  bankLogo: {
    marginRight: wp('2.5%'),
    marginLeft: wp('5%')
  },
  bankText: {
    fontSize: wp('4%'),
    color: 'black'
  },
  bankItemMargin: {
    marginTop: wp('3%')
  }
})