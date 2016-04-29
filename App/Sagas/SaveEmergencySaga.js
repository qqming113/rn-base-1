import Client from '../Services/HttpClient'
import { take, call, put } from 'redux-saga/effects'
import R from 'ramda'
import Types from '../Actions/Types'
import Actions from '../Actions/Creators'
import config from '../Config/AppSetting'

function * saveEmergency (emergency) {
  return fetch(config.url + 'classes/Emergency', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': config.parse_id,
        'X-Parse-REST-API-Key': config.parse_api_key
      },
      body: JSON.stringify(
        emergency
      )
	}).then(response => response.json())
}

export function * watchSaveEmergency() {
    while(true){  
      const {emergency} = yield take(Types.SAVE_EMERGENCY)
      const ok = yield call(saveEmergency, emergency)
      if(ok){
     	  yield put(Actions.saveEmergencySuccess(ok)) 
      }else{
        yield put(Actions.saveEmergencyFailure())
      }
 }
}
