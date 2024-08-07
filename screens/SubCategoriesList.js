import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { ScrollView } from 'react-native-virtualized-view'
import LanguageItem from '../components/LanguageItem'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux'

import { ActivityIndicator } from 'react-native-paper'
import actions from '../redux/Menu/actions'

const SubCategoriesList = ({ route, navigation }) => {
    const { categoryId } = route.params
    console.info('----------------------------')
    console.info('categoryId =>', categoryId)
    console.info('----------------------------')
    const dispatch = useDispatch()
    const subCategoriesList = useSelector((state) => state?.menu?.data)

    const [selectedItem, setSelectedItem] = useState(null)
    const [selectedItemName, setSelectedItemName] = useState(null)

    const { colors, dark } = useTheme()

    const handleCheckboxPress = (itemId, itemTitle) => {
        if (selectedItem === itemId) {
            setSelectedItem(null)
            setSelectedItemName(null)
        } else {
            setSelectedItem(itemId)
            setSelectedItemName(itemTitle)
        }
    }

    useEffect(() => {
        if (categoryId) {
            dispatch({
                type: actions.GET_SUB_CATEGORY_BY_ID,
                payload: { categoryId: categoryId },
            })
        }
    }, [categoryId])
    useEffect(() => {
        if (subCategoriesList && subCategoriesList?.length > 0) {
            setSelectedItem(subCategoriesList[0]?.id)
        }
    }, [subCategoriesList])

    const handleVerifySubCategories = () => {
        navigation.navigate('AddMenuItem', {
            subCategoryId: selectedItem,
            subCategoryName: selectedItemName,
            categoryId: categoryId,
        })
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
                    Sub Categories
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                        style={[
                            styles.title,
                            { color: dark ? COLORS.white : COLORS.gray },
                        ]}
                    >
                        Choose a Sub Categories
                    </Text>
                    {subCategoriesList.length > 0 &&
                        subCategoriesList?.map((restaurant, index) => (
                            <LanguageItem
                                key={index}
                                checked={selectedItem === restaurant?._id}
                                name={restaurant?.name}
                                onPress={() =>
                                    handleCheckboxPress(
                                        restaurant?._id,
                                        restaurant?.name
                                    )
                                }
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
                        title="Continue"
                        onPress={() => handleVerifySubCategories()}
                        filled
                        style={styles.btn}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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

export default SubCategoriesList
