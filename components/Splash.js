import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'

import { Dimensions, Image, View } from 'react-native'
import imagePath from '../assets/images/splash.png'
import { scale } from 'react-native-size-matters'
import useAuthContext from '../hooks/useAuth'

const SplashScreen = ({ navigation, ...props }) => {
    const { height, width } = Dimensions.get('screen')

    const {
        isLogin,
        setIsLogin,
        isAppReady,
        setIsAppReady,
        isFirstLaunch,
        setIsFirstLaunch,
    } = useAuthContext()

    

    return (
        <>
            <View
                style={{
                    width,
                    height,
                    backgroundColor: '#1BAC4B',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Image
                    source={imagePath}
                    style={{
                        width: scale(370),
                        // height: 300,
                        objectFit: 'contain',
                    }}
                />
            </View>
        </>
    )
}

export default SplashScreen
