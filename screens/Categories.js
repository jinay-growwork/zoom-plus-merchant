import { View, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { COLORS } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { categories } from '../data'
import Category from '../components/Category'
import { ScrollView } from 'react-native-virtualized-view'
import { useTheme } from '../theme/ThemeProvider'
import { useSelector } from 'react-redux'

const Categories = () => {
    const { colors, dark } = useTheme()
    const home = useSelector((state) => state.home)

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
                <Header title="More Category" />
                <ScrollView style={styles.scrollView}>
                    <FlatList
                        data={home?.categories}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={false}
                        numColumns={4} // Render two items per row
                        renderItem={({ item, index }) => (
                            <Category
                                name={item?.name}
                                icon={item?.image}
                                backgroundColor={
                                    dark ? COLORS.dark2 : COLORS.white
                                }
                            />
                        )}
                    />
                </ScrollView>
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
    scrollView: {
        marginVertical: 22,
    },
})

export default Categories
