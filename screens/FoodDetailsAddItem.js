import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, SIZES, icons, images, socials } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import AutoSlider from '../components/AutoSlider';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-virtualized-view';
import RBSheet from "react-native-raw-bottom-sheet";
import SocialIcon from '../components/SocialIcon';
import Button from '../components/Button';

const FoodDetailsAddItem = ({ navigation }) => {
    const { colors, dark } = useTheme();
    const refRBSheet = useRef();

    // Slider images
    const sliderImages = [
        images.pizza1,
        images.pizza2,
        images.pizza3,
        images.pizza4,
        images.pizza5,
    ];

    // render header
    const renderHeader = () => {
        const [isFavorite, setIsFavorite] = useState(false);

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                    <TouchableOpacity
                        onPress={() => setIsFavorite(!isFavorite)}>
                        <Image
                            source={isFavorite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={styles.bookmarkIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.sendIconContainer}
                        onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.send2}
                            resizeMode='contain'
                            style={styles.sendIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    // render content
    const renderContent = () => {
        const [expanded, setExpanded] = useState(false);
        const [count, setCount] = useState(1); // Initial count value

        const description = `Indulge in the freshest medley of flavors with our Big Garden Salad! Crisp greens, ripe tomatoes, crunchy cucumbers, and an array of vibrant vegetables come together in a harmony of taste and texture. Tossed with your choice of zesty dressing, every bite is a symphony of freshness that will tantalize your taste buds. Whether you're looking for a light lunch or a refreshing side dish, our Big Garden Salad is the perfect choice for health-conscious foodies and salad enthusiasts alike. Savor the goodness of nature's bounty – order yours today!`
        const toggleExpanded = () => {
            setExpanded(!expanded);
        };

        const decreaseCount = () => {
            if (count > 1) {
                setCount(count - 1);
            }
        };

        const increaseCount = () => {
            setCount(count + 1);
        };
        return (
            <View style={styles.contentContainer}>
                <Text style={[styles.headerContentTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                }]}>
                    Mixed Vegetable Salad
                </Text>
                <View style={[styles.separateLine, {
                    marginVertical: 12,
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                }]} />
                <Text style={[styles.description, {
                    color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                }]} numberOfLines={expanded ? undefined : 4}>{description}</Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.viewBtn}>
                        {expanded ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>
                <View style={styles.addItemContainer}>
                    <TouchableOpacity style={[styles.addItemBtn, {
                        borderColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                    }]} onPress={decreaseCount}>
                        <Text style={styles.addItemBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.addItemText}>{count}</Text>
                    <TouchableOpacity style={[styles.addItemBtn, {
                        borderColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
                    }]} onPress={increaseCount}>
                        <Text style={styles.addItemBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    placeholder='Note to Restaurant (optional)'
                    placeholderTextColor={COLORS.grayscale700}
                    style={[styles.input, {
                        backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                        borderColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                    }]}
                    multiline={true}
                />
            </View>
        )
    }

    return (
        <View style={[styles.area, { backgroundColor: colors.background }]}>
            <StatusBar hidden />
            <AutoSlider images={sliderImages} />
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>
            <Button
                title="Add To Basket"
                filled
                style={styles.btn}
                onPress={() => navigation.navigate("CheckoutOrders")}
            />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={360}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    draggableIcon: {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 360,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: "center",
                    }
                }}>
                <Text style={[styles.bottomTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>Share</Text>
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                    marginVertical: 12
                }]} />
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
            </RBSheet>
        </View>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    },
    sendIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white
    },
    sendIconContainer: {
        marginLeft: 8
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    contentContainer: {
        marginHorizontal: 12
    },
    separateLine: {
        width: SIZES.width - 32,
        height: 1,
        backgroundColor: COLORS.grayscale200
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: "semiBold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12
    },
    socialContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        width: SIZES.width - 32
    },
    headerContentTitle: {
        fontSize: 28,
        fontFamily: "bold",
        color: COLORS.black,
        marginTop: 12
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: "regular",
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: "semiBold",
    },
    subItemContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 22
    },
    addItemBtn: {
        height: 52,
        width: 52,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderColor: COLORS.grayscale200,
        borderWidth: 1
    },
    addItemBtnText: {
        fontSize: 24,
        color: COLORS.primary,
        fontFamily: "medium"
    },
    addItemText: {
        fontSize: 20,
        color: COLORS.greyscale900,
        fontFamily: "semiBold",
        marginHorizontal: 22
    },
    input: {
        width: SIZES.width - 32,
        height: 72,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        paddingHorizontal: 10,
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.grayscale700,
        marginVertical: 12,
        backgroundColor: COLORS.tertiaryWhite
    },
    btn: {
        width: SIZES.width - 32,
        marginHorizontal: 16,
        marginBottom: 24
    }
})

export default FoodDetailsAddItem