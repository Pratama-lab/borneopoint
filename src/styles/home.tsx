import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: 'white'
  },
  pageContent: {
    paddingTop: wp('5%'),
    paddingBottom: wp('5%'),
    alignItems: 'center'
  },
  walletCard: {
    width: wp('90%'),
    backgroundColor: 'white',
    borderRadius: wp('8.8889%'),
    elevation: 4,
    position: 'relative'
  },
  ppobContainer: {
    width: wp('90%'),
    aspectRatio: 326/176,
    backgroundColor: 'white',
    borderRadius: wp('2.223%'),
    elevation: 4,
    marginTop: wp('5%')
  },
  profileWalletContainer: {
    height: wp('20%'),
    // backgroundColor: 'red',
    alignItems: 'center',
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
    flexDirection: 'row'
  },
  walletOperationContainer: {
    height: wp('20%'),
    justifyContent: 'center',
    flexDirection: 'row'
  },
  topPPOB: {
    flex: 1,
    flexDirection: 'row'
  },
  bottomPPOB: {
    flex: 1,
    flexDirection: 'row'
  },
  qrButton: {
    position: 'absolute',
    top: wp('2.222223%'),
    right: wp('2.222223%'),
    height: wp('17.777778%'),
    aspectRatio: 1/1,
    borderRadius: wp('17%'),
    backgroundColor: '#3269B3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  qrImage: {
    height: wp('8.5%'),
    width: wp('8.5%')
  },
  scanText: {fontWeight: 'bold', color: 'white', fontSize: wp('2.8%')},
  profilePictureContainer : {
    width: wp('13.33334%'),
    aspectRatio: 1/1,
    backgroundColor: '#ccc',
    borderRadius: wp('13%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  userContainer: {
    width: wp('60%'),
    marginLeft: wp('2%'),
  },
  usernameContainer: {
    // flex: 1,
    // backgroundColor: 'red'
    // width: 'minContent'
  },
  userText: {
    fontWeight  : 'bold',
    fontSize    : wp('4%')
  },
  walletContainer: {
    backgroundColor: '#3269B3',
    borderRadius: 120
  },
  walletText: {
    fontSize    : wp('3.8889%'),
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 2,
    paddingTop: 2,
    paddingLeft: 16,
    paddingRight: 16,
  },
  walletItemContainer: {
    height: '100%',
    aspectRatio: 1/1,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  walletItemImage: {
    height: '40%',
    aspectRatio: 1/1,
    // backgroundColor: 'red'
  },
  walletItemText: {
    color: '#3269B3',
    fontWeight: 'bold',
    fontSize: wp('3.3335%')
  },
  ppobItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ppobItemImage: {
    height: '30%',
    aspectRatio: 1/1
  },
  ppobItemText: {
    marginTop: 4
  },
  infoAndPromotionContainer: {
    width: '100%',
    marginTop: wp('5%'),
  },
  infoAndPromotionText: {
    marginLeft: wp('5%'),
    fontWeight: 'bold',
    fontSize: wp('5%')
  },
  scrollerContainer: {
    width: '100%'
  },
  innerScrollerContainer: {
    paddingLeft: wp('5%'),
    paddingTop: wp('2.5%'),
    paddingBottom: wp('2.5%'),
    paddingRight: wp('5%'),
    flexDirection: 'row'
  },
  flatlistSeparator: {
    width: wp('5%'),
  }
})