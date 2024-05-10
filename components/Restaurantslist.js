import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { useTheme } from '../theme/ThemeProvider'
import { FontAwesome } from '@expo/vector-icons'
import AutoSlider from './AutoSlider'

const Restaurantslist = ({
    name,
    image,
    distance,
    price,
    fee,
    rating,
    numReviews,
    onPress,
    cuisines,
    address,
}) => {
    const [isFavourite, setIsFavourite] = useState(false)
    const { dark } = useTheme()

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100,
                },
            ]}
        >
            <AutoSlider images={image} />
            <View style={styles.reviewContainer}>
                <Text style={styles.rating}>PROMO</Text>
            </View>
            <View style={{ padding: 10 }}>
                {/* <Image source={image} resizeMode="cover" style={styles.image} /> */}

                <Text
                    style={[
                        styles.name,
                        {
                            color: dark
                                ? COLORS.secondaryWhite
                                : COLORS.greyscale900,
                        },
                    ]}
                >
                    {name}
                </Text>
                <View style={styles.viewContainer}>
                    {cuisines.map((item, index) => (
                        <React.Fragment key={index}>
                            <Text
                                style={[
                                    styles.location,
                                    {
                                        color: dark
                                            ? COLORS.greyscale300
                                            : COLORS.grayscale700,
                                    },
                                ]}
                            >
                                {item}
                            </Text>
                            {index < 2 && (
                                <Text style={styles.location}> - </Text>
                            )}
                        </React.Fragment>
                    ))}
                </View>
                <View style={styles.viewContainer}>
                    <Text
                        style={[
                            styles.location,
                            {
                                color: dark
                                    ? COLORS.greyscale300
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        {address} |
                    </Text>
                    <FontAwesome
                        name="star"
                        size={14}
                        color="rgb(250, 159, 28)"
                    />
                    <Text
                        style={[
                            styles.location,
                            {
                                color: dark
                                    ? COLORS.greyscale300
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        {rating}
                    </Text>
                </View>
                <View style={styles.bottomPriceContainer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>120 RS</Text>
                        <Text style={styles.location}>{''}| </Text>
                        <Image
                            source={icons.moto}
                            resizeMode="contain"
                            style={styles.motoIcon}
                        />
                        <Text style={styles.location}>2 km 16 min</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsFavourite(!isFavourite)}
                    >
                        <Image
                            source={
                                isFavourite ? icons.heart2 : icons.heart2Outline
                            }
                            resizeMode="contain"
                            style={styles.heartIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flexDirection: 'column',
        // width: (SIZES.width - 32) / 2 - 12,
        backgroundColor: COLORS.white,
        // padding: 10,
        borderRadius: 16,
        marginBottom: 12,
        // marginRight: 8,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 16,
    },
    name: {
        paddingLeft: 5,
        fontSize: 26,
        // fontFamily: 'semiBold',
        // fontFamily: 'bold',
        fontWeight: 600,
        color: COLORS.greyscale900,
        marginVertical: 2,
    },
    location: {
        paddingLeft: 5,
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.grayscale700,
        marginVertical: 2,
    },
    bottomPriceContainer: {
        paddingLeft: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        marginRight: 8,
    },
    duration: {
        fontSize: 10,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        marginRight: 8,
    },
    durationText: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
    },
    heartIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.red,
        marginLeft: 6,
    },
    reviewContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 56,
        height: 20,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rating: {
        fontSize: 12,
        fontFamily: 'semiBold',
        color: COLORS.white,
        marginLeft: 4,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    motoIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.primary,
        marginRight: 4,
    },
})

export default Restaurantslist
