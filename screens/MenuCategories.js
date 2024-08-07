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

const MenuCategories = ({ navigation }) => {
    const dispatch = useDispatch()
    const [menuCatogeryError, setMenuCatogeryError] = useState('')
    const [menuCatogery, setMenuCatogery] = useState('')
    const { colors, dark } = useTheme()

    const handleSubmitWithOTP = () => {
        let isValid = true

        if (!menuCatogery) {
            setMenuCatogeryError('Please enter Menu Catogery')
            isValid = false
        } else {
            setMenuCatogeryError('')
        }

        if (isValid) {
            dispatch({
                type: actions.ADD_CATEGORY,
                payload: {
                    name: menuCatogery,
                    navigation: navigation,
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
                <Header title="Add Menu Category" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            marginTop: 12,
                        }}
                    >
                        <Input
                            value={menuCatogery}
                            id="menuCategory"
                            placeholder="Menu Category"
                            placeholderTextColor={COLORS.gray}
                            onChangeText={(value) => setMenuCatogery(value)}
                        />
                        {menuCatogeryError ? (
                            <Text style={{ color: 'red' }}>
                                {menuCatogeryError}
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

export default MenuCategories
