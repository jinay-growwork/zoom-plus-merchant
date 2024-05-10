import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import SocialButton from '../components/SocialButton'
import OrSeparator from '../components/OrSeparator'
import { useTheme } from '../theme/ThemeProvider'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/auth/actions'
// import * as WebBrowser from 'expo-web-browser'
// import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { AuthSession } from 'expo-auth-session'
import GoogleLogin from '../components/Auth'

const isTestMode = true
// WebBrowser.maybeCompleteAuthSession()

const Login = ({ navigation }) => {
    // const [request, response, promptAsync] = Google.useAuthRequest({
    //     // redirectUri: 'http://localhost:8081/',
    //     androidClientId:
    //         '7815137124-5scqbtat2q61qu5fg5q0dn50lel17bns.apps.googleusercontent.com',

    //     // iosClientId:
    //     //     '723432648509-qmaibcehse0f8kuv3kbigj4h5a30ete7.apps.googleusercontent.com',
    //     // webClientId:
    //     //     '723432648509-hq2oh8eghobdervn0cqj999iq4edfi9e.apps.googleusercontent.com',
    // })
    const [loading, setLoading] = useState(false)
    console.info('----------------------------')
    console.info('loading =>', loading)
    console.info('----------------------------')
    const [mobile, setMobile] = useState()
    const auth = useSelector((state) => state.auth)
    console.info('----------------------------')
    console.info('auth =>', auth)
    console.info('----------------------------')
    const [areas, setAreas] = useState([])
    const [selectedArea, setSelectedArea] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)

    const [error, setError] = useState(null)

    const { colors, dark } = useTheme()

    const dispatch = useDispatch()
    const handleLoginPress = () => {
        dispatch({
            type: actions.SET_NUMBER,
            payload: { mobileNumber: `${selectedArea.callingCode}${mobile}` },
        })
        navigation.navigate('OTPVerification')
    }
    function RenderAreasCodesModal() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: 10,
                        flexDirection: 'row',
                    }}
                    onPress={() => {
                        setSelectedArea(item), setModalVisible(false)
                    }}
                >
                    <Image
                        source={{ uri: item.flag }}
                        contentFit="contain"
                        style={{
                            height: 30,
                            width: 30,
                            marginRight: 10,
                        }}
                    />
                    <Text style={{ fontSize: 16, color: '#fff' }}>
                        {item.item}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                height: SIZES.height,
                                width: SIZES.width,
                                backgroundColor: COLORS.primary,
                                borderRadius: 12,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeBtn}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <FlatList
                                data={areas}
                                renderItem={renderItem}
                                horizontal={false}
                                keyExtractor={(item) => item.code}
                                style={{
                                    padding: 20,
                                    marginBottom: 20,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
    useEffect(() => {
        fetch('https://restcountries.com/v2/all')
            .then((response) => response.json())
            .then((data) => {
                let areaData = data.map((item) => {
                    return {
                        code: item.alpha2Code,
                        item: item.name,
                        callingCode: `+${item.callingCodes[0]}`,
                        flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
                    }
                })

                setAreas(areaData)
                if (areaData.length > 0) {
                    let defaultData = areaData.filter((a) => a.code == 'IN')

                    if (defaultData.length > 0) {
                        setSelectedArea(defaultData[0])
                    }
                }
            })
    }, [])
    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error])

    return (
        <SafeAreaView
            style={[
                styles.area,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Header />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        ]}
                    >
                        Login to Your Account
                    </Text>
                    <View
                        style={[
                            styles.inputContainer,
                            {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.greyscale500,
                                borderColor: dark
                                    ? COLORS.dark2
                                    : COLORS.greyscale500,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.selectFlagContainer}
                            onPress={() => setModalVisible(true)}
                        >
                            <View style={{ justifyContent: 'center' }}>
                                <Image
                                    source={icons.down}
                                    resizeMode="contain"
                                    style={styles.downIcon}
                                />
                            </View>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    marginLeft: 5,
                                }}
                            >
                                <Image
                                    source={{ uri: selectedArea?.flag }}
                                    contentFit="contain"
                                    style={styles.flagIcon}
                                />
                            </View>
                            <View
                                style={{
                                    justifyContent: 'center',
                                    marginLeft: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: dark ? COLORS.white : '#111',
                                        fontSize: 12,
                                    }}
                                >
                                    {selectedArea?.callingCode}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {/* Phone Number Text Input */}
                        <TextInput
                            value={mobile}
                            style={[
                                styles.input,
                                {
                                    color: dark ? COLORS.white : COLORS.black,
                                },
                            ]}
                            placeholder="Enter your phone number"
                            placeholderTextColor={COLORS.gray}
                            selectionColor="#111"
                            keyboardType="numeric"
                            onChangeText={(value) => setMobile(value)}
                        />
                    </View>
                    {RenderAreasCodesModal()}
                    <Button
                        title="Login"
                        filled
                        onPress={handleLoginPress}
                        style={styles.button}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ForgotPasswordMethods')
                        }
                    >
                        <Text style={styles.forgotPasswordBtnText}>
                            Forgot the password?
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <OrSeparator text="or continue with" />
                        <View style={styles.socialBtnContainer}>
                            <GoogleLogin
                                navigation={navigation}
                                loading={loading}
                                setLoading={setLoading}
                            />
                            {/* <SocialButton
                                icon={icons.google}
                                // onPress={() => promptAsync()}
                            /> */}
                        </View>
                    </View>
                </ScrollView>
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="red" />
                    </View>
                )}
                {/* <View style={styles.bottomContainer}>
                    <Text
                        style={[
                            styles.bottomLeft,
                            {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        ]}
                    >
                        Don't have an account ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.bottomRight}>{'  '}Sign Up</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    downIcon: {
        width: 10,
        height: 10,
        tintColor: '#111',
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 12,
        height: 52,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 12,
        backgroundColor: COLORS.greyscale500,
    },
    selectFlagContainer: {
        width: 90,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    flagIcon: {
        width: 30,
        height: 30,
    },
    input: {
        flex: 1,
        marginVertical: 10,
        height: 40,
        fontSize: 14,
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 100,
        height: 100,
        tintColor: COLORS.primary,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    privacy: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: 'medium',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 26,
    },
    socialBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 18,
        position: 'absolute',
        bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'black',
    },
    bottomRight: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30,
    },
    forgotPasswordBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 12,
    },
})

export default Login
