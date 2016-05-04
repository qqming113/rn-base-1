
import styles from './Styles/BubblePopUpStyle'
import Triangle from '../Components/Triangle'
import { Colors, Images, Metrics } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome'
import Actions from '../Actions/Creators'
import Routes from '../Navigation/Routes'
import I18n from '../I18n/I18n.js'
import { connect } from 'react-redux'
import R from 'ramda'
import Linking from 'Linking'
import React, {
	StyleSheet,
	View, 
	Component, 
	Text,
	TouchableHighlight,
	TouchableOpacity,
	PropTypes,
	Platform,
} from 'react-native'

export default class BubblePopUp extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			isVisible: false,
			itemFuncName: null,
		}
	}

	static propTypes = {
	    isVisible: PropTypes.bool,
	    onClose: PropTypes.func,
  	}

	render () {

		const elementWidth  = this.props.elementWidth
		const elementHeight = this.props.elementHeight
		const elementCounts = this.props.items.length
		const talkBubbleHeight = elementHeight * (elementCounts) + Metrics.fonts.large + elementHeight + elementCounts * 2

		if (this.props.isVisible){
			return (
				<View style={styles.screenContainer}>
			        <View style={styles.bubbleContainer}
			        	  width={elementWidth}
			        	  marginLeft={10}
			        	  marginTop={10}>
						<View style={styles.squareContainer} 
								width={elementWidth}
								height={talkBubbleHeight}>
							<View 
								style={styles.headerContainer}
								elementHeight = {elementHeight}>
								<Text style={styles.headerText}
								height={elementHeight}
								>Instruction</Text>
							</View>
							 {this.props.items.map((item, i) => 	
								  <TouchableHighlight  
								  		key ={i} 
								  		width={elementWidth}
								  		height={elementHeight}
								  		onPress ={ 	this.handlePressItem.bind(this, item.func)}
								  		key={i}>
								      <View >
								        <View style={styles.rowContainer} 
								        	height={elementHeight}>
								          <Icon      
								      		 name={item.icon}	      		
								      		 size={Metrics.icons.small}
								      		 color={'blue'}
								      		 />
								          <View  style={styles.textContainer}>
								            <Text style={styles.title}>{item.text}</Text>
								            <Text style={styles.description}
								                  numberOfLines={1}>{item.func}
								            </Text>
								          </View>
								        </View>
								        <View style={styles.separator}/>
								      </View>
								    </TouchableHighlight>)}
				    	    <View height={elementHeight}> 
      			    	  		<TouchableOpacity 
      			    	  			style={styles.closeButtonWraper} 
      			    	  			onPress={this.props.onClose}>
					              <View style={styles.closeButton}
					              height={elementHeight}>
					                <Text style={styles.closeText}>{I18n.t('cancel')}</Text>
					              </View>
					            </TouchableOpacity>
		    			   	</View>
						</View>

						<View style={styles.triangleContainer}>
		    			   	<Triangle style={styles.triangleRight}
			          			size={30}
								color={'white'}
								left={5}
								top={elementHeight} 
							/>
						</View>
	    			</View>
				</View>
			)
		}

		return (
			null
		)
	}

	handlePressItem(_itemFuncName) {
		switch (_itemFuncName) {
			case 'showHelpScreen': 
				this.showHelpScreen()
				break
			case 'showUserLocation': {
				this.showUserLocation()
				break
			}
			case 'JSONLocation':
				this.showJSONInfo()
				break

			default: {
				alert(_itemFuncName)
				break
			}
		}	
	}

	showHelpScreen () {
	    const { navigator } = this.props
	    const route = Routes.HelpScreen
	    navigator.push(route)
	}

	showUserLocation () {
		//Close popup first
		if (typeof this.props.onClose === 'function') {
            this.props.onClose()
        }
        // move to current location
		const {dispatch} = this.props
		dispatch(Actions.requestLocation())
	}

	showJSONInfo () {
		//Close popup first
		if (typeof this.props.onClose === 'function') {
            this.props.onClose()
        }

        //show JSON info test
		const { latitude, longitude } = this.props
	
		const {dispatch} = this.props
		dispatch(Actions.requestJsonByCoords(latitude, longitude))
		//const json = this.props.json

	}

}


const mapStateToProps = (state) => {
  return {
    latitude: state.mapscreen.latitude,
    longitude: state.mapscreen.longitude,
  }
}

export default connect(mapStateToProps)(BubblePopUp)