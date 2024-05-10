import { useContext } from 'react'
import { AuthContext } from '../context/auth'

const useAuthContext = () => {
    const {
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
    } = useContext(AuthContext)

    return {
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
}

export default useAuthContext
