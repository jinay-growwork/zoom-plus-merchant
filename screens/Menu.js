import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
    FlatList,
    Pressable,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../theme/ThemeProvider'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { ActiveOrders, CancelledOrders, CompletedOrders } from '../tabs'
import { ScrollView } from 'react-native-virtualized-view'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { Modal } from 'react-native-paper'
import actions from '../redux/Menu/actions'
import { useDispatch } from 'react-redux'

const renderScene = SceneMap({
    first: ActiveOrders,
    second: CompletedOrders,
    third: CancelledOrders,
})

const Menu = ({ navigation }) => {
    const dispatch = useDispatch()
    const layout = useWindowDimensions()
    const { dark, colors } = useTheme()
    const [modalVisible, setModalVisible] = useState(false)

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }
    const [index, setIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: 'first', title: 'All Item' },
        { key: 'second', title: 'Add Onces' },
        // { key: 'third', title: 'Cancelled' },
    ])
    useEffect(() => {
        dispatch({
            type: actions.GET_CATEGORY,
        })
    }, [])
    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: colors.background,
            }}
            renderLabel={({ route, focused }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 16,
                            fontFamily: 'semiBold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )
    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={images.logo}
                                resizeMode="contain"
                                style={[
                                    styles.backIcon,
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
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Menu
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Image
                            source={icons.moreCircle}
                            resizeMode="contain"
                            style={[
                                styles.moreIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                {/* <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 10,
                        padding: 10,
                        alignItems: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                                fontSize: 25,
                                fontFamily: 'bold',
                            }}
                        >
                            Radhe Dhokla
                        </Text>
                    </View>
                    <Text
                        style={{
                            color: 'gray',
                            fontSize: 18,
                            textAlign: 'center',
                        }}
                    >
                        Street Food - Chinese - Fast Food
                    </Text>
                </View> */}
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderRadius: 10,
                        padding: 10,
                        alignItems: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            // alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={images.bread1}
                            style={{
                                width: 90,
                                height: 95,
                                marginRight: 15,
                                borderRadius: 20,
                            }}
                        />
                        <View
                            style={{
                                flexDirection: 'column',
                            }}
                        >
                            <Text
                                style={{
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                    fontSize: 25,
                                    fontFamily: 'bold',
                                }}
                            >
                                Radhe Dhokla
                            </Text>
                            <Text
                                style={{
                                    marginTop: 5,
                                    color: 'gray',
                                    fontSize: 18,
                                    textAlign: 'center',
                                }}
                            >
                                Street Food - Chinese - Fast Food
                            </Text>
                            <Text
                                style={{
                                    marginTop: 8,
                                    width: '60%',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    backgroundColor: COLORS.greeen,
                                    color: 'white',
                                    fontSize: 20,
                                    borderRadius: 5,
                                }}
                            >
                                GST Registered
                            </Text>
                        </View>
                    </View>
                </View>
            </>
        )
    }
    return (
        <>
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

                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </View>
                {/* <Pressable
                    onPress={toggleModal}
                    style={{
                        width: 100,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.blue,
                        marginLeft: 'auto',
                        position: 'absolute',
                        bottom: 150,
                        right: 25,
                        alignContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontWeight: '600',
                        }}
                    >
                        + ADD
                    </Text>
                </Pressable>
                <Pressable
                    onPress={toggleModal}
                    style={{
                        width: 100,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        backgroundColor: COLORS.grayscale200,
                        marginLeft: 'auto',
                        position: 'absolute',
                        bottom: 100,
                        right: 25,
                        alignContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            color: COLORS.blue,
                            fontWeight: '600',
                        }}
                    >
                        Menu
                    </Text>
                </Pressable> */}
            </SafeAreaView>
            {/* <Modal isVisible={modalVisible} onBackdropPress={toggleModal}>
                <View
                    style={{
                        height: 100,
                        width: 250,
                        backgroundColor: 'black',
                        position: 'absolute',
                        bottom: 35,
                        right: 10,
                        borderRadius: 7,
                    }}
                >
                    <View
                        style={{
                            padding: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                        // key={i}
                    >
                        <Text
                            style={{
                                color: '#D0D0D0',
                                fontWeight: '600',
                                fontSize: 19,
                            }}
                        >
                            j
                        </Text>
                        <Text
                            style={{
                                color: '#D0D0D0',
                                fontWeight: '600',
                                fontSize: 19,
                            }}
                        >
                            1
                        </Text>
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    ></View>
                </View>
            </Modal> */}
        </>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
})

export default Menu
