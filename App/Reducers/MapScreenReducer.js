

import Types from '../Actions/Types'
import Immutable from 'seamless-immutable'
import createReducer from './CreateReducer'
import React, {
	Alert,
} from 'react-native'

export const INITIAL_STATE = Immutable({
	latitude:  null,
	longitude: null,
	fetching:  null,
	errorCode: null,
	json: null,
	city: null,
})

const request= (state, action) => 
	state.merge({
		fetching: true,
	})

const receive = (state, action) =>
	state.merge({
		fetching: false,
		latitude: action.latitude,
		longitude: action.longitude,
		errorCode: null,
	})

const failure = (state, action) =>
	state.merge({
		fetching: 	false,
		errorCode: 	true,
	})

const jsonRequest= (state, action) => 
	state.merge({
		fetching: true,
		latitude: action.latitude,
		longitude: action.longitude,
	})

const jsonReceive = (state, action) => {

	for ( let i = 0; i <  action.json.address_components.length; i++) {
		for (let j = 0; j < action.json.address_components[i].types.length; j++) {

			const type =  action.json.address_components[i].types[j]
			console.log('TYPE:' + type)

			if (type=="locality" || type=="administrative_area_level_1") { 
			  const currentCity = action.json.address_components[i].long_name
			  alert('Current City:' + currentCity)   
			  state.merge({ city: currentCity })
			  break;
			}
		}	
			
	}

	state.merge({
		fetching: false,
		json: action.json,
		errorCode: null,
	})

}

const jsonFailure = (state, action) =>
	state.merge({
		fetching: 	false,
		json: null,
		errorCode: 	true,
	})

const directionRequest = (state, action) => 
	state.merge({

	})

const directionReceive = (state, action) => 
	state.merge({
		
	})

const ACTION_HANDLERS = {
	[Types.MAP_LOCATION_REQUEST]: request,
	[Types.MAP_LOCATION_RECEIVE]: receive,
	[Types.MAP_LOCATION_FAILURE]: failure,
	[Types.MAP_JSON_REQUEST]: jsonRequest,
	[Types.MAP_JSON_RECEIVE]: jsonReceive,
	[Types.MAP_JSON_FAILURE]: jsonFailure,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)