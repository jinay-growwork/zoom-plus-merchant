import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, FONTS, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'

import Input from '../components/Input'

import Button from '../components/Button'
import { useTheme } from '../theme/ThemeProvider'
import { useDispatch } from 'react-redux'
import actions from '../redux/Menu/actions'

const MenuSubCategories = ({ route, navigation }) => {
        const { categoryId } = route.params
    console.info('----------------------------')
    console.info('categoryId =>', categoryId)
    console.info('----------------------------')
    const dispatch = useDispatch()
    const [menuSubCatogeryError, setMenuSubCatogeryError] = useState('')
    const [menuSubCatogery, setMenuSubCatogery] = useState('')
    const { colors, dark } = useTheme()

    const handleSubmitWithOTP = () => {
        let isValid = true

        if (!menuSubCatogery) {
            setMenuSubCatogeryError('Please enter Menu Catogery')
            isValid = false
        } else {
            setMenuSubCatogeryError('')
        }

        if (isValid) {
            dispatch({
                type: actions.ADD_SUB_CATEGORY,
                payload: {
                    name: menuSubCatogery,
                    navigation: navigation,
                    categoryId: categoryId,
                },
            })
        }
    }
    const handleSubmit = () => {
        handleSubmitWithOTP()
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
                <Header title="Add Menu SubCategory" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            marginTop: 12,
                        }}
                    >
                        <Input
                            value={menuSubCatogery}
                            id="menuSubCategory"
                            placeholder="Menu SubCategory"
                            placeholderTextColor={COLORS.gray}
                            onChangeText={(value) => setMenuSubCatogery(value)}
                        />
                        {menuSubCatogeryError ? (
                            <Text style={{ color: 'red' }}>
                                {menuSubCatogeryError}
                            </Text>
                        ) : null}
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
                    onPress={() => navigation.navigate('Menu')}
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
})

export default MenuSubCategories
