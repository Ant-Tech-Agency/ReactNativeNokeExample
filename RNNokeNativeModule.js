//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { RNNoke } = NativeModules

export default {
  exampleMethod () {
    return RNNoke.exampleMethod()
  },

  EXAMPLE_CONSTANT: RNNoke.EXAMPLE_CONSTANT
}
