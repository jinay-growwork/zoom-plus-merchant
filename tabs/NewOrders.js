import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { SIZES, COLORS } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/Order/actions'
import { updateOrderAPI } from '../api/Order'

const NewOrders = () => {
    const categoryList = useSelector((state) => state?.order?.Orders)

    const dispatch = useDispatch()
    const { dark } = useTheme()
    const [selected, setSelected] = useState(true)
    const [addItems, setAddItems] = useState({})
    const [time, setTime] = useState({})
    const [selectedOrder, setSelectedOrder] = useState([])

    const initializeState = (list, defaultValue) => {
        const state = {}
        list?.forEach((category) => {
            state[category._id] = defaultValue
        })
        return state
    }

    useEffect(() => {
        if (categoryList) {
            setAddItems(initializeState(categoryList, 15))
            setTime(initializeState(categoryList, 20))
        }
    }, [categoryList])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime((prevTime) => {
                let allZero = true
                const newTime = Object.keys(prevTime).reduce((acc, id) => {
                    acc[id] = prevTime[id] > 0 ? prevTime[id] - 1 : 0
                    if (acc[id] > 0) {
                        allZero = false
                    }
                    return acc
                }, {})

                if (allZero) {
                    clearInterval(intervalId)
                }

                return newTime
            })
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [categoryList])

    useEffect(() => {
        dispatch({
            type: actions.GET_ORDERS,
            payload: { status: 'Placed', newOrder: true },
        })
    }, [])

    useEffect(() => {
        if (categoryList && categoryList.length > 0) {
            const categoryNames = categoryList.map((item) => item?._id)
            setSelectedOrder(['Recommended', ...categoryNames])
        }
    }, [categoryList])

    const handleAddItems = (id, increment) => {
        setAddItems((prevAddItems) => ({
            ...prevAddItems,
            [id]: (prevAddItems[id] || 0) + increment,
        }))
    }

    const handleOrderSelect = (item) => {
        setSelected(false)
        const itemSelected = selectedOrder.find((c) => c === item)
        if (itemSelected) {
            setSelectedOrder(selectedOrder.filter((sel) => sel !== item))
        } else {
            setSelectedOrder([...selectedOrder, item])
        }
    }

    const handleAccpetOrder = async (item) => {
        const payload = {
            value: 'Preparing',
            timer: addItems[item?._id],
            orderId: item?._id,
        }

        const resp = await updateOrderAPI(payload)

        if (resp?.data?.data?.modifiedCount == 1) {
            dispatch({
                type: actions.GET_ORDERS,
                payload: { status: 'Placed', newOrder: true },
            })
        }
    }

    const handleRejectOrder = async (item) => {
        const payload = {
            value: 'Rejected',
            orderId: item?._id,
        }
        const resp = await updateOrderAPI(payload)
        console.log('---------------------')
        console.log('resp handleRejectOrder =>', resp)
        console.log('---------------------')
        if (resp?.data?.data?.modifiedCount == 1) {
            dispatch({
                type: actions.GET_ORDERS,
                payload: { status: 'Placed', newOrder: true },
            })
        }
    }
    if (!categoryList || categoryList.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.messageBox}>
                    <View style={styles.line} />
                    <Text style={styles.message}>No More New Orders</Text>
                    <View style={styles.line} />
                </View>
            </View>
        )
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
                    categoryList?.map((category, index) => {
                        return (
                            <View
                                style={{
                                    backgroundColor: COLORS.white,
                                    margin: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <Pressable
                                    onPress={() =>
                                        handleOrderSelect(category?._id)
                                    }
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

                                {selectedOrder.includes(category?._id) ? (
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
                                                            backgroundColor:
                                                                dark
                                                                    ? COLORS.dark3
                                                                    : COLORS.white,

                                                            paddingTop: 10,
                                                            flexDirection:
                                                                'row',
                                                            alignItems:
                                                                'center',
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
                                                            alignItems:
                                                                'center',
                                                            flexDirection:
                                                                'row',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                                fontWeight:
                                                                    'bold',
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
                                                            fontWeight:
                                                                'semi bold',
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
                                            >
                                                <View>
                                                    <Text
                                                        style={{
                                                            fontWeight:
                                                                'semi bold',
                                                            color: dark
                                                                ? COLORS.white
                                                                : COLORS.gray,
                                                            marginBottom: 5,
                                                            fontSize: 16,
                                                        }}
                                                    >
                                                        Set Food Preparation
                                                        Time
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Pressable
                                            style={{
                                                marginTop: 2,
                                                marginBottom: 10,
                                                marginHorizontal: 10,
                                                flexDirection: 'row',
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                alignItems: 'center',
                                                backgroundColor: COLORS.blue,
                                                borderRadius: 5,
                                                borderRadius: 10,
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Pressable
                                                onPress={() => {
                                                    handleAddItems(
                                                        category?._id,
                                                        -1
                                                    )
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
                                                    {`${
                                                        addItems[
                                                            category?._id
                                                        ] || 0
                                                    } mins`}
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                onPress={() => {
                                                    handleAddItems(
                                                        category?._id,
                                                        1
                                                    )
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
                                        <View
                                            style={{
                                                backgroundColor: COLORS.white,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                // marginHorizontal: 10,

                                                // marginBottom: 16,
                                            }}
                                        >
                                            <Pressable
                                                onPress={() =>
                                                    handleRejectOrder(category)
                                                }
                                                style={{
                                                    marginTop: 10,
                                                    marginBottom: 10,
                                                    marginHorizontal: 10,
                                                    flexDirection: 'row',
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                    alignItems: 'center',
                                                    backgroundColor: COLORS.red,
                                                    borderRadius: 5,
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <Pressable>
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            color: 'white',
                                                            paddingHorizontal: 10,
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Reject
                                                    </Text>
                                                </Pressable>
                                            </Pressable>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleAccpetOrder(category)
                                                }
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
                                                    Accpet Order (
                                                    {` ${time[category?._id] || 0} `}
                                                    )
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : null}
                            </View>
                        )
                    })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.tertiaryWhite,
        marginVertical: 22,
        marginBottom: 50,
    },
    messageBox: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        color: COLORS.gray,
        marginVertical: 10,
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: COLORS.gray,
    },
    separateLine: {
        width: '100%',
        height: 0.7,
        backgroundColor: COLORS.greyScale800,
        marginVertical: 2,
    },
    messageBox: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        color: COLORS.gray,
        marginVertical: 10,
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: COLORS.gray,
    },
})

export default NewOrders
