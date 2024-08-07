import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { COLORS, SIZES, FONTS, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import Input from '../components/Input'
import Button from '../components/Button'
import RNPickerSelect from 'react-native-picker-select'
import { useTheme } from '../theme/ThemeProvider'
import { uploadToS3 } from '../api/Home'
import { useSelector } from 'react-redux'
import { menuItemCategories } from '../data'
import { getMenuItemAPI } from '../api/Menu'

const initialState = {
    inputValues: {
        name: '',
        price: '',
        itemDescription: '',
    },
}

const AddMenuItem = ({ route, navigation }) => {
    const { subCategoryId, subCategoryNamee, categoryId, menuItemId } =
        route.params

    const subCategoriesList = useSelector((state) => state?.menu?.data)
    console.info('----------------------------')
    console.info('subCategoriesList =>', subCategoriesList)
    console.info('----------------------------')
    const [image, setImage] = useState(null)
    const [formState, setFormState] = useState(initialState)
    const { dark } = useTheme()
    const [subCategoryName, setSubCategoryName] = useState('')

    const [selectedCategories, setSelectedCategories] = useState(['0'])

    const [nameError, setNameError] = useState('')

    const [priceError, setPriceError] = useState('')
    const [itemDescriptionError, setItemDescriptionError] = useState('')

    useEffect(() => {
        if (subCategoryId) {
            setSubCategoryName(subCategoryId)
        }
    }, [subCategoryId])

    useEffect(() => {
        const fetchMenuItem = async () => {
            if (menuItemId) {
                try {
                    const resp = await getMenuItemAPI(menuItemId)

                    if (resp?.data?.data) {
                        setFormState({
                            inputValues: {
                                name: resp?.data?.data?.name || '',
                                price: String(resp?.data?.data?.price) || '',
                                itemDescription:
                                    resp?.data?.data?.additionalInfo || '',
                            },
                        })
                        setSelectedCategories(resp?.data?.data?.isVeg)
                        setSubCategoryName(resp?.data?.data?.subCategory?._id)
                    }
                } catch (error) {
                    console.error('Error fetching menu item:', error)
                }
            }
        }

        fetchMenuItem()
    }, [menuItemId])

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker()
            if (!tempUri) return
            const formData = new FormData()
            formData.append('file', {
                uri: tempUri,
                name: tempUri.split('/').pop(),
                type: 'image/jpeg',
            })
            const resp = await uploadToS3(formData)
            setImage({ uri: tempUri })
        } catch (error) {}
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

    const handleVerifySubCategories = () => {
        const { name, email, price, itemDescription } = formState.inputValues
        let isValid = true

        if (!name) {
            setNameError('Please enter Name')
            isValid = false
        } else {
            setNameError('')
        }

        if (!price) {
            setPriceError('Please enter Price')
            isValid = false
        } else if (isNaN(price)) {
            setPriceError('Please enter a valid number for Price')
            isValid = false
        } else {
            setPriceError('')
        }

        if (!itemDescription) {
            setItemDescriptionError('Please enter Item Description')
            isValid = false
        } else {
            setItemDescriptionError('')
        }

        if (selectedCategories.length === 0) {
            Alert.alert(
                'Validation Error',
                'Please select at least one category.'
            )
            isValid = false
        }

        if (isValid) {
            navigation.navigate('AddMenuItemInfo', {
                subCategoryId: subCategoryId,
                categoryId: categoryId,
                formState: formState,
                selectedCategories: selectedCategories,
                menuItemId: menuItemId,
            })
        }
    }

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
    // render countries codes modal

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
                    Item Details
                </Text>
                <Text> </Text>
            </View>
        )
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const inputChangedHandler = (inputId, value) => {
        setFormState((prevState) => ({
            ...prevState,
            inputValues: {
                ...prevState.inputValues,
                [inputId]: value,
            },
        }))
    }
    return (
        <SafeAreaView
            style={[
                styles.area,
                { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
            ]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: dark ? COLORS.dark1 : COLORS.white },
                ]}
            >
                {renderHeader()}
                <ScrollView>
                    {/* <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={image === null ? images.user1 : image}
                                resizeMode="cover"
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <View
                            style={[
                                styles.avatarContainer,
                                image === null &&
                                    styles.avatarContainerWithBorder,
                            ]}
                        >
                            {image === null ? (
                                <>
                                    <Text
                                        style={{
                                            color: COLORS.blue,
                                            fontSize: 20,
                                        }}
                                    >
                                        Add Image
                                    </Text>

                                    <Text
                                        style={{
                                            marginTop: 5,
                                            color: COLORS.gray,
                                            fontSize: 18,
                                        }}
                                    >
                                        Item with images leads to more orders
                                    </Text>
                                </>
                            ) : (
                                <Image
                                    source={
                                        image === null ? images.user1 : image
                                    }
                                    resizeMode="cover"
                                    style={styles.avatar}
                                />
                            )}
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        {/* <Text style={{ padding: 5 }}>Sub Category</Text>

                        <Input
                            value={subCategoryNamee}
                            editable={false}
                            // onChangeText={(value) => setFirstName(value)}
                            id="Sub Category"
                            placeholder="Sub Category"
                            placeholderTextColor={
                                dark ? COLORS.grayTie : COLORS.black
                            }
                        /> */}
                        <Text style={{ padding: 5 }}>Sub Category</Text>
                        <RNPickerSelect
                            onValueChange={(value) =>
                                console.log('aaaa', value)
                            }
                            items={subCategoriesList?.map((item) => ({
                                label: item?.name,
                                value: item?._id,
                            }))}
                            placeholder={{
                                label: 'Select a sub category',
                                value: null,
                                color: dark ? COLORS.grayTie : COLORS.black,
                            }}
                            value={subCategoryName}
                        />
                        <Input
                            value={formState.inputValues.name}
                            onChangeText={(value) =>
                                inputChangedHandler('name', value)
                            }
                            placeholder="Name"
                            placeholderTextColor={COLORS.grayTie}
                            style={styles.input}
                        />
                        {nameError ? (
                            <Text style={{ color: 'red' }}>{nameError}</Text>
                        ) : null}

                        <Input
                            value={formState.inputValues.price}
                            onChangeText={(value) =>
                                inputChangedHandler('price', value)
                            }
                            placeholder="Price"
                            placeholderTextColor={COLORS.grayTie}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                        {priceError ? (
                            <Text style={{ color: 'red' }}>{priceError}</Text>
                        ) : null}
                        <Input
                            value={formState.inputValues.itemDescription}
                            onChangeText={(value) =>
                                inputChangedHandler('itemDescription', value)
                            }
                            placeholder="Item Description"
                            placeholderTextColor={COLORS.grayTie}
                            style={styles.input}
                        />
                        {itemDescriptionError ? (
                            <Text style={{ color: 'red' }}>
                                {itemDescriptionError}
                            </Text>
                        ) : null}
                        <FlatList
                            style={{ marginLeft: 5, marginRight: 5 }}
                            data={menuItemCategories}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            renderItem={renderCategoryItem}
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
                <Button
                    title="Continue"
                    filled
                    style={styles.continueButton}
                    onPress={() => handleVerifySubCategories()}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    filterIcon: {
        width: 50,
        height: 30,
    },
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
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
        marginBottom: 80,
    },
    avatarContainer: {
        marginVertical: 12,
        alignItems: 'center',
        height: 200,
        width: 290,
        borderRadius: 5,
    },
    avatarContainerWithBorder: {
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'dashed',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        height: 200,
        width: 300,
        borderRadius: 5,
    },
    pickImage: {
        height: 42,
        width: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: -15,
        right: -15,
    },
    inputContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 6,
        height: 52,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 16,
        backgroundColor: COLORS.greyscale500,
    },
    downIcon: {
        width: 10,
        height: 10,
        tintColor: '#111',
    },
    selectFlagContainer: {
        width: 90,
        height: 50,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    flagIcon: {
        width: 30,
        height: 30,
    },
    input: {
        flex: 1,
        marginVertical: 10,
        height: 40,
        fontSize: 14,
        color: '#111',
    },
    inputBtn: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.greyscale500,
        height: 50,
        paddingLeft: 8,
        fontSize: 18,
        justifyContent: 'space-between',
        marginTop: 4,
        backgroundColor: COLORS.greyscale500,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    genderContainer: {
        flexDirection: 'row',
        borderColor: COLORS.greyscale500,
        borderWidth: 0.4,
        borderRadius: 6,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        marginVertical: 16,
        backgroundColor: COLORS.greyscale500,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 4,
        color: COLORS.greyscale600,
        paddingRight: 30,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        backgroundColor: COLORS.greyscale500,
        borderRadius: 16,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderRadius: 8,
        color: COLORS.greyscale600,
        paddingRight: 30,
        height: 58,
        width: SIZES.width - 32,
        alignItems: 'center',
        backgroundColor: COLORS.greyscale500,
        borderRadius: 16,
    },
})

export default AddMenuItem
