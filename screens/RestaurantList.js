import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { ScrollView } from 'react-native-virtualized-view'
import LanguageItem from '../components/LanguageItem'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/auth/actions'
import { ActivityIndicator } from 'react-native-paper'

const RestaurantList = ({ navigation }) => {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)
    const [selectedItem, setSelectedItem] = useState(null)
    const { colors, dark } = useTheme()
    const restaurantList = auth?.restaurant?.data
    const handleCheckboxPress = (itemTitle) => {
        if (selectedItem === itemTitle) {
            setSelectedItem(null)
        } else {
            setSelectedItem(itemTitle)
        }
    }
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        dispatch({
            type: actions.GET_RESTAURANT,
        })
    }, [])
    useEffect(() => {
        if (restaurantList && restaurantList?.length > 0) {
            setSelectedItem(restaurantList[0]?._id)
        }
    }, [restaurantList])

    const handleVerifyRestaurant = () => {
        setLoading(true)
        dispatch({
            type: actions.REGISTER_RESTAURANT,
            payload: {
                merchantid: selectedItem,
                navigation: navigation,
                setLoading: setLoading,
            },
        })
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
                <Header title="Restaurant List " />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                        style={[
                            styles.title,
                            { color: dark ? COLORS.white : COLORS.gray },
                        ]}
                    >
                        Select Restaurant For Login
                    </Text>
                    {restaurantList?.map((restaurant, index) => (
                        <LanguageItem
                            key={index}
                            checked={selectedItem === restaurant?._id}
                            name={restaurant?.name}
                            onPress={() => handleCheckboxPress(restaurant?._id)}
                        />
                    ))}
                    {/* <LanguageItem
                        checked={selectedItem === 'Mandarin'}
                        name="Mandarin"
                        onPress={() => handleCheckboxPress('Mandarin')}
                    />

                    <LanguageItem
                        checked={selectedItem === 'Yue Chinese (Cantonese)'}
                        name="Yue Chinese (Cantonese)"
                        onPress={() =>
                            handleCheckboxPress('Yue Chinese (Cantonese)')
                        }
                    />
                    <LanguageItem
                        checked={selectedItem === 'Southern Min (Hokkien)'}
                        name="Southern Min (Hokkien)"
                        onPress={() =>
                            handleCheckboxPress('Southern Min (Hokkien)')
                        }
                    />
                    <LanguageItem
                        checked={selectedItem === 'Persian (Farsi)'}
                        name="Persian (Farsi)"
                        onPress={() => handleCheckboxPress('Persian (Farsi)')}
                    />
                    <LanguageItem
                        checked={selectedItem === 'Polish'}
                        name="Polish"
                        onPress={() => handleCheckboxPress('Polish')}
                    />
                    <LanguageItem
                        checked={selectedItem === 'Kannada'}
                        name="Kannada"
                        onPress={() => handleCheckboxPress('Kannada')}
                    /> */}
                </ScrollView>
                <View style={styles.btnContainer}>
                    <Button
                        title="Verify Restaurant"
                        onPress={() => handleVerifyRestaurant()}
                        filled
                        style={styles.btn}
                    />
                </View>
                {loading && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="red" />
                    </View>
                )}
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
    btnContainer: {
        alignItems: 'center',
    },
    btn: {
        width: SIZES.width - 32,
        paddingHorizontal: 16,
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginVertical: 16,
    },
})

export default RestaurantList
