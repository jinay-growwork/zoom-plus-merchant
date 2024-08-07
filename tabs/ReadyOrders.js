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

import { SIZES, COLORS, icons } from '../constants'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/Order/actions'
import { OtpInput } from 'react-native-otp-entry'
import { updateOrderAPI, verifyOrderAPI } from '../api/Order'
import { TextInput } from 'react-native-paper'

const ReadyOrders = () => {
    const categoryList = useSelector((state) => state?.order?.Orders)
    console.log('---------------------')
    console.log('categoryList dddddddddd =>', categoryList)
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
    const [value, setValue] = useState()
    const [searchQuery, setSearchQuery] = useState('')
    useEffect(() => {
        dispatch({
            type: actions.GET_ORDERS,
            payload: { status: 'ReadyforPickup', newOrder: false },
        })
    }, [])

    useEffect(() => {
        if (categoryList && categoryList.length > 0) {
            const categoryNames = categoryList.map((item) => item?._id)
            setSelectedItem([...categoryNames])
        }
    }, [categoryList])

    const handleItemSelect = (item) => {
        setSelected(false)
        const itemSelected = selectedItem.find((c) => c === item)
        if (itemSelected) {
            setSelectedItem(selectedItem.filter((sel) => sel !== item))
        } else {
            setSelectedItem([...selectedItem, item])
        }
    }

    const handleOpenRBSheet = (id) => {
        setselectDelayCategoryId(id)
        refRBSheet.current.open()
    }
    const [debounceTimeout, setDebounceTimeout] = useState(null)

    useEffect(() => {
        if (searchQuery) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }
            const timeout = setTimeout(() => {
                dispatch({
                    type: actions.GET_ORDERS,
                    payload: {
                        status: 'ReadyforPickup',
                        newOrder: false,
                        orderId: searchQuery,
                    },
                })
            }, 300)
            setDebounceTimeout(timeout)
        }

        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }
        }
    }, [searchQuery])

    const handlePickupOrder = async () => {
        const payload = {
            otp:value,
            orderid: selectDelayCategoryId,
        }
        const resp = await verifyOrderAPI(payload)
        console.log('---------------------')
        console.log('resp verifyOrderAPI =>', resp)
        console.log('---------------------')
        if (resp?.data?.data) {
            dispatch({
                type: actions.GET_ORDERS,
                payload: { status: 'ReadyforPickup', newOrder: false },
            })
            refRBSheet.current.close()
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
            <View
                onPress={() => console.log('Search')}
                style={[
                    styles.searchBarContainer,
                    {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.greeen,
                    },
                ]}
            >
                <TouchableOpacity
                // onPress={handleSearch}
                >
                    <Image
                        source={icons.search2}
                        resizeMode="contain"
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search Id "
                    placeholderTextColor={COLORS.black}
                    style={[
                        styles.searchInput,
                        {
                            backgroundColor: dark
                                ? COLORS.white
                                : COLORS.greeen,
                        },
                    ]}
                    value={searchQuery}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '')
                        setSearchQuery(numericText)
                    }}
                    keyboardType="numeric" //
                />
            </View>
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
                                                handleOpenRBSheet(category?._id)
                                            }
                                            style={{
                                                marginBottom: 10,
                                                marginHorizontal: 10,
                                                backgroundColor: COLORS.red,
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
                                                Pickup
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
                    OTP Verification
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
                    <OtpInput
                        value={value}
                        numberOfDigits={4}
                        onTextChange={(text) => setValue(text)}
                        focusColor={COLORS.primary}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => console.log(`OTP is ${text}`)}
                        theme={{
                            pinCodeContainerStyle: {
                                backgroundColor: dark
                                    ? COLORS.dark2
                                    : COLORS.secondaryWhite,
                                borderColor: dark
                                    ? COLORS.gray
                                    : COLORS.secondaryWhite,
                                borderWidth: 0.4,
                                borderRadius: 10,
                                height: 58,
                                width: 58,
                            },
                            pinCodeTextStyle: {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        }}
                    />
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
                            handlePickupOrder()
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
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.greeen,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    searchInput: {
        height: 50,
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
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

export default ReadyOrders
