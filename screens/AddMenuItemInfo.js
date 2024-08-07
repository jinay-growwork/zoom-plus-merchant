import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { ScrollView } from 'react-native-virtualized-view'
import GlobalSettingsItem from '../components/GlobalSettingsItem'
import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import Checkbox from 'expo-checkbox'
import { TimePicker } from 'antd'
import { Picker } from '@react-native-picker/picker'
import { useDispatch } from 'react-redux'
import actions from '../redux/Menu/actions'
import { getMenuItemAPI } from '../api/Menu'

// settings for security
const AddMenuItemInfo = ({ route, navigation }) => {
    const {
        subCategoryId,
        categoryId,
        formState,
        selectedCategories,
        menuItemId,
    } = route.params
    const dispatch = useDispatch()
    const [isSpicyEnabled, setIsSpicyEnabled] = useState(true)
    const [isEligibleCouponEnabled, setIsEligibleCouponEnabled] =
        useState(false)
    const [isCustomizableEnabled, setIsCustomizableEnabled] = useState(true)
    const { colors, dark } = useTheme()
    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]

    const [selectedDays, setSelectedDays] = useState([])
    console.info('----------------------------')
    console.info('selectedDays =>', selectedDays)
    console.info('----------------------------')
    const [openingTime, setOpeningTime] = useState('Select Opening Time')

    const [closingTime, setClosingTime] = useState('Select Closing Time')
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)
    const [selectedTime, setSelectedTime] = useState({
        hours: '00',
        minutes: '00',
    })
    const [timeType, setTimeType] = useState('opening')
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        const fetchMenuItem = async () => {
            if (menuItemId) {
                try {
                    const resp = await getMenuItemAPI(menuItemId)

                    if (resp?.data?.data) {
                        console.info('----------------------------')
                        console.info('resp?.data?.data =>', resp?.data?.data)
                        console.info('----------------------------')
                        const { from, to } = resp?.data?.data?.timeSlots[0]
                        setOpeningTime(from)
                        setClosingTime(to)
                        setIsSpicyEnabled(resp?.data?.data?.isSpicy)
                        setIsEligibleCouponEnabled(
                            resp?.data?.data?.isEligibleCoupon
                        )
                        setIsCustomizableEnabled(
                            resp?.data?.data?.isCustomizable
                        )
                        setSelectedDays(resp?.data?.data?.availableDays)
                    }
                } catch (error) {
                    console.error('Error fetching menu item:', error)
                }
            }
        }

        fetchMenuItem()
    }, [menuItemId])

    const handleCheckboxChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(
                selectedDays.filter((selectedDay) => selectedDay !== day)
            )
        } else {
            setSelectedDays([...selectedDays, day])
        }
    }

    const handleSubmit = () => {
        let isValid = true
        if (selectedDays.length === 0) {
            isValid = false
            setHasError(true)
            Alert.alert('Validation Error', 'Please select at least one day.')
        }
        if (!openingTime || !closingTime) {
            isValid = false
            Alert.alert('Error', 'Please set both opening and closing times')
            return
        }

        if (isValid) {
            const payload = {
                name: formState?.inputValues?.name,
                category: categoryId,
                subs: subCategoryId,
                isVeg: selectedCategories,
                isEligibleCoupon: isEligibleCouponEnabled,
                isCustomizable: isCustomizableEnabled,
                timeSlots: [{ from: openingTime, to: closingTime }],
                availableDays: selectedDays,
                isSpicy: isSpicyEnabled,
                price: formState?.inputValues?.price,
                additionalInfo: formState?.inputValues?.itemDescription,
            }
            if (menuItemId) {
                dispatch({
                    type: actions.UPDATE_MENU_ITEM,
                    payload: { ...payload, menuItemId: menuItemId },
                    navigation: navigation,
                })
            } else {
                dispatch({
                    type: actions.SET_MENU_ITEM,
                    payload: payload,
                    navigation: navigation,
                })
            }
        }
    }

    const toggleSpicy = () => {
        setIsSpicyEnabled(!isSpicyEnabled)
    }

    const toggleEligibleCoupon = () => {
        setIsEligibleCouponEnabled(!isEligibleCouponEnabled)
    }

    const toggleCustomizable = () => {
        setIsCustomizableEnabled(!isCustomizableEnabled)
    }
    const hours = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, '0')
    )
    const minutes = Array.from({ length: 60 }, (_, i) =>
        String(i).padStart(2, '0')
    )

    const renderPickerItems = (values) => {
        return values.map((value) => (
            <Picker.Item key={value} label={value} value={value} />
        ))
    }

    const handleConfirmTime = () => {
        const time = `${selectedTime.hours}:${selectedTime.minutes}`
        if (timeType === 'opening') {
            setOpeningTime(time)
        } else {
            setClosingTime(time)
        }
        setIsTimePickerVisible(false)
    }

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.headerIconContainer,
                        {
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={[
                            styles.arrowBackIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        },
                    ]}
                >
                    Item Details Info
                </Text>
                <Text> </Text>
            </View>
        )
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
                {renderHeader()}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ margin: 2 }}>
                        <Text style={styles.label}>Days Open</Text>
                        {daysOfWeek.map((day) => (
                            <View key={day} style={styles.checkboxContainer}>
                                <Checkbox
                                    value={selectedDays.includes(day)}
                                    onValueChange={() =>
                                        handleCheckboxChange(day)
                                    }
                                    color={
                                        selectedDays.includes(day)
                                            ? '#4630EB'
                                            : undefined
                                    }
                                />
                                <Text style={styles.checkboxLabel}>{day}</Text>
                            </View>
                        ))}
                        {hasError && (
                            <Text style={styles.errorText}>
                                Please select at least one day
                            </Text>
                        )}
                        <Text style={styles.label}>Opening Hours</Text>
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'semiBold',
                            }}
                        >
                            From:
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setTimeType('opening')
                                setIsTimePickerVisible(true)
                            }}
                        >
                            <Text style={styles.timeInput}>{openingTime}</Text>
                        </TouchableOpacity>

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 'semiBold',
                            }}
                        >
                            To:
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setTimeType('closing')
                                setIsTimePickerVisible(true)
                            }}
                        >
                            <Text style={styles.timeInput}>{closingTime}</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={isTimePickerVisible}
                            transparent={true}
                            animationType="slide"
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.pickerContainer}>
                                    <Text style={styles.pickerLabel}>
                                        Hours
                                    </Text>
                                    <Picker
                                        selectedValue={selectedTime.hours}
                                        onValueChange={(itemValue) =>
                                            setSelectedTime({
                                                ...selectedTime,
                                                hours: itemValue,
                                            })
                                        }
                                        style={styles.picker}
                                    >
                                        {renderPickerItems(hours)}
                                    </Picker>
                                    <Text style={styles.pickerLabel}>
                                        Minutes
                                    </Text>
                                    <Picker
                                        selectedValue={selectedTime.minutes}
                                        onValueChange={(itemValue) =>
                                            setSelectedTime({
                                                ...selectedTime,
                                                minutes: itemValue,
                                            })
                                        }
                                        style={styles.picker}
                                    >
                                        {renderPickerItems(minutes)}
                                    </Picker>
                                    <TouchableOpacity
                                        onPress={handleConfirmTime}
                                    >
                                        <Text style={styles.doneButton}>
                                            Done
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <GlobalSettingsItem
                        title="Spicy"
                        isNotificationEnabled={isSpicyEnabled}
                        toggleNotificationEnabled={toggleSpicy}
                    />
                    <GlobalSettingsItem
                        title="Eligible For Coupon"
                        isNotificationEnabled={isEligibleCouponEnabled}
                        toggleNotificationEnabled={toggleEligibleCoupon}
                    />
                    <GlobalSettingsItem
                        title="Customizable"
                        isNotificationEnabled={isCustomizableEnabled}
                        toggleNotificationEnabled={toggleCustomizable}
                    />
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Submit"
                    filled
                    style={styles.continueButton}
                    onPress={() => handleSubmit()}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    timeInput: {
        fontSize: 14,
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    picker: {
        width: 100,
        height: 50,
    },
    doneButton: {
        fontSize: 18,
        color: '#4630EB',
        marginTop: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIconContainer: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    continueButton: {
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
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
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        marginBottom: 80,
    },
    scrollView: {
        marginVertical: 22,
    },
    arrowRight: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    viewLeft: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginRight: 8,
    },
    button: {
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
        borderColor: COLORS.tansparentPrimary,
        marginTop: 22,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
})

export default AddMenuItemInfo
