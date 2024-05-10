import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { banners, categories, discountFoods, recommendedFoods } from '../data'
import { useTheme } from '../theme/ThemeProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import SubHeaderItem from '../components/SubHeaderItem'
import Category from '../components/Category'
import VerticalFoodCard from '../components/VerticalFoodCard'
import HorizontalFoodCard from '../components/HorizontalFoodCard'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/Home/actions'
import Restaurantslist from '../components/Restaurantslist'

const Home = ({ navigation }) => {
    const dispatch = useDispatch()
    const [currentIndex, setCurrentIndex] = useState(0)
    const { dark, colors } = useTheme()
    const { user } = useSelector((state) => state.auth)
    const home = useSelector((state) => state.home)
    console.info('----------------------------')
    console.info('home =>', home)
    console.info('----------------------------')
    /**
     * render header
     */
    useEffect(() => {
        dispatch({
            type: actions.GET_FOODS_CATEGORIES,
        })
        dispatch({
            type: actions.GET_MERCHANTS_LISTS,
        })
    }, [])
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    <Image
                        source={images.user1}
                        resizeMode="contain"
                        style={styles.userIcon}
                    />
                    <View style={styles.viewNameContainer}>
                        <Text style={styles.greeeting}>Good Morning👋</Text>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Andrew Ainsley
                        </Text>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Image
                            source={icons.notificationBell2}
                            resizeMode="contain"
                            style={[
                                styles.bellIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Favourite')}
                    >
                        <Image
                            source={icons.heartOutline}
                            resizeMode="contain"
                            style={[
                                styles.bookmarkIcon,
                                {
                                    tintColor: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * Render search bar
     */
    const renderSearchBar = () => {
        const handleInputFocus = () => {
            // Redirect to another screen
            navigation.navigate('Search')
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={[
                    styles.searchBarContainer,
                    {
                        backgroundColor: dark
                            ? COLORS.dark2
                            : COLORS.secondaryWhite,
                    },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search2}
                        resizeMode="contain"
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={COLORS.gray}
                    style={styles.searchInput}
                    onFocus={handleInputFocus}
                />
                <TouchableOpacity>
                    <Image
                        source={icons.filter}
                        resizeMode="contain"
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    const renderBannerItem = ({ item }) => (
        <View style={styles.bannerContainer}>
            <View style={styles.bannerTopContainer}>
                <View>
                    <Text style={styles.bannerDicount}>
                        {item.discount} OFF
                    </Text>
                    <Text style={styles.bannerDiscountName}>
                        {item.discountName}
                    </Text>
                </View>
                <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
            </View>
            <View style={styles.bannerBottomContainer}>
                <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
                <Text style={styles.bannerBottomSubtitle}>
                    {item.bottomSubtitle}
                </Text>
            </View>
        </View>
    )

    const keyExtractor = (item) => item.id.toString()

    const handleEndReached = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }

    const renderDot = (index) => {
        return (
            <View
                style={[
                    styles.dot,
                    index === currentIndex ? styles.activeDot : null,
                ]}
                key={index}
            />
        )
    }

    /**
     * Render banner
     */
    const renderBanner = () => {
        return (
            <View style={styles.bannerItemContainer}>
                <FlatList
                    data={banners}
                    renderItem={renderBannerItem}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / SIZES.width
                        )
                        setCurrentIndex(newIndex)
                    }}
                />
                <View style={styles.dotContainer}>
                    {banners.map((_, index) => renderDot(index))}
                </View>
            </View>
        )
    }

    /**
     * Render categories
     */
    const renderCategories = () => {
        return (
            <View>
                <SubHeaderItem
                    title="Categories"
                    navTitle="See all"
                    onPress={() => navigation.navigate('Categories')}
                />
                <FlatList
                    data={home?.categories?.slice(0, 8)}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={false}
                    numColumns={4} // Render two items per row
                    renderItem={({ item, index }) => (
                        <Category
                            name={item?.name}
                            icon={item?.image}
                            backgroundColor={dark ? COLORS.dark2 : COLORS.white}
                            onPress={
                                item.onPress
                                    ? () =>
                                          navigation.navigate({
                                              name: item.onPress,
                                          })
                                    : null
                            }
                        />
                    )}
                />
            </View>
        )
    }

    /**
     * render discount foods
     */
    const renderDiscountedFoods = () => {
        return (
            <View>
                <SubHeaderItem
                    title="Discount guaranteed!👌"
                    navTitle="See all"
                    onPress={() => navigation.navigate('DiscountFoods')}
                />
                <View
                    style={{
                        backgroundColor: dark
                            ? COLORS.dark1
                            : COLORS.secondaryWhite,
                        marginVertical: 16,
                    }}
                >
                    <FlatList
                        data={discountFoods}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <VerticalFoodCard
                                    name={item.name}
                                    image={item.image}
                                    distance={item.distance}
                                    price={item.price}
                                    fee={item.fee}
                                    rating={item.rating}
                                    numReviews={item.numReviews}
                                    onPress={() =>
                                        navigation.navigate('FoodDetails')
                                    }
                                />
                            )
                        }}
                    />
                </View>
            </View>
        )
    }

    const renderAllRestaurants = () => {
        return (
            <View>
                <SubHeaderItem
                    title="All Restaurants"
                    // navTitle="See all"
                    // onPress={() => navigation.navigate('DiscountFoods')}
                />
                <View
                    style={{
                        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                        marginVertical: 16,
                    }}
                >
                    <FlatList
                        data={home?.merchants}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <Restaurantslist
                                    name={item?.name}
                                    image={item?.images}
                                    cuisines={item?.cuisines}
                                    address={item?.address}
                                    distance={item.distance}
                                    price={item.price}
                                    fee={item.fee}
                                    rating={item?.rating}
                                    numReviews={item.numReviews}
                                    isPromo={item.isPromo}
                                    onPress={() =>
                                        navigation.navigate('FoodDetails')
                                    }
                                />
                            )
                        }}
                    />
                </View>
            </View>
        )
    }

    /**
     * render recommended foods
     */
    const renderRecommendedFoods = () => {
        const [selectedCategories, setSelectedCategories] = useState(['1'])

        const filteredFoods = recommendedFoods.filter(
            (food) =>
                selectedCategories.includes('1') ||
                selectedCategories.includes(food.categoryId)
        )

        // Category item
        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: selectedCategories.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                    padding: 10,
                    marginVertical: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1.3,
                    borderRadius: 24,
                    marginRight: 12,
                }}
                onPress={() => toggleCategory(item.id)}
            >
                <Text
                    style={{
                        color: selectedCategories.includes(item.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )

        // Toggle category selection
        const toggleCategory = (categoryId) => {
            const updatedCategories = [...selectedCategories]
            const index = updatedCategories.indexOf(categoryId)

            if (index === -1) {
                updatedCategories.push(categoryId)
            } else {
                updatedCategories.splice(index, 1)
            }

            setSelectedCategories(updatedCategories)
        }

        return (
            <View>
                <SubHeaderItem
                    title="Recommended For You!😍"
                    navTitle="See all"
                    onPress={() => navigation.navigate('RecommendedFoods')}
                />
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderCategoryItem}
                />
                <View
                    style={{
                        backgroundColor: dark
                            ? COLORS.dark1
                            : COLORS.secondaryWhite,
                        marginVertical: 16,
                    }}
                >
                    <FlatList
                        data={filteredFoods}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <HorizontalFoodCard
                                    name={item.name}
                                    image={item.image}
                                    distance={item.distance}
                                    price={item.price}
                                    fee={item.fee}
                                    rating={item.rating}
                                    numReviews={item.numReviews}
                                    isPromo={item.isPromo}
                                    onPress={() =>
                                        navigation.navigate('FoodDetails')
                                    }
                                />
                            )
                        }}
                    />
                </View>
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
                    {renderSearchBar()}
                    {renderBanner()}
                    {renderCategories()}
                    {renderAllRestaurants()}
                    {/* {renderDiscountedFoods()} */}
                    {renderRecommendedFoods()}
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
        marginBottom: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32,
    },
    viewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeeting: {
        fontSize: 12,
        fontFamily: 'regular',
        color: 'gray',
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    viewNameContainer: {
        marginLeft: 12,
    },
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8,
    },
    bookmarkIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
    bannerTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white,
        marginBottom: 4,
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerDiscountNum: {
        fontSize: 46,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerBottomContainer: {
        marginTop: 8,
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
        marginTop: 4,
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 999,
    },
    firstName: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.dark2,
        marginTop: 6,
    },
    bannerItemContainer: {
        width: '100%',
        paddingBottom: 10,
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
})

export default Home
