import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    marginTop: wp('1.5%')
  },
  infoLabel: {
    fontSize: wp('3.888889%'),
    fontWeight: 'bold',
    flex: 1
  },
  infoText: {
    flex: 1,
    fontSize: wp('3.888889%'),
  },
  resetPassText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: wp('3.888889%'),
  },
  infoTitle: {
    fontWeight: 'bold', 
    fontSize: wp('5%')
  },
  signOutButton: { 
    width: wp('64.44444444444444%'), 
    justifyContent: 'center', 
    alignItems: 'center', 
    aspectRatio: 232/48, 
    backgroundColor: '#3269B3', 
    borderRadius: wp('2.2222222222222223%')
  },
  signOutText: {
    color: 'white',
    fontSize: wp('5%'),
    // fontWeight: 'bold'
    fontFamily: 'Ubuntu-Bold'
  }
})