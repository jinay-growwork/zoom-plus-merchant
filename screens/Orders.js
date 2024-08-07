import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
} from 'react-native'
import React from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../theme/ThemeProvider'
import { SceneMap, TabBar } from 'react-native-tab-view'
import {
    ActiveOrders,
    CancelledOrders,
    CompletedOrders,
    NewOrders,
    InProgressOrders,
} from '../tabs'
import TabView from '../components/TabView'

const Orders = ({ navigation }) => {
    const layout = useWindowDimensions()
    const { dark, colors } = useTheme()

    // const renderScene = SceneMap({
    //     first:  ()=>NewOrders(),
    //     second: ()=>InProgressOrders(),
    //     third: ()=>CompletedOrders(),
    //     fourth: ()=>CancelledOrders(),
    //     fifth:()=> CancelledOrders(),
    // })

    // const renderTabBar = (props) => (
    //     <TabBar
    //         {...props}
    //         indicatorStyle={{
    //             backgroundColor: COLORS.primary,
    //         }}
    //         style={{
    //             backgroundColor: colors.background,
    //         }}
    //         renderLabel={({ route, focused }) => (
    //             <Text
    //                 style={[
    //                     {
    //                         color: focused ? COLORS.primary : 'gray',
    //                         fontSize: 11,
    //                         fontFamily: 'bold',
    //                     },
    //                 ]}
    //             >
    //                 {route.title}
    //             </Text>
    //         )}
    //     />
    // )
    /**
     * Render header
     */
    const renderHeader = () => {
        return (
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
                        My Orders
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
                <TabView
                // routes={routes}
                />
                {/* <TabView

                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                /> */}
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

export default Orders
