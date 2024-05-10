import React, { Component } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { FONTS } from './constants/fonts'
import AppNavigation from './navigations/AppNavigation'
import { LogBox } from 'react-native'
import { ThemeProvider } from './theme/ThemeProvider'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { AuthContextProvider } from './context/auth'
import * as SplashScreen from 'expo-splash-screen'

// Ignore all log notifications
LogBox.ignoreAllLogs()

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isfontsLoaded: false,
        }
    }

    async componentDidMount() {
        SplashScreen.preventAutoHideAsync()

        const [fontsLoaded] = await useFonts(FONTS)

        if (fontsLoaded) {
            this.setState({ isfontsLoaded: true })
            this.hideSplashScreen()
        }
    }

    hideSplashScreen = async () => {
        await SplashScreen.hideAsync()
    }

    render() {
        const { isfontsLoaded } = this.state

        return (
            <Provider store={store}>
                <AuthContextProvider>
                    <ThemeProvider>
                        <SafeAreaProvider>
                            <AppNavigation
                                
                                hideSplashScreen={this.hideSplashScreen}
                            />
                        </SafeAreaProvider>
                    </ThemeProvider>
                </AuthContextProvider>
            </Provider>
        )
    }
}

export default App
