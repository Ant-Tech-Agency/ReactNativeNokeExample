/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, NativeModules, PermissionsAndroid, TouchableOpacity, NativeEventEmitter } from 'react-native'
import axios from 'axios'

const token = 'eyJhbGciOiJOT0tFIiwidHlwIjoiSldUIn0.eyJhbGciOiJOT0tFIiwiY29tcGFueSI6MTAwMDE3OCwiZXhwIjoxNTUxMjQyNDcyLCJpc3MiOiJub2tlLmNvbSIsImxvZ291dElkIjoiIiwibm9rZVVzZXIiOjg2OTUsInRva2VuVHlwZSI6InNpZ25JbiJ9.5cc2aa5d105fcc3b506dec93c85a8f7d8a26cd16'

const RNNoke = NativeModules.RNNoke
const NokeEmitter = new NativeEventEmitter(RNNoke)
console.log(RNNoke)

NokeEmitter.addListener('onBluetoothStatusChanged', (data) => {
  console.log('onBluetoothStatusChanged', data)
})

export default class App extends Component {
  mac = ''
  session = ''
  offlineMap = {}

  async componentDidMount(): void {
    await this.requestCameraPermission()
    RNNoke.initService()

    NokeEmitter.addListener('onNokeDiscovered', (noke) => {
      console.log('onNokeDiscovered', noke)
    })
    NokeEmitter.addListener('onNokeConnecting', (noke) => {
      console.log('onNokeConnecting', noke)
    })
    NokeEmitter.addListener('onNokeConnected', (noke) => {
      console.log('onNokeConnected', noke)
      this.mac = noke.mac
      this.session = noke.session
      this.unlockOffline()
    })
    NokeEmitter.addListener('onNokeSyncing', (noke) => {
      console.log('onNokeSyncing', noke)
    })
    NokeEmitter.addListener('onNokeUnlocked', (noke) => {
      console.log('onNokeUnlocked', noke)
    })
    NokeEmitter.addListener('onNokeShutdown', (data) => {
      console.log('onNokeShutdown', data)
    })
    NokeEmitter.addListener('onNokeDisconnected', (noke) => {
      console.log('onNokeDisconnected', noke)
    })
    NokeEmitter.addListener('onDataUploaded', (data) => {
      console.log('onDataUploaded', data)
    })
    NokeEmitter.addListener('onError', (data) => {
      console.log('onError', data)
    })
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'ACCESS_COARSE_LOCATION',
          message: 'ACCESS_COARSE_LOCATION',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the ACCESS_COARSE_LOCATION')
      } else {
        console.log('ACCESS_COARSE_LOCATION permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  requestUnlockOffline = () => {
    const mac = this.mac
    if(!mac) {
      console.log("No lock connected")
      return
    }

    axios.post('https://v1.api.nokepro.com/lock/offline/', {
      mac
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log(response)
        if(response && response.data && response.data.data) {
          const data = response.data.data
          this.offlineMap[data.macAddress] = {
            command: data.command,
            key: data.key
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  requestUnlock = async () => {
    try {
      if(!this.session || !this.mac) {
        console.log("No lock connected")
        return
      }
      const response = await axios.post('https://v1.api.nokepro.com/lock/unlock/', {
        session: this.session,
        mac: this.mac
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log(response)
      if(response && response.data && response.data.data) {
        const noke = await RNNoke.unlock(response.data.data.commands)
        console.log(noke)
      }
    } catch (e) {
      console.log(e)
    }
  }

  unlockOffline = async () => {
    try {
      const {key, command} = this.offlineMap[this.mac]
      if(!key || !command) {
        console.log('No key or command')
        return
      }
      const noke = await RNNoke.unlockOffline(key, command)
      console.log(noke)
    } catch (e) {
      console.log(e)
    }
  }

  getInfo = async () => {
    try {
      const data = await RNNoke.deviceInfo()
      console.log(data)
    } catch (e) {
      console.log(e.message)
    }
  }

  changeLock = async (mac) => {
    try {
      const noke = await RNNoke.changeLock(mac)
      console.log(noke)
    } catch (e) {
      console.log(e)
    }
  }

  disconnect = async (mac) => {
    try {
      RNNoke.disconnect()
      RNNoke.stopScan()
    } catch (e) {
      console.log(e)
    }
  }

  renderButton = ({
                    title, onPress
                  }) => {
    return (
      <TouchableOpacity
        style={{
          height: 50,
          width: 200,
          backgroundColor: 'red',
          margin: 10,
        }}
        onPress={onPress}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderButton({
          title: 'Disconnect',
          onPress: this.disconnect
        })}
        {this.renderButton({
          title: 'Request unlock offline',
          onPress: this.requestUnlockOffline
        })}
        {this.renderButton({
          title: 'Request unlock',
          onPress: this.requestUnlock
        })}
        {this.renderButton({
          title: 'UNLOCK',
          onPress: this.unlockOffline
        })}
        {this.renderButton({
          title: 'Device Info',
          onPress: this.getInfo
        })}
        {this.renderButton({
          title: 'Lock 0',
          onPress: () => this.changeLock("CB:BC:87:3B:CB:D7")
        })}
        {this.renderButton({
          title: 'Lock 1',
          onPress: () => this.changeLock("F6:3D:ED:30:E1:D8")
        })}
        {this.renderButton({
          title: 'Lock 2',
          onPress: () => this.changeLock("E1:4E:9A:A6:E6:E6")
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
