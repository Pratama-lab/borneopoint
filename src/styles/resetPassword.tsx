import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  pageContainer: {
    height: '100%',
    width: '100%'
  },
  emailInputContainer: {
    width: wp('90%'),
    aspectRatio: 328/48,
    borderRadius: wp('2.22223%'),
    backgroundColor: 'white',
    elevation: 2,
    marginTop: wp('5%'),
    alignSelf: 'center'
  },
  emailInput: {
    marginLeft: wp('5%'),
    flex: 1,
    fontSize: wp('5%')
  },
  resetButton: {
    width: wp('64.444%'),
    aspectRatio: 232/48,
    backgroundColor: '#3269B3',
    elevation: 2,
    borderRadius: wp('2.22223%'),
    marginTop: wp('5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    fontSize: wp('5%'),
    // fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Ubuntu-Bold'
  }
})