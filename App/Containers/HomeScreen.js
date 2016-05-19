// An All Components Screen is a great way to dev and quick-test components
import React, { View, Text, PropTypes, Alert, AsyncStorage, Platform, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/HomeScreenStyle'
import { Colors, Images, Metrics } from '../Themes'
import Actions from '../Actions/Creators'
import Routes from '../Navigation/Routes'
import MapScreen from '../Components/MapScreen'
import BubblePopUp from './BubblePopUp.js'
import Icon from 'react-native-vector-icons/FontAwesome'
import {MKButton,MKColor} from 'react-native-material-kit'
import Communications from 'react-native-communications'
import PushNotification from 'react-native-push-notification'
import I18n from '../I18n/I18n.js'
import config, { homeInfoListData } from '../Config/AppSetting'
import SendIntentAndroid from 'react-native-send-intent'
import NavigationBar from '../Components/NavigationBar'

export default class HomeScreen extends React.Component {

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      isPopupShow: false,
      items: []
    }
  }

  componentWillMount () {
    this.props.navigator.state.tapHamburger = () => {
      this.props.navigator.drawer.toggle()
    }
  }

  handleShowPopUp (_items) {
    this.setState({
      items: _items,
      isPopupShow: true
    })
  }

  handleClosePopUp () {
    this.setState({isPopupShow: false})
  }

  showConfirmDialog (_title, _message, _phoneNumber, type) {
    Alert.alert(
      _title,
      _message + _phoneNumber,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel')},
        {text: 'OK', onPress: () =>  this.makePhoneCall(_phoneNumber)},
      ]
    )
    const {dispatch} = this.props  
    AsyncStorage.getItem(config.STORAGE_KEY_PROFILE).then((value) => {
     if (value !== null){
       dispatch(Actions.updateLocationAndSaveEmergency(type, value))
     }
    })
  }

  makePhoneCall (_phoneNumber) {
    if(Platform.OS === 'android'){
      SendIntentAndroid.sendPhoneCall(_phoneNumber)
    }
    else
      Communications.phonecall(_phoneNumber, false)
  }

  sendExtremeEmergency () {
    InteractionManager.runAfterInteractions(() => {
      const {dispatch} = this.props
      AsyncStorage.getItem(config.STORAGE_KEY_PROFILE).then((value) => {
      if (value !== null){
        dispatch(Actions.updateLocationAndSaveEmergency('alarm', value))
      }  
      this.props.navigator.push(Routes.CameraScreen)
    })
  })
}
  renderMapScreen () {
    return (<MapScreen />)
  }

  renderBubblePopUp () {
    return (
      <BubblePopUp  
        items={this.state.items}
        elementWidth={206}
        elementHeight={31}
        isVisible={this.state.isPopupShow}
        onClose={this.handleClosePopUp.bind(this)}
        navigator={this.props.navigator}
        dispatch={this.props.dispatch}
      />)
  }

  renderBottomButtons () {
    const Fab = MKButton.plainFab()
      .withStyle({
        width:Metrics.button.large, 
        height: Metrics.button.large, 
        borderRadius: Metrics.button.large / 2, 
      }).withBackgroundColor(Colors.snow)
      .build()

     if (!this.state.isPopupShow) {
        return (
          <View style={styles.icons_container}>
            <Fab onPress={this.showConfirmDialog.bind(this, 
              'Do you want to make this call ?',
              'Only make this call when you are in an emergency situation! ' +
              'Please confirm to make the call to FIRE STATION: ',
              '+84982709185', 
              'fire')}>
              <Icon name='fire' size={24} color='red' />
            </Fab>
            <Fab onPress={this.showConfirmDialog.bind(this, 
              'Do you want to make this call ?',
              'Only make this call when you are in an emergency situation! ' +
              'Please confirm to make the call to  AMBULANCE: ',
              '+84982709185',
               'ambulance')}>
              <Icon name='ambulance' size={24} color='red' />
            </Fab>
            <Fab onPress={ this.showConfirmDialog.bind(this, 
              'Do you want to make this call ?',
              'Only make this call when you are in an emergency situation! ' +
              'Please confirm to make the call to POLICE STATION: ',
              '+84982709185', 
              'police')}>
              <Icon name='bell' size={24} color='red' />
            </Fab>
          </View>   
        )
    }
    return null
  } 

  renderInfoButton () {
    const SmallFab = MKButton.plainFab()
      .withStyle({
        width:Metrics.button.medium, 
        height: Metrics.button.medium, 
        borderRadius: Metrics.button.medium/2, 
      }).withBackgroundColor(Colors.snow)
      .build()

    return (
      <View style={styles.infoIconContainer}>
        <SmallFab onPress={this.handleShowPopUp.bind(this, homeInfoListData)}>
          <Icon name='info' size={18} color='red' />
        </SmallFab>
      </View>
    )
  }

  renderExtremeButton () {
    const SmallFab = MKButton.plainFab()
      .withStyle({
        width:Metrics.button.medium, 
        height: Metrics.button.medium, 
        borderRadius: Metrics.button.medium/2, 
      }).withBackgroundColor(Colors.snow)
      .build()

    return (
      <View style={styles.extremeIconContainer}>
        <SmallFab onPress={this.sendExtremeEmergency.bind(this)}>
          <Icon name="warning" size={18} color="red" />
        </SmallFab>
      </View>
    )
  }

  renderNavigationBar () {
    const leftItem={layout: 'icon', title: 'Save', icon: 'android-menu', onPress: this.context.openDrawer}
    return (
      <NavigationBar
        title= {I18n.t('home')}
        style={{backgroundColor: Colors.drawerColor}}
        leftItem={leftItem}/>
    )
  }

  render () {

    return (
      <View style={styles.screenContainer}>
        { this.renderNavigationBar() }
        <View style={{flex: 1}}>
          { this.renderMapScreen() }
          { this.renderInfoButton() }
          { this.renderExtremeButton() }
          { this.renderBubblePopUp() }
          { this.renderBottomButtons() }
        </View>
      </View>
    )
  }
  
}

HomeScreen.contextTypes = {
  openDrawer: React.PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    ///
  }
}

export default connect(mapStateToProps)(HomeScreen)