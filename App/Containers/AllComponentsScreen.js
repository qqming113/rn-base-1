// An All Components Screen is a great way to dev and quick-test components
import React, 
  { 
    View, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    PropTypes, 
    StyleSheet,
    Alert,
    TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/AllComponentsScreenStyle'
import ProgressiveImage from '../Components/ProgressiveImage'
import { Colors, Images, Metrics } from '../Themes'
import Actions from '../Actions/Creators'
import Routes from '../Navigation/Routes'
// external libs
import Icon from 'react-native-vector-icons/FontAwesome'
import Animatable from 'react-native-animatable'

// I18n
import I18n from '../I18n/I18n.js'
import MapView from 'react-native-maps';
import VectorIcon from 'react-native-vector-icons/Ionicons'
import mapstyle from './Styles/MapScreenStyle'
import FakePopup from './FakePopupScreen'
import fakePopupStyle from './Styles/FakePopupScreenStyle'
import CircleIcon from '../Components/CircleIcon'
import MapScreen from '../Components/MapScreen'
import BubblePopUp from './BubblePopUp.js'
import CustomListView from './CustomListView'


var fireItems = [ 
      {icon: 'fire', text: 'Show Info Screen', func: 'showHelpScreen'}, 
      {icon: 'fire', text: 'Show Location', func: 'showUserLocation'}, 
      {icon: 'fire', text: 'Location Info', func: 'JSONLocation'}, 
      {icon: 'fire', text: 'item4', func: 'call4'}, 
      {icon: 'fire', text: 'item5', func: 'call5'}, 
    ];

var ambulanceItems  = [ 
      {icon: 'ambulance', text: 'Ambulance Call', func: 'ambulanceCall'}, 
      {icon: 'ambulance', text: 'item2', func: 'call2'}, 
      {icon: 'ambulance', text: 'item3', func: 'call3'}, 
      {icon: 'ambulance', text: 'item4', func: 'call4'}, 
      {icon: 'ambulance', text: 'item5', func: 'call5'}, 
      {icon: 'ambulance', text: 'item6', func: 'call6'},
    ];
var policeItems =  [ 
      {icon: 'bell', text: 'item1', func: 'call1'}, 
      {icon: 'bell', text: 'item2', func: 'call2'}, 
      {icon: 'bell', text: 'item3', func: 'call3'}, 
      {icon: 'bell', text: 'item4', func: 'call4'}, 
      {icon: 'bell', text: 'item5', func: 'call5'}, 
      {icon: 'bell', text: 'item6', func: 'call6'},
    ];

const POP_UP_FIRE = 0;
const POP_UP_AMBULANCE = 1;
const POP_UP_POLICE = 2;

export default class AllComponentsScreen extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isPopupShow: false,
      leftPosClick: null,
      topPopUpPos: null,
      items: [],
      alert_isVisible: false,
    }

    this.handlePressLogin = this.handlePressLogin.bind(this)
    this.handlePressLogout = this.handlePressLogout.bind(this)
    this.handleRequestLocation  = this.handleRequestLocation.bind(this)
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool,
    dispatch: PropTypes.func,
    temperature: PropTypes.number,
    city: PropTypes.string,
    latitude:  PropTypes.number,
    longitude: PropTypes.number,
    json: PropTypes.object
  };


  componentWillMount () {
    this.props.navigator.state.tapHamburger = () => {
      this.props.navigator.drawer.toggle()
    }
  }

  // fires when the user presses the login button
  handlePressLogin () {
    const { navigator } = this.props
    const route = Routes.LoginScreen
    navigator.push(route)
  }

  // fires when the user presses the logout button
  handlePressLogout () {
    const { dispatch } = this.props
    dispatch(Actions.logout())
  }

  handleRequestLocation() {
    const { dispatch } = this.props
    dispatch(Actions.requestLocation())
  }

  handleRequestCall() {
    //const { dispatch } = this.props
    //dispatch(Actions.requestCall())

  }

  handleRequestShowDirection() {
    //temp do nothing
  }

  handleShowPopUp (_items, left, top) {
    this.setState({items: _items})
    this.setState({isPopupShow: true})
    this.setState({leftPosClick: left})
    this.setState({topPopUpPos: top})
  }

  handleClosePopUp () {
    this.setState({isPopupShow: false})
  }



  renderLoginButton () {
    return (
      <View style={styles.loginBox}>
        <TouchableOpacity onPress={this.handlePressLogin}>
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>{I18n.t('signIn')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderLogoutButton () {
    return (
      <View style={styles.loginBox}>
        <TouchableOpacity onPress={this.handlePressLogout}>
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>{I18n.t('logOut')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  showHelpScreen () {
      const { navigator } = this.props
      const route = Routes.HelpScreen
      navigator.push(route)
  }

  render () {
    const { loggedIn, temperature, city } = this.props
    //console.log('__' + Metrics.screenHeight )
    return (
      <View style={styles.screenContainer}>
        <MapScreen 
            latitude={this.state.latitude}
            longitude={this.state.longitude}
        />
        <View style={styles.infoIconContainer}>
          <CircleIcon 
                  name='info'
                  width={20}
                  height={20}
                  iconSize={Metrics.icons.medium}
                  color={Colors.error}
                  onPress={this.handleShowPopUp.bind(this, fireItems, Metrics.screenWidth  / 10, 30)}
          />
        </View>
        <BubblePopUp  items={this.state.items}
            elementWidth={Metrics.screenWidth * 4 / 5}
            elementHeight={30}
            topPopUpPos={this.state.topPopUpPos}
            leftPosClick={this.state.leftPosClick}
            isVisible={this.state.isPopupShow}
            onClose={this.handleClosePopUp.bind(this)}
            navigator={this.props.navigator}
            dispatch={this.props.dispatch}
        />
        <View style={mapstyle.icons_container}>
              <CircleIcon
                name='fire-extinguisher'
                width={60}
                height={60}
                iconSize={Metrics.icons.medium}
                color={Colors.error}
                onPress={this.showConfirmDialog.bind(this, 
                                                    'Do you want to make this call ?',
                                                    'Only make this call when you are in an emergency! ' +
                                                     'Please confirm to make the call to FIRE STATION: ',
                                                     '+84982709185' )}
                />
              <CircleIcon
                name='ambulance'
                iconSize={Metrics.icons.medium}
                color={Colors.error}
                onPress={this.showConfirmDialog.bind(this, 
                                                    'Do you want to make this call ?',
                                                    'Only make this call when you are in an emergency! ' +
                                                     'Please confirm to make the call to AMBULANCE STATION: ',
                                                     '+84982709185' )}
                />
              <CircleIcon
                name='bell'
                width={60}
                height={60}
                iconSize={Metrics.icons.medium}
                color={Colors.error}
                onPress={this.showConfirmDialog.bind(this, 
                                                    'Do you want to make this call ?',
                                                    'Only make this call when you are in an emergency! ' +
                                                     'Please confirm to make the call to POLICE STATION: ',
                                                     '+84982709185' )}
              />
       </View>   
     </View>
    )
  }

  showConfirmDialog (_title, _message, _phoneNumber) {
    this.setState({
      alert_isVisible: true,
    })

     Alert.alert(
            _title,
            _message + _phoneNumber,
            [
               {text: 'Cancel', onPress: () => this.handleOnCancelAlert.bind(this)},
              {text: 'OK', onPress: () => this.handleOnConfirmDialog.bind(this, _phoneNumber)},
            ]
    )
  }
  handleOnCancelAlert() {
    this.setState({
      alert_isVisible: false,
    })
  }

  handleOnConfirmDialog (_phoneNumber) {
    this.setState({
      alert_isVisible: false,
    })
   Communications.phonecall(_phoneNumber, false)
  } 
}

const style1s = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    loggedIn: state.login.username !== null,
    temperature: state.weather.temperature,
    city: state.weather.city,
    latitude: state.mapscreen.latitude,
    longitude: state.mapscreen.longitude,
    json: state.mapscreen.json
  }
}

export default connect(mapStateToProps)(AllComponentsScreen)
