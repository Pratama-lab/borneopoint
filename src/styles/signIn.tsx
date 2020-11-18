import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  layout: {
    // height          : '100%',
    // display         : 'flex',
    // flexDirection   : 'column',
    // flex            : 1,
    height: '100%',
    justifyContent  : 'center',
    alignItems      : 'center',
    // backgroundColor : '#2c2c2c'
    // position        : 'relative',
  },
  linearGradient: {
    width     : '100%',
    height    : '100%',
    position  : 'absolute',
    top       : 0,
    left      : 0,
    zIndex    : 1,
  },
  logoContainer: {
    display         : 'flex',
    flexDirection   : 'column',
    alignItems      : 'center',
    justifyContent  : 'center',
    marginTop       : wp('20%'),
    zIndex          : 1
  },
  logoImageContainer: { 
    width: wp('50%'),
    aspectRatio: (1/1)
  },
  logoImage: { flex: 1,aspectRatio: (1/1) },
  logoNameText: {
    fontFamily    : 'Ubuntu-Regular',
    fontWeight    : 'normal',
    fontSize      : wp('8%'),
    marginTop     : wp('2.5%'),
    color         : 'white'
  },
  input: {
    marginTop: wp('3.334')
  },
  inputContainer: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('66.6%')
  },
  pageText: { 
    // flex: 
    width: '100%',
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: wp('6.6667')
  },
  noAccountInfo: {
    fontSize            : wp('3.333%'),
    color               : 'white',
    marginTop           : wp('5%'),
    zIndex              : 1
  },
  socialLoginContainer: { 
    flexDirection       : 'row',
    marginTop           : wp('3.334')
  },
  linkText: {
    textDecorationLine  : 'underline',
    color               : 'white',
    fontSize            : wp('3.333%'),
  },
  socialDistancing: {
    width: wp('3.333%')
  },
  forgotPassword : {
    zIndex              : 1,
    textDecorationLine  : 'underline',
    color               : 'white',
    fontSize            : wp('3.333%'),
  },
  loginButton: {
    marginTop       : wp('3.334'),
    width           : wp('66.6%'),
    backgroundColor : 'white',
    aspectRatio     : (240/40),
    borderRadius    : wp('2.223%'),
    elevation       : 4,
    justifyContent  : 'center',
    alignItems      : 'center'
  },
  loginText: {
    fontSize        : wp('4%'),
    fontWeight      : 'bold'
  }
})