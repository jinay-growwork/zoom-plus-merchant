import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Pressable,
    Animated,
    Easing,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { SIZES, COLORS } from '../constants'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/Order/actions'
import { OtpInput } from 'react-native-otp-entry'
import { updateOrderAPI } from '../api/Order'

const InProgressOrders = () => {
    const categoryList = useSelector((state) => state?.order?.Orders)
    console.log('---------------------')
    console.log('categoryList bbbbbbbbb =>', categoryList)
    console.log('---------------------')
    const order = useSelector((state) => state?.order?.Orders)

    const dispatch = useDispatch()
    const refRBSheet = useRef()
    const { dark } = useTheme()
    const [selected, setSelected] = useState(true)
    const [additems, setAddItems] = useState({})
    const [selectedItem, setSelectedItem] = useState(['Recommended'])
    const [timers, setTimers] = useState({})
    const [selectDelayCategoryId, setselectDelayCategoryId] = useState(null)

    useEffect(() => {
        if (categoryList) {
            const initialTimers = {}
            categoryList.forEach((category) => {
                initialTimers[category._id] = category?.timing?.timer * 60
            })

            setTimers(initialTimers)

            const intervalId = setInterval(() => {
                setTimers((prevTimers) => {
                    const newTimers = {}
                    let allTimersZero = true

                    Object.keys(prevTimers).forEach((key) => {
                        if (prevTimers[key] > 0) {
                            newTimers[key] = prevTimers[key] - 1
                            allTimersZero = false
                        } else {
                            newTimers[key] = 0
                        }
                    })

                    if (allTimersZero) {
                        clearInterval(intervalId)
                    }

                    return newTimers
                })
            }, 1000)

            return () => clearInterval(intervalId)
        }
    }, [categoryList])

    useEffect(() => {
        dispatch({
            type: actions.GET_ORDERS,
            payload: { status: 'Preparing', newOrder: false },
        })
    }, [])

    useEffect(() => {
        if (categoryList && categoryList.length > 0) {
            const categoryNames = categoryList.map((item) => item?._id)
            setSelectedItem([...categoryNames])
        }
    }, [categoryList])

    useEffect(() => {
        if (categoryList) {
            const initialAddItems = categoryList.reduce((acc, category) => {
                acc[category._id] = 10

                return acc
            }, {})
            setAddItems(initialAddItems)
        }
    }, [categoryList])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    }

    const handleItemSelect = (item) => {
        setSelected(false)
        const itemSelected = selectedItem.find((c) => c === item)
        if (itemSelected) {
            setSelectedItem(selectedItem.filter((sel) => sel !== item))
        } else {
            setSelectedItem([...selectedItem, item])
        }
    }

    const handleAccpetOrder = async (item) => {
        const payload = {
            value: 'ReadyforPickup',
            orderId: item?._id,
        }
        const resp = await updateOrderAPI(payload)
        console.log('---------------------')
        console.log('handleAccpetOrder resp =>', resp)
        console.log('---------------------')
        if (resp?.data?.data?.modifiedCount == 1) {
            dispatch({
                type: actions.GET_ORDERS,
                payload: { status: 'Preparing', newOrder: false },
            })
        }
    }

    const handleAddItems = (id, increment) => {
        setAddItems((prevAddItems) => ({
            ...prevAddItems,
            [id]: (prevAddItems[id] || 0) + increment,
        }))
    }

    const handleOpenRBSheet = (id) => {
        setselectDelayCategoryId(id)
        refRBSheet.current.open()
    }

    const handleDelayOrder = async () => {
        const payload = {
            timer: additems[selectDelayCategoryId],
            orderId: selectDelayCategoryId,
        }

        const resp = await updateOrderAPI(payload)
        console.log('---------------------')
        console.log(' handleDelayOrder resp =>', resp)
        console.log('---------------------')
        if (resp?.data?.data?.modifiedCount == 1) {
            dispatch({
                type: actions.GET_ORDERS,
                payload: { status: 'Preparing', newOrder: false },
            })
            refRBSheet.current.close()
        }
    }
    const [blinkAnimation] = useState(new Animated.Value(0))

    useEffect(() => {
        if (timers) {
            // Start blinking animation if any timer value is 0
            const blinking = Object.values(timers).some(
                (timer) => formatTime(timer) === '0'
            )

            if (blinking) {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(blinkAnimation, {
                            toValue: 1,
                            duration: 500,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }),
                        Animated.timing(blinkAnimation, {
                            toValue: 0,
                            duration: 500,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }),
                    ])
                ).start()
            } else {
                // Stop the animation if no timer is 0
                Animated.timing(blinkAnimation, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }).stop()
            }
        }
    }, [timers])

    const buttonStyle = (timer) => {
        const time = formatTime(timer)
        return {
            backgroundColor: time === '0' ? 'red' : COLORS.greeen,
            padding: 15,
            alignItems: 'center',
            borderRadius: 10,
            flex: 1,
            marginLeft: 5,
            marginBottom: 10,
            opacity: blinkAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.5],
            }),
        }
    }
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
                },
            ]}
        >
            <ScrollView>
                {categoryList &&
                    categoryList?.map((category, index) => (
                        <View
                            style={{
                                backgroundColor: COLORS.white,
                                margin: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Pressable
                                onPress={() => handleItemSelect(category?._id)}
                                style={{
                                    margin: 10,
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                }}
                                // key={i}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.gray,
                                        }}
                                    >
                                        ID : {category?.uniqueId}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.gray,
                                        }}
                                    >
                                        10:00 am
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 'semi bold',
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.blue,
                                        }}
                                    >
                                        {`Order By: ${category?.OrderedBy?.firstName} ${category?.OrderedBy?.lastName}`}
                                    </Text>
                                    <AntDesign
                                        name="down"
                                        size={24}
                                        color={
                                            dark
                                                ? COLORS.white
                                                : COLORS.greyscale900
                                        }
                                    />
                                    {/* Add any additional content you want here */}
                                </View>
                            </Pressable>

                            {selectedItem.includes(category?._id) ? (
                                <>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginHorizontal: 10,
                                            marginBottom: 2,
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.separateLine,
                                                {
                                                    backgroundColor: dark
                                                        ? COLORS.greyScale800
                                                        : COLORS.grayscale200,
                                                    marginTop: 5,
                                                },
                                            ]}
                                        />
                                    </View>
                                    {category?.items?.map((item, index) => (
                                        <>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                        'space-between',
                                                    paddingHorizontal: 10,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        backgroundColor: dark
                                                            ? COLORS.dark3
                                                            : COLORS.white,

                                                        paddingTop: 10,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <View>
                                                        <Text
                                                            style={{
                                                                fontWeight:
                                                                    'bold',
                                                                color: dark
                                                                    ? COLORS.white
                                                                    : COLORS.black,
                                                                marginBottom: 5,
                                                                fontSize: 16,
                                                            }}
                                                        >
                                                            {`${item?.qty} x ${item?.merchantItems?.name}`}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            color: dark
                                                                ? COLORS.white
                                                                : COLORS.black,
                                                            fontSize: 16,
                                                        }}
                                                    >
                                                        {`Rs ${item?.price}`}
                                                    </Text>
                                                </View>
                                            </View>
                                        </>
                                    ))}

                                    <View
                                        style={[
                                            styles.separateLine,
                                            {
                                                backgroundColor: dark
                                                    ? COLORS.greyScale800
                                                    : COLORS.grayscale200,
                                                marginTop: 5,
                                            },
                                        ]}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                backgroundColor: dark
                                                    ? COLORS.dark3
                                                    : COLORS.white,

                                                paddingTop: 10,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View>
                                                <Text
                                                    style={{
                                                        fontWeight: 'semi bold',
                                                        color: dark
                                                            ? COLORS.white
                                                            : COLORS.gray,
                                                        marginBottom: 5,
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    Total Bill :-
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: dark
                                                        ? COLORS.white
                                                        : COLORS.black,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {`Rs ${category?.totalPrice}`}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 10,
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                backgroundColor: dark
                                                    ? COLORS.dark3
                                                    : COLORS.white,

                                                paddingTop: 2,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        ></View>
                                    </View>

                                    <View
                                        style={{
                                            backgroundColor: COLORS.white,
                                            // flexDirection: 'row',
                                            // // justifyContent: 'space-between',
                                            // marginHorizontal: 10,

                                            // marginBottom: 16,
                                        }}
                                    >
                                        {/* <TouchableOpacity
                                            onPress={() =>
                                                handleAccpetOrder(category)
                                            }
                                            // onPress={() =>
                                            //     refRBSheet.current.open()
                                            // }
                                            style={{
                                                marginTop: 10,
                                                marginBottom: 10,
                                                marginHorizontal: 10,
                                                backgroundColor: 'green',
                                                padding: 15,
                                                alignItems: 'center',
                                                borderRadius: 10,
                                                flex: 1,
                                                marginLeft: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: 16,
                                                }}
                                            >
                                                Order Ready (
                                                {formatTime(
                                                    timers[category?._id]
                                                )}
                                                )
                                            </Text>
                                        </TouchableOpacity> */}
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleAccpetOrder(category)
                                            }
                                            style={buttonStyle(
                                                timers[category?._id]
                                            )}
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: 16,
                                                }}
                                            >
                                                Order Ready (
                                                {formatTime(
                                                    timers[category?._id]
                                                )}
                                                )
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleOpenRBSheet(category?._id)
                                            }
                                            style={{
                                                marginBottom: 10,
                                                marginHorizontal: 10,
                                                backgroundColor: COLORS.blue,
                                                padding: 15,
                                                alignItems: 'center',
                                                borderRadius: 10,
                                                flex: 1,
                                                marginLeft: 5,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: 16,
                                                }}
                                            >
                                                Delay
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : null}
                        </View>
                    ))}
            </ScrollView>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={332}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.greyscale300
                            : COLORS.greyscale300,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 250,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: 'center',
                        width: '100%',
                    },
                }}
            >
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.red : COLORS.red,
                        },
                    ]}
                >
                    Delay Order
                </Text>
                <View
                    style={[
                        styles.separateLine,
                        {
                            backgroundColor: dark
                                ? COLORS.greyScale800
                                : COLORS.grayscale200,
                        },
                    ]}
                />

                <View style={styles.selectedCancelContainer}>
                    <View>
                        <Text
                            style={{
                                fontWeight: 'semi bold',
                                color: dark ? COLORS.white : COLORS.gray,
                                marginBottom: 10,
                                fontSize: 16,
                            }}
                        >
                            Set Delay Time
                        </Text>
                    </View>
                    <Pressable
                        style={{
                            marginTop: 2,
                            marginBottom: 10,
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            alignItems: 'center',
                            backgroundColor: COLORS.blue,
                            borderRadius: 10,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Pressable
                            onPress={() => {
                                handleAddItems(selectDelayCategoryId, -1)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    color: 'white',
                                    paddingHorizontal: 10,
                                }}
                            >
                                -
                            </Text>
                        </Pressable>

                        <Pressable>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: 'white',
                                    paddingHorizontal: 10,
                                }}
                            >
                                {`${additems[selectDelayCategoryId] || 0} mins`}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                handleAddItems(selectDelayCategoryId, 1)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: 'white',
                                    paddingHorizontal: 10,
                                }}
                            >
                                +
                            </Text>
                        </Pressable>
                    </Pressable>
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Confirm"
                        filled
                        style={styles.removeButton}
                        onPress={() => {
                            handleDelayOrder()
                        }}
                    />
                </View>
            </RBSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.tertiaryWhite,
        marginVertical: 22,
        marginBottom: 50,
    },
    separateLine: {
        width: '100%',
        height: 0.7,
        backgroundColor: COLORS.greyScale800,
        marginVertical: 2,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },

    removeButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },

    bottomSubtitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 12,
    },
    selectedCancelContainer: {
        marginVertical: 24,
        paddingHorizontal: 36,
        width: '100%',
    },
})

export default InProgressOrders
