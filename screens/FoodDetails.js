import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    Pressable,
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import Modal from 'react-native-modal'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons, images, socials } from '../constants'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../theme/ThemeProvider'
import AutoSlider from '../components/AutoSlider'
import { ScrollView } from 'react-native-virtualized-view'
import {
    FontAwesome,
    FontAwesome5,
    Fontisto,
    Ionicons,
    MaterialIcons,
} from '@expo/vector-icons'
import {
    banners,
    categories,
    drink,
    foodMenu,
    menu,
    menuCategories,
} from '../data'
import FoodMenuCard from '../components/FoodMenuCard'
import MenuCard from '../components/MenuCard'
import DrinkCard from '../components/DrinkCard'
import Button from '../components/Button'
import SocialIcon from '../components/SocialIcon'
import RBSheet from 'react-native-raw-bottom-sheet'
import { AntDesign } from '@expo/vector-icons'
const FoodDetails = ({ navigation }) => {
    const { dark } = useTheme()
    const refRBSheet = useRef()
    const [checked, setChecked] = useState(false)
    const [additems, setAddItems] = useState(0)
    const [selected, setSelected] = useState(false)
    const [selectedItem, setSelectedItem] = useState(['Recommended'])
    const [modalVisible, setModalVisible] = useState(false)
    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }
    console.info('----------------------------')
    console.info('modalVisible =>', modalVisible)
    console.info('----------------------------')
    const handleItemSelect = (item) => {
        const itemSelected = selectedItem.find((c) => c === item)
        if (itemSelected) {
            setSelectedItem(selectedItem.filter((sel) => sel !== item))
        } else {
            setSelectedItem([...selectedItem, item])
        }
    }
    // Slider images
    const sliderImages = [
        images.pizza1,
        images.pizza2,
        images.pizza3,
        images.pizza4,
        images.pizza5,
    ]

    // render header
    const renderHeader = () => {
        const [isFavorite, setIsFavorite] = useState(false)

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: dark
                                ? COLORS.white
                                : COLORS.greyscale900,
                        }}
                    />
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                    <TouchableOpacity

                    // onPress={() => refRBSheet.current.open()}
                    >
                        <Image
                            source={icons.search}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() => setIsFavorite(!isFavorite)}
                    >
                        <Image
                            source={
                                isFavorite ? icons.heart2 : icons.heart2Outline
                            }
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.sendIconContainer}
                        // onPress={() => refRBSheet.current.open()}
                    >
                        <Image
                            source={icons.send2}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sendIconContainer}
                        // onPress={() => refRBSheet.current.open()}
                    >
                        <Image
                            source={icons.moreCircle}
                            resizeMode="contain"
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * render content
     */
    const renderContent = () => {
        const [selectedMenu, setSelectedMenu] = useState(null)
        const [selectedFoodMenu, setSelectedFoodMenu] = useState(null)
        const [selectedDrinkMenu, setSelectedDrinkMenu] = useState(null)

        // Function to handle menu selection
        const handleMenuSelect = (menuId) => {
            setSelectedMenu(menuId)
        }

        // Function to handle menu selection
        const handleFoodMenuSelect = (menuId) => {
            setSelectedFoodMenu(menuId)
        }

        // Function to handle menu selection
        const handleDrinkMenuSelect = (menuId) => {
            setSelectedDrinkMenu(menuId)
        }
        const [selectedCategories, setSelectedCategories] = useState(['1'])
        const renderCategoryItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        marginTop: 8,
                        backgroundColor: selectedCategories.includes(item.id)
                            ? COLORS.red
                            : 'transparent',
                        padding: 4,
                        marginVertical: 5,
                        borderColor: COLORS.grayscale100,
                        borderWidth: 1.3,
                        borderRadius: 10,
                        marginRight: 12,
                        flexDirection: 'row',
                        gap: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => toggleCategory(item.id)}
                >
                    <TouchableOpacity>
                        <Image
                            source={item.icon}
                            resizeMode="contain"
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: selectedCategories.includes(item.id)
                                ? COLORS.white
                                : COLORS.black,
                            marginRight: 5,
                        }}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )
        }

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
        const [currentIndex, setCurrentIndex] = useState(0)
        const renderBannerItem = ({ item }) => (
            <View style={styles.bannerContainer}>
                <View style={styles.bannerTopContainer}>
                    <View>
                        <Text style={styles.bannerDiscountName}>
                            {item.discountName}
                        </Text>
                        <Text style={styles.bannerDicount}>
                            {item.discount} OFF
                        </Text>
                    </View>
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

        const flatListRef = useRef(null)

        useEffect(() => {
            const intervalId = setInterval(() => {
                const newIndex = (currentIndex + 1) % banners.length
                setCurrentIndex(newIndex)

                const offset = newIndex * SIZES.width

                flatListRef.current.scrollToOffset({ offset, animated: true })
            }, 5000)

            return () => clearInterval(intervalId)
        }, [currentIndex])

        return (
            // <View style={styles.contentContainer}>
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate("FoodDetailsAbout")}
            //     style={styles.headerTitleContainer}>
            //     <Text style={[styles.headerTitle, {
            //       color: dark ? COLORS.white : COLORS.greyscale900
            //     }]}>Big Garden Salad</Text>
            //     <Image
            //       source={icons.arrowRight}
            //       resizeMode='contain'
            //       style={[styles.arrowRightIcon, {
            //         tintColor: dark ? COLORS.white : COLORS.greyscale900
            //       }]}
            //     />
            //   </TouchableOpacity>
            //   <View style={[styles.separateLine, {
            //     backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            //   }]} />
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate("FoodReviews")}
            //     style={styles.reviewContainer}>
            //     <View style={styles.reviewLeftContainer}>
            //       <Fontisto name="star" size={20} color="orange" />
            //       <Text style={[styles.avgRating, {
            //         color: dark ? COLORS.white : COLORS.greyscale900
            //       }]}>4.8</Text>
            //       <Text style={[styles.numReview, {
            //         color: dark ? COLORS.grayscale200 : COLORS.grayscale700
            //       }]}>(1.2k reviews)</Text>
            //     </View>
            //     <Image
            //       source={icons.arrowRight}
            //       resizeMode='contain'
            //       style={[styles.arrowRightIcon, {
            //         tintColor: dark ? COLORS.grayscale100 : COLORS.greyscale900,
            //       }]}
            //     />
            //   </TouchableOpacity>
            //   <View style={[styles.separateLine, {
            //     backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            //   }]} />
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate("FoodDetailsOffers")}
            //     style={styles.locationContainer}>
            //     <View style={styles.locationLeftContainer}>
            //       <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
            //       <Text style={[styles.locationDistance, {
            //         color: dark ? COLORS.white : COLORS.greyscale900
            //       }]}>2.4 Km</Text>
            //     </View>
            //     <Image
            //       source={icons.arrowRight}
            //       resizeMode='contain'
            //       style={[styles.arrowRightIcon, {
            //         tintColor: dark ? COLORS.grayscale100 : COLORS.greyscale900
            //       }]}
            //     />
            //   </TouchableOpacity>
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate("FoodDetailsOffers")}
            //     style={styles.deliverContainer}>
            //     <Text style={[styles.deliverText,
            //     {
            //       marginLeft: 26,
            //       color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
            //     }]}>Deliver Now | {" "}</Text>
            //     <Image
            //       source={icons.moto}
            //       resizeMode='contain'
            //       style={styles.motoIcon}
            //     />
            //     <Text style={[styles.deliverText, {
            //       color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
            //     }]}>$ 2.00</Text>
            //   </TouchableOpacity>
            //   <View style={[styles.separateLine, {
            //     backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            //   }]} />
            //   <TouchableOpacity
            //     onPress={() => navigation.navigate("FoodDetailsOffers")}
            //     style={styles.offerContainer}>
            //     <View style={styles.offerLeftContainer}>
            //       <Image
            //         source={icons.discount}
            //         resizeMode='contain'
            //         style={styles.discountIcon}
            //       />
            //       <Text style={[styles.discountText, {
            //         color: dark ? COLORS.white : COLORS.greyscale900,
            //       }]}>Offers are available</Text>
            //     </View>
            //     <Image
            //       source={icons.arrowRight}
            //       resizeMode='contain'
            //       style={[styles.arrowRightIcon, {
            //         tintColor: dark ? COLORS.grayscale100 : COLORS.greyscale900
            //       }]}
            //     />
            //   </TouchableOpacity>
            //   <View style={[styles.separateLine, {
            //     backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            //   }]} />

            //   {/* Available for your */}
            //   <Text style={[styles.subtitle, {
            //     color: dark ? COLORS.white : COLORS.greyscale900
            //   }]}>For You</Text>
            //   <View style={{
            //     backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
            //   }}>
            //     <FlatList
            //       data={foodMenu}
            //       keyExtractor={item => item.id}
            //       horizontal
            //       showsHorizontalScrollIndicator={false}
            //       renderItem={({ item }) => (
            //         <FoodMenuCard
            //           id={item.id}
            //           image={item.image}
            //           name={item.name}
            //           price={item.price}
            //           isBestSeller={item.isBestSeller}
            //           isSelected={selectedMenu === item.id}
            //           onSelect={handleMenuSelect}
            //         />
            //       )}
            //     />
            //   </View>
            //   {/* Available Menu for you */}
            //   <Text style={[styles.subtitle, {
            //     color: dark ? COLORS.white : COLORS.greyscale900
            //   }]}>Menu</Text>
            //   <View style={{
            //     backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
            //   }}>
            //     <FlatList
            //       data={menu}
            //       keyExtractor={item => item.id}
            //       renderItem={({ item }) => (
            //         <MenuCard
            //           id={item.id}
            //           image={item.image}
            //           name={item.name}
            //           price={item.price}
            //           isNew={item.isNew}
            //           isSelected={selectedFoodMenu === item.id}
            //           onSelect={handleFoodMenuSelect}
            //         />
            //       )}
            //     />
            //   </View>

            //   {/* Available Drink for you */}
            //   <Text style={[styles.subtitle, {
            //     color: dark ? COLORS.white : COLORS.greyscale900
            //   }]}>Drink</Text>
            //   <View style={{
            //     backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
            //   }}>
            //     <FlatList
            //       data={drink}
            //       keyExtractor={item => item.id}
            //       renderItem={({ item }) => (
            //         <DrinkCard
            //           id={item.id}
            //           image={item.image}
            //           name={item.name}
            //           price={item.price}
            //           isPromo={item.isPromo}
            //           isSelected={selectedDrinkMenu === item.id}
            //           onSelect={handleDrinkMenuSelect}
            //         />
            //       )}
            //     />
            //   </View>
            // </View>
            <>
                <ScrollView style={{ marginTop: 65 }}>
                    <View
                        style={{
                            height: 253,
                            backgroundColor: COLORS.white,
                            borderRadius: 10,
                            padding: 10,
                            alignItems: 'center',
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
                                style={[
                                    styles.subtitle,
                                    {
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Radhe Dhokla
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: 'gray',
                                fontSize: 15,
                                textAlign: 'center',
                            }}
                        >
                            Street Food - Chinese - Fast Food
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 7,
                            }}
                        >
                            <MaterialIcons
                                name="stars"
                                size={24}
                                color="green"
                            ></MaterialIcons>
                            <Text
                                style={{
                                    marginLeft: 3,
                                    fontSize: 17,
                                    fontWeight: '400',
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                }}
                            >
                                4.5
                            </Text>
                            <Text
                                style={{
                                    marginLeft: 3,
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                }}
                            >
                                •
                            </Text>
                            <View
                                style={{
                                    marginLeft: 3,
                                    flexDirection: 'column',
                                }}
                            >
                                <Text
                                    style={{
                                        marginLeft: 3,
                                        fontSize: 15,
                                        fontWeight: '300',
                                        color: dark
                                            ? COLORS.white
                                            : COLORS.greyscale900,
                                    }}
                                >
                                    4.3k rating
                                </Text>
                                <Text
                                    style={{
                                        borderColor: 'gray',
                                        borderWidth: 0.6,
                                        height: 1,
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',

                                    flexDirection: 'row',
                                    width: SIZES.width - 150,
                                    backgroundColor: '#e6f2ff',
                                    padding: 3,
                                    borderRadius: 16,
                                    marginTop: 10,
                                    height: 25,
                                    alignItems: 'center',
                                }}
                            >
                                <Text>24 mins - 2 Km | Adajan Gam </Text>
                                <AntDesign
                                    name="down"
                                    size={10}
                                    color={
                                        dark
                                            ? COLORS.white
                                            : COLORS.greyscale900
                                    }
                                />
                            </View>
                        </View>
                        <LinearGradient
                            colors={[
                                'rgba(204, 224, 255, 1)',
                                'rgba(204, 224, 255, 1)',
                                'rgba(204, 224, 255, 1)',
                                'rgba(255, 255, 255, 1)',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{
                                width: SIZES.width - 30,
                                marginTop: 20,
                                paddingBottom: 10,
                                height: 55,
                                borderRadius: 15,
                            }}
                        >
                            <FlatList
                                ref={flatListRef}
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
                                        event.nativeEvent.contentOffset.x /
                                            SIZES.width
                                    )
                                    setCurrentIndex(newIndex)
                                }}
                            />
                        </LinearGradient>

                        <View style={styles.dotContainer}>
                            {banners.map((_, index) => renderDot(index))}
                        </View>
                        <FlatList
                            style={{ marginLeft: 5, marginRight: 5 }}
                            data={menuCategories}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            renderItem={renderCategoryItem}
                        />
                    </View>

                    {/* <Text
                        style={[
                            styles.subtitle,
                            {
                                fontSize: 20,
                                textAlign: 'center',
                                color: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Menu
                    </Text> */}

                    {/* <FlatList
                        style={{ marginTop: 10 }}
                        data={foodMenu}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <FoodMenuCard
                                id={item.id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                                isBestSeller={item.isBestSeller}
                                isSelected={selectedMenu === item.id}
                                onSelect={handleMenuSelect}
                            />
                        )}
                    /> */}

                    <View
                        style={{
                            backgroundColor: COLORS.white,
                            marginTop: 10,
                            borderRadius: 10,
                        }}
                    >
                        <Pressable
                            onPress={() => handleItemSelect('Recommended')}
                            style={{
                                margin: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                            // key={i}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: dark
                                        ? COLORS.white
                                        : COLORS.greyscale900,
                                }}
                            >
                                Recommended (20)
                            </Text>
                            <AntDesign
                                name="down"
                                size={24}
                                color={
                                    dark ? COLORS.white : COLORS.greyscale900
                                }
                            />
                        </Pressable>
                        {selectedItem.includes('Recommended') ? (
                            <>
                                <View>
                                    <Pressable
                                        style={{
                                            margin: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <View>
                                            <View
                                                style={{
                                                    width: 68,
                                                    height: 26,
                                                    borderRadius: 6,
                                                    backgroundColor:
                                                        COLORS.primary,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontFamily: 'medium',
                                                        color: COLORS.white,
                                                        marginLeft: 4,
                                                    }}
                                                >
                                                    Best Seller
                                                </Text>
                                            </View>
                                            <Text
                                                style={{
                                                    marginTop: 5,
                                                    fontSize: 18,
                                                    fontWeight: '600',
                                                    color: dark
                                                        ? COLORS.white
                                                        : COLORS.greyscale900,
                                                }}
                                            >
                                                Vagharela Khaman
                                            </Text>
                                            <Text
                                                style={{
                                                    color: dark
                                                        ? COLORS.white
                                                        : COLORS.greyscale900,
                                                }}
                                            >
                                                Rs 30
                                            </Text>
                                            <Text
                                                style={{
                                                    marginTop: 5,
                                                    borderRadius: 4,
                                                }}
                                            >
                                                {[0, 0, 0, 0, 0].map(
                                                    (en, i) => (
                                                        <FontAwesome
                                                            // key={`${food.id}-${i}`}
                                                            style={{
                                                                paddingHorizontal: 3,
                                                            }}
                                                            name="star"
                                                            size={15}
                                                            color="#FFD700"
                                                        />
                                                    )
                                                )}
                                            </Text>
                                            <Text
                                                style={{
                                                    width: 180,
                                                    marginTop: 8,
                                                    color: 'gray',
                                                    fontSize: 16,
                                                }}
                                            >
                                                250 gm | A savory and flavorful
                                                snack perfect for any occasion.
                                                {/* {food.description.length > 30
                                            ? food.description.substr(0, 35) +
                                              '...'
                                            : food.description} */}
                                            </Text>
                                        </View>

                                        <Pressable style={{ marginRight: 10 }}>
                                            <Image
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 8,
                                                }}
                                                source={images.pizza1}
                                            />
                                            {selected === true ? (
                                                <Pressable
                                                    style={{
                                                        position: 'absolute',
                                                        top: 120,
                                                        left: 32,

                                                        flexDirection: 'row',
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,
                                                        alignItems: 'center',
                                                        backgroundColor:
                                                            'white',
                                                        borderRadius: 5,
                                                    }}
                                                >
                                                    <Pressable
                                                        onPress={() => {
                                                            if (
                                                                additems === 1
                                                            ) {
                                                                setSelected(
                                                                    false
                                                                )
                                                                setAddItems(0)
                                                            } else {
                                                                setAddItems(
                                                                    (c) => c - 1
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 25,
                                                                color: 'green',
                                                                paddingHorizontal: 6,
                                                            }}
                                                        >
                                                            -
                                                        </Text>
                                                    </Pressable>

                                                    <Pressable>
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                color: 'green',
                                                                paddingHorizontal: 6,
                                                            }}
                                                            onPress={() =>
                                                                refRBSheet.current.open()
                                                            }
                                                        >
                                                            {additems}
                                                        </Text>
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => {
                                                            setAddItems(
                                                                (c) => c + 1
                                                            )
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 20,
                                                                color: 'green',
                                                                paddingHorizontal: 6,
                                                            }}
                                                        >
                                                            +
                                                        </Text>
                                                    </Pressable>
                                                </Pressable>
                                            ) : (
                                                <Pressable
                                                    style={{
                                                        position: 'absolute',
                                                        top: 120,
                                                        left: 38,

                                                        flexDirection: 'row',
                                                        paddingHorizontal: 25,
                                                        paddingVertical: 10,
                                                        alignItems: 'center',
                                                        backgroundColor:
                                                            'white',
                                                        borderRadius: 5,
                                                    }}
                                                    onPress={() =>
                                                        refRBSheet.current.open()
                                                    }
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 18,
                                                            fontWeight: '600',
                                                            color: '#018749',
                                                        }}
                                                    >
                                                        Add
                                                    </Text>
                                                </Pressable>
                                            )}
                                        </Pressable>
                                    </Pressable>
                                </View>
                                <View
                                    style={[
                                        styles.separateLine,
                                        {
                                            backgroundColor: dark
                                                ? COLORS.greyScale800
                                                : COLORS.grayscale200,
                                            marginTop: 20,
                                        },
                                    ]}
                                />
                                <View style={{ marginTop: 20 }}>
                                    <Pressable
                                        style={{
                                            margin: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: '600',
                                                    color: dark
                                                        ? COLORS.white
                                                        : COLORS.greyscale900,
                                                }}
                                            >
                                                Vagharela Khaman
                                            </Text>
                                            <Text
                                                style={{
                                                    color: dark
                                                        ? COLORS.white
                                                        : COLORS.greyscale900,
                                                }}
                                            >
                                                Rs 30
                                            </Text>
                                            <Text
                                                style={{
                                                    marginTop: 5,
                                                    borderRadius: 4,
                                                }}
                                            >
                                                {[0, 0, 0, 0, 0].map(
                                                    (en, i) => (
                                                        <FontAwesome
                                                            // key={`${food.id}-${i}`}
                                                            style={{
                                                                paddingHorizontal: 3,
                                                            }}
                                                            name="star"
                                                            size={15}
                                                            color="#FFD700"
                                                        />
                                                    )
                                                )}
                                            </Text>
                                            <Text
                                                style={{
                                                    width: 180,
                                                    marginTop: 8,
                                                    color: 'gray',
                                                    fontSize: 16,
                                                }}
                                            >
                                                250 gm | A savory and flavorful
                                                snack perfect for any occasion.
                                                {/* {food.description.length > 30
                                            ? food.description.substr(0, 35) +
                                              '...'
                                            : food.description} */}
                                            </Text>
                                        </View>

                                        <Pressable style={{ marginRight: 10 }}>
                                            <Image
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 8,
                                                }}
                                                source={images.pizza1}
                                            />

                                            <Pressable
                                                style={{
                                                    position: 'absolute',
                                                    top: 120,
                                                    left: 32,

                                                    flexDirection: 'row',
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                    alignItems: 'center',
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                }}
                                            >
                                                <Pressable
                                                // onPress={() => {
                                                //     if (additems === 1) {
                                                //         dispatch(
                                                //             removeFromCart(food)
                                                //         )
                                                //         setSelected(false)
                                                //         setAddItems(0)
                                                //     } else {
                                                //         setAddItems((c) => c - 1)
                                                //         dispatch(
                                                //             decrementQuantity(food)
                                                //         )
                                                //     }
                                                // }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 25,
                                                            color: 'green',
                                                            paddingHorizontal: 6,
                                                        }}
                                                    >
                                                        -
                                                    </Text>
                                                </Pressable>

                                                <Pressable>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            color: 'green',
                                                            paddingHorizontal: 6,
                                                        }}
                                                    >
                                                        1{/* {additems} */}
                                                    </Text>
                                                </Pressable>

                                                <Pressable
                                                // onPress={() => {
                                                //     setAddItems((c) => c + 1)
                                                //     dispatch(
                                                //         incrementQuantity(food)
                                                //     )
                                                // }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            color: 'green',
                                                            paddingHorizontal: 6,
                                                        }}
                                                    >
                                                        +
                                                    </Text>
                                                </Pressable>
                                            </Pressable>
                                        </Pressable>
                                    </Pressable>
                                </View>
                            </>
                        ) : null}
                    </View>
                </ScrollView>

                <Pressable
                    onPress={toggleModal}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 40,
                        justifyContent: 'center',
                        backgroundColor: 'black',
                        marginLeft: 'auto',
                        position: 'absolute',
                        bottom: 35,
                        right: 25,
                        alignContent: 'center',
                    }}
                >
                    <MaterialIcons
                        style={{ textAlign: 'center' }}
                        name="menu-book"
                        size={24}
                        color="white"
                    />
                    <Text
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontWeight: '500',
                        }}
                    >
                        MENU
                    </Text>
                </Pressable>
            </>
        )
    }

    return (
        <View
            style={[
                styles.area,
                { backgroundColor: dark ? COLORS.dark1 : COLORS.grayscale100 },
            ]}
        >
            <StatusBar hidden />
            {/* <AutoSlider images={sliderImages} /> */}
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderContent()}
                <Modal isVisible={modalVisible} onBackdropPress={toggleModal}>
                    <View
                        style={{
                            height: 190,
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
                </Modal>
            </ScrollView>
            {/* <View
                style={[
                    styles.bookBottomContainer,
                    {
                        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                        borderTopColor: dark ? COLORS.dark1 : COLORS.white,
                    },
                ]}
            >
                <Button
                    title="Order Now"
                    filled
                    style={styles.bookingBtn}
                    onPress={() => navigation.navigate('FoodDetailsAddItem')}
                />
            </View> */}

            <RBSheet
                customModalProps={{
                    animationType: 'slide',
                    statusBarTranslucent: true,
                }}
                useNativeDriver={true}
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
                        width: 50,
                    },
                    container: {
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                        height: 600,
                        overflow: 'visible',
                        backgroundColor: dark
                            ? COLORS.black
                            : COLORS.grayscale200,
                        // alignItems: 'center',
                        width: '100%',
                    },
                }}
            >
                <View
                    style={{
                        position: 'relative',
                        // textAlign: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => refRBSheet.current.close()}
                        style={{
                            position: 'absolute',
                            top: -50,
                            right: '45%',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'red',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* Use your desired close icon component */}
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            gap: 10,
                        }}
                    >
                        <Image
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 8,
                                margin: 10,
                            }}
                            source={images.pizza1}
                        />
                        <Text
                            style={[
                                styles.bottomSubtitle,
                                {
                                    color: dark ? COLORS.red : COLORS.red,
                                },
                            ]}
                        >
                            Vagharela Khaman
                        </Text>
                    </View>
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
                </View>

                <View style={{ flex: 1 }}>
                    <ScrollView>
                        <View
                            style={{
                                margin: 10,
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : COLORS.white,
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                    fontSize: 18,
                                }}
                            >
                                Quantity
                            </Text>
                            <Text
                                style={{
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                }}
                            >
                                Required : Select any 1 option
                            </Text>
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
                                    <View style={{ marginRight: 10 }}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                                marginBottom: 5,
                                                fontSize: 16,
                                            }}
                                        >
                                            500 gm
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
                                        Rs 200
                                    </Text>
                                    <RadioButton
                                        value="250gm"
                                        status={
                                            checked === '250gm'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setChecked('250gm')}
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
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
                                    <View style={{ marginRight: 10 }}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                                marginBottom: 5,
                                                fontSize: 16,
                                            }}
                                        >
                                            750 gm
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
                                        Rs 250
                                    </Text>
                                    <RadioButton
                                        value="500gm"
                                        status={
                                            checked === '500gm'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setChecked('500gm')}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                margin: 10,
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : COLORS.white,
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                    fontSize: 18,
                                }}
                            >
                                Customize
                            </Text>
                            <Text
                                style={{
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                }}
                            >
                                Select any 1 option
                            </Text>
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
                                    <View style={{ marginRight: 10 }}>
                                        <Text
                                            style={{
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                                marginBottom: 5,
                                                fontSize: 16,
                                            }}
                                        >
                                            Jain
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <RadioButton
                                        value="250gm"
                                        status={
                                            checked === '250gm'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setChecked('250gm')}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                margin: 10,
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : COLORS.white,
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                    fontSize: 18,
                                }}
                            >
                                Add on
                            </Text>
                            <Text
                                style={{
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                }}
                            >
                                Select up to 1 option
                            </Text>
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
                                    <View style={{ marginRight: 10 }}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                                color: dark
                                                    ? COLORS.white
                                                    : COLORS.black,
                                                marginBottom: 5,
                                                fontSize: 16,
                                            }}
                                        >
                                            Butter Milk
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
                                        Rs 40
                                    </Text>
                                    <RadioButton
                                        value="250gm"
                                        status={
                                            checked === '250gm'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setChecked('250gm')}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                margin: 10,
                                backgroundColor: dark
                                    ? COLORS.dark3
                                    : COLORS.white,
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: dark ? COLORS.white : COLORS.black,
                                    marginBottom: 5,
                                    fontSize: 16,
                                }}
                            >
                                Add a cooking request (optional)
                            </Text>
                            <View
                                style={{
                                    margin: 10,
                                    backgroundColor: dark
                                        ? COLORS.dark2
                                        : COLORS.grayscale100,
                                    padding: 10,
                                    borderRadius: 10,
                                    height: 110,
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: '300',
                                        color: COLORS.gray,
                                    }}
                                >
                                    e.g don't make it spicy
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
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
                        <Pressable
                        // onPress={() => {
                        //     if (additems === 1) {
                        //         dispatch(
                        //             removeFromCart(food)
                        //         )
                        //         setSelected(false)
                        //         setAddItems(0)
                        //     } else {
                        //         setAddItems((c) => c - 1)
                        //         dispatch(
                        //             decrementQuantity(food)
                        //         )
                        //     }
                        // }}
                        >
                            <Text
                                style={{
                                    fontSize: 25,
                                    color: 'white',
                                    paddingHorizontal: 10,
                                }}
                                onPress={() => {
                                    if (additems === 1) {
                                        setSelected(false)
                                        setAddItems(0)
                                    } else {
                                        setAddItems((c) => c - 1)
                                    }
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
                                {additems}
                            </Text>
                        </Pressable>

                        <Pressable
                        // onPress={() => {
                        //     setAddItems((c) => c + 1)
                        //     dispatch(
                        //         incrementQuantity(food)
                        //     )
                        // }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: 'white',
                                    paddingHorizontal: 10,
                                }}
                                onPress={() => {
                                    setAddItems((c) => c + 1)
                                    setSelected(true)
                                }}
                            >
                                +
                            </Text>
                        </Pressable>
                    </Pressable>
                    <TouchableOpacity
                        onPress={() => refRBSheet.current.close()}
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                            marginHorizontal: 10,
                            backgroundColor: 'red',
                            padding: 15,
                            alignItems: 'center',
                            borderRadius: 10,
                            flex: 1,
                            marginLeft: 5,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                            Add Item
                        </Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
            {/* <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={360}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: dark
                            ? COLORS.dark3
                            : COLORS.grayscale200,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 360,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: 'center',
                    },
                }}
            >
                <Text
                    style={[
                        styles.bottomTitle,
                        {
                            color: dark ? COLORS.white : COLORS.greyscale900,
                        },
                    ]}
                >
                    Share
                </Text>
                <View
                    style={[
                        styles.separateLine,
                        {
                            backgroundColor: dark
                                ? COLORS.grayscale700
                                : COLORS.grayscale200,
                            marginVertical: 12,
                        },
                    ]}
                />
                <View style={styles.socialContainer}>
                    <SocialIcon
                        icon={socials.whatsapp}
                        name="WhatsApp"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.twitter}
                        name="X"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.facebook}
                        name="Facebook"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.instagram}
                        name="Instagram"
                        onPress={() => refRBSheet.current.close()}
                    />
                </View>
                <View style={styles.socialContainer}>
                    <SocialIcon
                        icon={socials.yahoo}
                        name="Yahoo"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.titktok}
                        name="Tiktok"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.messenger}
                        name="Chat"
                        onPress={() => refRBSheet.current.close()}
                    />
                    <SocialIcon
                        icon={socials.wechat}
                        name="Wechat"
                        onPress={() => refRBSheet.current.close()}
                    />
                </View>
            </RBSheet> */}
        </View>
    )
}

const styles = StyleSheet.create({
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -2,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.black,
    },
    bannerItemContainer: {
        width: SIZES.width - 30,
        marginTop: 10,
        paddingBottom: 10,
        backgroundColor: '#cce0ff',
        height: 55,
        borderRadius: 15,
    },
    searchBarContainer: {
        width: SIZES.width - 25,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
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
        width: 15,
        height: 15,
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16,
    },

    sendIconContainer: {
        marginLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        marginHorizontal: 12,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    headerTitle: {
        fontSize: 26,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    arrowRightIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
        marginVertical: 12,
    },
    separateLine: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.grayscale200,
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 2,
    },
    reviewLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avgRating: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginHorizontal: 8,
    },
    numReview: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.grayscale700,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    locationLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationDistance: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginHorizontal: 8,
    },
    deliverContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    deliverText: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.grayscale700,
        marginHorizontal: 8,
    },
    motoIcon: {
        width: 20,
        height: 20,
        tintColor: COLORS.primary,
    },
    offerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 2,
    },
    offerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discountIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.primary,
    },
    discountText: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginHorizontal: 16,
    },
    subtitle: {
        fontSize: 25,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        // marginVertical: 12,
    },
    bookBottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: SIZES.width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 104,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
    },
    bookingBtn: {
        width: SIZES.width - 32,
    },

    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        width: SIZES.width - 32,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    removeButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
    },
    bottomSubtitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        // textAlign: 'center',
        marginVertical: 12,
    },
    selectedCancelContainer: {
        marginVertical: 24,
        paddingHorizontal: 36,
        width: '100%',
    },
    cancelTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        textAlign: 'center',
    },
    cancelSubtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        textAlign: 'center',
        marginVertical: 8,
        marginTop: 16,
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        // paddingHorizontal: 28,
        paddingTop: 10,
        borderRadius: 32,
    },
    bannerTopContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerDicount: {
        textAlign: 'center',

        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.black,
        marginBottom: 4,
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
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
})

export default FoodDetails
