/* eslint-disable */
import { createContext, useEffect, useState } from 'react'
import useAuthContext from '../hooks/useAuth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { retrieveData, storeData } from '../helper'
import { useSelector } from 'react-redux'

export const AuthContext = createContext({})

export const AuthContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false)
    const [isAppReady, setIsAppReady] = useState(false)
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [token, setToken] = useState('')
    const [isAuthLoading, setIsAuthLoading] = useState(false)
    const [initialRouteName, setInitialRoutename] = useState(null)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        const checkIfFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem('alreadyLaunched')
                console.info('----------------------------')
                console.info('valaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaue =>', value)
                console.info('----------------------------')
                if (value === null) {
                    await AsyncStorage.setItem('alreadyLaunched', 'true')
                    setIsFirstLaunch(true)
                } else {
                    setIsFirstLaunch(false)
                }
            } catch (error) {
                setIsFirstLaunch(false)
            }
            setIsAuthLoading(false)
        }

        checkIfFirstLaunch()
    }, [])

    const getToken = async () => {
        const token = await retrieveData('token')
        setToken(token)
    }
    useEffect(() => {
        getToken()
        // checkIfFirstLauchh()
    }, [])

    // const checkIfFirstLauchh = async () => {
    //     const isLaunched = await retrieveData('isLaunched')

    //     if (!isLaunched) {
    //         await storeData('isLaunched', true)
    //         setIsFirstLaunch(true)
    //     } else {
    //         setIsFirstLaunch(false)
    //     }
    //     // setIsFirstLaunch(is == undefined || is == 'undefined' ? false : true)
    // }
    useEffect(() => {
        if (token?.length > 0) {
            setIsLogin(true)
        } else {
            if (user?.isVerified == true) {
                if (user?.isRegistered === false) {
                    setIsLogin(false)
                } else {
                    setIsLogin(true)
                }
            } else if (
                user == null ||
                token == undefined ||
                token == 'undefined'
            ) {
                setIsLogin(false)
            }
        }
    }, [user, token])
    useEffect(() => {
        setRedirection()
    }, [isLogin, isFirstLaunch])
    const setRedirection = async () => {
        const isLaunched = await retrieveData('alreadyLaunched')

        if (isLogin) {
            setInitialRoutename('Main')
            setStateReady()
        } else if (
            (user == null ||
                token == undefined ||
                token == 'undefined' ||
                isLogin == false) &&
            (isLaunched == true || isLaunched == 'true')
        ) {
            setInitialRoutename('Login')
            setStateReady()
        } else if (isLaunched == null || isLaunched == 'null') {
            setInitialRoutename('Onboarding2')
            setStateReady()
        }
    }

    const setStateReady = () => {
        setTimeout(() => {
            setIsAppReady(true)
        }, 500)
    }

    const context = {
        isLogin,
        setIsLogin,
        isAppReady,
        setIsAppReady,
        isFirstLaunch,
        setIsFirstLaunch,
        token,
        setToken,
        isAuthLoading,
        setIsAuthLoading,
        initialRouteName,
    }

    return (
        <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
    )
}
