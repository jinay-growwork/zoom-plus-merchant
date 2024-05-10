import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
    TextInput,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import Input from '../components/Input'
import { getFormatedDate } from 'react-native-modern-datepicker'
import DatePickerModal from '../components/DatePickerModal'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/auth/actions'

const FillYourProfile = ({ navigation }) => {
    const [areas, setAreas] = useState([])
    const [selectedArea, setSelectedArea] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)
    const dispatch = useDispatch()

    const [image, setImage] = useState(null)
    const [firstNameError, setFirstNameError] = useState('')
    const [lastNameError, setLastNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [mobileError, setMobileError] = useState('')
    const auth = useSelector((state) => state.auth)
    const id = useSelector((state) => state.auth?.user?.id)
    console.info('----------------------------')
    console.info('id =>', id)
    console.info('----------------------------')
    console.info('----------------------------')
    console.info('auth =>', auth)
    console.info('----------------------------')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState()

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
        if (auth?.user?.isGoogleLogin == true) {
            const { user } = auth
            setEmail(user?.email)
            setFirstName(user?.name)
        }
    }, [auth?.user])
    // const [areas, setAreas] = useState([])
    // const [selectedArea, setSelectedArea] = useState(null)
    // const [modalVisible, setModalVisible] = useState(false)
    // const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const { colors, dark } = useTheme()

    // useEffect(() => {
    //     if (error) {
    //         Alert.alert('An error occured', error)
    //     }
    // }, [error])

    // const pickImage = async () => {
    //     try {
    //         const tempUri = await launchImagePicker()

    //         if (!tempUri) return

    //         // set the image
    //         setImage({ uri: tempUri })
    //     } catch (error) {}
    // }

    // fetch codes from rescountries api
    // useEffect(() => {
    //     fetch('https://restcountries.com/v2/all')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             let areaData = data.map((item) => {
    //                 return {
    //                     code: item.alpha2Code,
    //                     item: item.name,
    //                     callingCode: `+${item.callingCodes[0]}`,
    //                     flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`,
    //                 }
    //             })

    //             setAreas(areaData)
    //             if (areaData.length > 0) {
    //                 let defaultData = areaData.filter((a) => a.code == 'US')

    //                 if (defaultData.length > 0) {
    //                     setSelectedArea(defaultData[0])
    //                 }
    //             }
    //         })
    // }, [])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }
    const handleSubmitWithOTP = () => {
        let isValid = true

        if (!firstName) {
            setFirstNameError('Please enter First Name')
            isValid = false
        } else {
            setFirstNameError('')
        }

        if (!lastName) {
            setLastNameError('Please enter Last Name')
            isValid = false
        } else {
            setLastNameError('')
        }

        if (!email) {
            setEmailError('Please enter Email')
            isValid = false
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid Email')
            isValid = false
        } else {
            setEmailError('')
        }

        if (isValid) {
            dispatch({
                type: actions.REGISTER_USER,
                payload: {
                    id: id,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    mobileNumber: auth?.user?.mobileNumber,
                },
            })
        }
    }

    const handleSubmitWithGoogleLogin = () => {
        let isValid = true

        if (!mobile) {
            setMobileError('Please enter Mobile Number')
            isValid = false
        } else if (mobile.length !== 10) {
            setMobileError('Please enter a valid Mobile Number')
            isValid = false
        } else {
            setMobileError('Please enter Mobile Number')
        }

        if (isValid) {
            dispatch({
                type: actions.REGISTER_USER_FOR_GOOGLE,
                payload: {
                    mobileNumber: mobile,
                },
            })
        }
    }
    const handleSubmit = () => {
        if (auth?.user?.isGoogleLogin == true) {
            handleSubmitWithGoogleLogin()
        } else {
            handleSubmitWithOTP()
        }
    }
    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <Header title="Fill Your Profile" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? icons.userDefault2 : image}
                resizeMode="cover"
                style={styles.avatar} />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View> */}
                    <View
                        style={{
                            marginTop: 12,
                        }}
                    >
                        <Input
                            value={firstName}
                            editable={
                                auth?.user?.isGoogleLogin == true ? false : true
                            }
                            id="firstName"
                            placeholder="First Name"
                            placeholderTextColor={COLORS.gray}
                            onChangeText={(value) => setFirstName(value)}
                        />
                        {firstNameError ? (
                            <Text style={{ color: 'red' }}>
                                {firstNameError}
                            </Text>
                        ) : null}
                        {auth?.user?.isGoogleLogin == true ? null : (
                            <>
                                <Input
                                    id="lastName"
                                    placeholder="Last Name"
                                    placeholderTextColor={COLORS.gray}
                                    value={lastName}
                                    onChangeText={(value) => setLastName(value)}
                                />
                                {lastNameError ? (
                                    <Text style={{ color: 'red' }}>
                                        {lastNameError}
                                    </Text>
                                ) : null}
                            </>
                        )}

                        <Input
                            id="email"
                            editable={
                                auth?.user?.isGoogleLogin == true ? false : true
                            }
                            placeholder="Email"
                            placeholderTextColor={COLORS.gray}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                        />
                        {emailError ? (
                            <Text style={{ color: 'red' }}>{emailError}</Text>
                        ) : null}
                        {auth?.user?.isGoogleLogin == true ? (
                            <>
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
                                        <View
                                            style={{ justifyContent: 'center' }}
                                        >
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
                                                source={{
                                                    uri: selectedArea?.flag,
                                                }}
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
                                                    color: dark
                                                        ? COLORS.white
                                                        : '#111',
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
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                            },
                                        ]}
                                        placeholder="Enter your phone number"
                                        placeholderTextColor={COLORS.gray}
                                        selectionColor="#111"
                                        keyboardType="numeric"
                                        onChangeText={(value) =>
                                            setMobile(value)
                                        }
                                    />
                                </View>
                                {RenderAreasCodesModal()}
                            </>
                        ) : (
                            <>
                                <Input
                                    id="mobile"
                                    placeholder="Mobile Number"
                                    placeholderTextColor={COLORS.gray}
                                    editable={false}
                                    value={auth?.user?.mobileNumber}
                                />
                            </>
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* {RenderAreasCodesModal()} */}
            <View style={styles.bottomContainer}>
                <Button
                    title="Skip"
                    style={{
                        width: (SIZES.width - 32) / 2 - 8,
                        borderRadius: 32,
                        backgroundColor: dark
                            ? COLORS.dark3
                            : COLORS.tansparentPrimary,
                        borderColor: dark
                            ? COLORS.dark3
                            : COLORS.tansparentPrimary,
                    }}
                    textColor={dark ? COLORS.white : COLORS.primary}
                    onPress={() => navigation.navigate('Login')}
                />
                <Button
                    title="Continue"
                    filled
                    style={styles.continueButton}
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
    },
    avatarContainer: {
        marginVertical: 12,
        alignItems: 'center',
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65,
    },
    pickImage: {
        height: 42,
        width: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
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
    downIcon: {
        width: 10,
        height: 10,
        tintColor: '#111',
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
        color: '#111',
    },
    inputBtn: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.greyscale500,
        height: 52,
        paddingLeft: 8,
        fontSize: 18,
        justifyContent: 'space-between',
        marginTop: 4,
        backgroundColor: COLORS.greyscale500,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 32,
        right: 16,
        left: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        alignItems: 'center',
    },
    continueButton: {
        width: (SIZES.width - 32) / 2 - 8,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    closeBtn: {
        width: 42,
        height: 42,
        borderRadius: 999,
        backgroundColor: COLORS.white,
        position: 'absolute',
        right: 16,
        top: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
})

export default FillYourProfile
