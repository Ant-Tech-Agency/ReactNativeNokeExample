//  Created by react-native-create-bridge

package com.reactnativenoke.rnnoke

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

import java.util.Arrays

class RNNokePackage : ReactPackage {
    
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // Register your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#register-the-module
        return Arrays.asList<NativeModule>(
            RNNokeModule(reactContext)
        )
    }

    
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

}
