import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { useState } from 'react'
import SocialButton from './SocialButton'
import { icons } from '../constants'
import { storeData } from '../helper'
import { useDispatch } from 'react-redux'
import actions from '../redux/auth/actions'

export default function GoogleLogin({ navigation, loading, setLoading }) {
    const dispatch = useDispatch()
    GoogleSignin.configure({
        scopes: ['email', 'openid', 'profile'],
        webClientId:
            '486238037756-59bjt6tiks8jli9jjd70r6sjf9belqoo.apps.googleusercontent.com',
        iosClientId:
            '486238037756-4p5h7v4qt1j6ju1b29gef7taa23t1t26.apps.googleusercontent.com',
    })
    const [user, setUser] = useState()

    const handleClickSignIn = async () => {
        try {
            setLoading(true)
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            //   setState({ userInfo });
            setUser(userInfo)
            console.info('-------------------------------')
            console.info('userInfo => ', userInfo)
            console.info('-------------------------------')
            dispatch({
                type: actions?.SET_AUTH_STATE,
                payload: {
                    user: userInfo?.user,
                    loading,
                    setLoading,
                },
            })
            storeData('idToken', userInfo?.idToken)
            dispatch({
                type: actions.CHEK_REGISTER_USER_FOR_GOOGLE,
                payload: { navigation, loading, setLoading },
            })
        } catch (err) {
            console.info('----------------------------')
            console.info('err =>', err)
            console.info('----------------------------')
        }
    }

    return (
        <>
            <SocialButton
                icon={icons.google}
                onPress={() => handleClickSignIn()}
            />
        </>
    )
}
