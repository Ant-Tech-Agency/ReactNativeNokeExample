import { NativeModules, NativeEventEmitter } from 'react-native'

const { RNNoke } = NativeModules
const NokeEmitter = new NativeEventEmitter(RNNoke)

export default {
  addListener: (eventName, callback) => {
    NokeEmitter.addListener(eventName, callback)
    return this
  },

  initService: RNNoke.initService,
  unlockOffline: RNNoke.unlockOffline,
  deviceInfo: RNNoke.deviceInfo,
  changeLock: RNNoke.changeLock,
  disconnect: RNNoke.disconnect
}