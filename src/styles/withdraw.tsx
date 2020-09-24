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
    marginRight: wp('5%'),
    // flexDirection: 'row',
    zIndex: 1
  },
  optionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'black'
  },
  bankItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
    padding: wp('2%'),
    alignItems: 'center',
    borderRadius: wp('2.22223%'),
    zIndex: 9
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
    // marginTop: wp('3%')
  },
  textInputContainer: {
    marginTop: wp('1.5%'),
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: wp('2.22223%'),
    height: wp('13.333334%'),
    justifyContent: 'center'
  },
  textInput: {
    // padding: wp('3%'),
    fontSize: wp('4%'),
    color: 'black',
    paddingLeft: wp('5%')
  },
  confirmButton: {
    alignSelf: 'center',
    marginTop: wp('5%'),
    width: wp('64.44444%'),
    aspectRatio: 232/48,
    backgroundColor: '#3269B3',
    borderRadius: wp('2.22223%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmButtonText: {
    fontSize: wp('5%'),
    color: 'white',
    fontFamily: 'Ubuntu-Bold'
  },
  bankTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'black',
    marginLeft: wp('5%'),
    marginTop: wp('5%')
  },
  dropDown: {
    marginTop: wp('1.5%'),
    position: 'relative',
    width: wp('90%'),
    // aspectRatio: 328/48,
    height: wp('13.33334%'),
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: wp('2.22223%'),
    alignSelf: 'center'
  },
  dropDownContainer: {
    position: 'absolute',
    bottom: -wp('40%'),
    backgroundColor: 'white',
    // height: wp('10%'),
    width: '100%',
    zIndex: 3
  },
  placeholderContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  bankIconContainer: {
    height: '100%',
    aspectRatio: 1/1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankIcon: {
    height: '50%',
    width: '50%'
  },
  placeholderBankText: {
    color: '#ccc',
    fontSize: wp('4%'),
    flex: 1
  }
})