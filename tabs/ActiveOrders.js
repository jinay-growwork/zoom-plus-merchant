import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Pressable,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { activeOrders } from '../data'
import { SIZES, COLORS } from '../constants'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTheme } from '../theme/ThemeProvider'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../redux/Menu/actions'
import { Switch } from 'react-native-paper'
import { verifyInStockAPI } from './../api/Menu/index'

const ActiveOrders = () => {
    const categoryList = useSelector((state) => state?.menu?.data)

    const dispatch = useDispatch()
    const [orders, setOrders] = useState(activeOrders)
    const refRBSheet = useRef()
    const { dark } = useTheme()
    const navigation = useNavigation()

    const [selected, setSelected] = useState(true)

    const [selectedItem, setSelectedItem] = useState(['Recommended'])
    useEffect(() => {
        if (categoryList && categoryList.length > 0) {
            const categoryNames = categoryList.map((item) => item?.name)
            setSelectedItem(['Recommended', ...categoryNames])
        }
    }, [categoryList])

    const handleItemSelect = (item) => {
        setSelected(false)
        const itemSelected = selectedItem.find((c) => c === item)
        if (itemSelected) {
            setSelectedItem(selectedItem.filter((sel) => sel !== item))
        } else {
            setSelectedItem([...selectedItem, item])
        }
    }
    useEffect(() => {
        dispatch({
            type: actions.GET_CATEGORY,
        })
    }, [])

    const [isSwitchOn, setIsSwitchOn] = useState(false)
    const [isStockSwitchOn, setIsStockSwitchOn] = useState(false)
    const [isRecommendActive, setIsRecommendActive] = useState(false)
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn)

    const [stockSwitches, setStockSwitches] = useState({})
    const [recommendSwitches, setRecommendSwitches] = useState({})

    const onToggleStockSwitch = async (itemId) => {
        const newStockSwitches = {
            ...stockSwitches,
            [itemId]: !stockSwitches[itemId],
        }
        setStockSwitches(newStockSwitches)
        const payload = { id: itemId, inStock: newStockSwitches[itemId] }
        const resp = await verifyInStockAPI(payload)
        console.info('----------------------------')
        console.info('resp verifyInStockAPI =>', resp)
        console.info('----------------------------')
    }

    const toggleRecommend = (itemId) => {
        setRecommendSwitches((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }))
    }

    const handleEdit = (id) => {
        navigation.navigate('AddMenuItem', {
            menuItemId: id,
        })
    }
    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
                },
            ]}
        >
            <ScrollView>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddCategory')}
                    style={{
                        marginTop: 10,
                        marginBottom: 10,
                        marginHorizontal: 10,
                        backgroundColor: 'white',
                        padding: 10,
                        alignItems: 'center',
                        borderRadius: 10,
                        borderColor: COLORS.red,
                        borderWidth: 1,
                    }}
                >
                    <Text style={{ color: COLORS.red, fontWeight: 'bold' }}>
                        + Add Category
                    </Text>
                </TouchableOpacity>

                {categoryList &&
                    categoryList?.map((category, index) => (
                        <View
                            style={{
                                backgroundColor: COLORS.white,
                                margin: 10,
                                borderRadius: 10,
                            }}
                        >
                            <View key={index}>
                                <Pressable
                                    onPress={() =>
                                        handleItemSelect(category?.name)
                                    }
                                    style={{
                                        margin: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
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
                                        {category.name}
                                    </Text>
                                    <AntDesign
                                        name="down"
                                        size={24}
                                        color={
                                            dark
                                                ? COLORS.white
                                                : COLORS.greyscale900
                                        }
                                    />
                                </Pressable>
                                {selectedItem.includes(category?.name) && (
                                    <>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginHorizontal: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 'semi bold',
                                                    color: dark
                                                        ? COLORS.white
                                                        : COLORS.gray,
                                                }}
                                            >
                                                {category.name}(
                                                {
                                                    category?.merchantItems
                                                        ?.length
                                                }
                                                )
                                            </Text>
                                            <Switch
                                                value={isSwitchOn}
                                                onValueChange={onToggleSwitch}
                                            />
                                        </View>
                                        <FlatList
                                            data={category?.merchantItems}
                                            keyExtractor={(item) => item.id}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.cardContainer,
                                                        {
                                                            backgroundColor:
                                                                dark
                                                                    ? COLORS.dark2
                                                                    : COLORS.white,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={
                                                            styles.detailsContainer
                                                        }
                                                    >
                                                        <View>
                                                            <Image
                                                                source={
                                                                    item?.images
                                                                }
                                                                resizeMode="cover"
                                                                style={
                                                                    styles.serviceImage
                                                                }
                                                            />
                                                            <View
                                                                style={
                                                                    styles.reviewContainer
                                                                }
                                                            >
                                                                <FontAwesome
                                                                    name="star"
                                                                    size={12}
                                                                    color="orange"
                                                                />
                                                                <Text
                                                                    style={
                                                                        styles.rating
                                                                    }
                                                                >
                                                                    {
                                                                        item.rating
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View
                                                            style={
                                                                styles.detailsRightContainer
                                                            }
                                                        >
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
                                                                {item.name}
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styles.address,
                                                                    {
                                                                        color: dark
                                                                            ? COLORS.grayscale400
                                                                            : COLORS.grayscale700,
                                                                    },
                                                                ]}
                                                            >
                                                                {
                                                                    item?.additionalInfo
                                                                }
                                                            </Text>
                                                            <View
                                                                style={
                                                                    styles.priceContainer
                                                                }
                                                            >
                                                                <View
                                                                    style={
                                                                        styles.priceItemContainer
                                                                    }
                                                                >
                                                                    <Text
                                                                        style={
                                                                            styles.totalPrice
                                                                        }
                                                                    >
                                                                        Rs{' '}
                                                                        {
                                                                            item?.price
                                                                        }
                                                                        /-
                                                                    </Text>
                                                                </View>
                                                                {/* <View
                                                    style={
                                                        styles.statusContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.statusText
                                                        }
                                                    >
                                                        {item.status}
                                                    </Text>
                                                </View> */}
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={[
                                                            styles.separateLine,
                                                            {
                                                                marginVertical: 10,
                                                                backgroundColor:
                                                                    dark
                                                                        ? COLORS.greyScale800
                                                                        : COLORS.grayscale200,
                                                            },
                                                        ]}
                                                    />

                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'space-between',
                                                            marginHorizontal: 10,
                                                        }}
                                                    >
                                                        <TouchableOpacity
                                                            onPress={
                                                                toggleRecommend
                                                            }
                                                        >
                                                            <View
                                                                style={{
                                                                    flexDirection:
                                                                        'row',
                                                                    alignItems:
                                                                        'center',
                                                                }}
                                                            >
                                                                <FontAwesome
                                                                    name="thumbs-up"
                                                                    size={24}
                                                                    color={
                                                                        isRecommendActive
                                                                            ? COLORS.blue
                                                                            : dark
                                                                              ? COLORS.white
                                                                              : COLORS.greyscale900
                                                                    }
                                                                />
                                                                <Text
                                                                    style={{
                                                                        marginLeft: 3,
                                                                        fontSize: 17,
                                                                        fontWeight:
                                                                            'bold',
                                                                        color: dark
                                                                            ? COLORS.white
                                                                            : COLORS.gray,
                                                                    }}
                                                                >
                                                                    Recommend
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>

                                                        <View
                                                            style={{
                                                                flexDirection:
                                                                    'row',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            <Switch
                                                                value={
                                                                    stockSwitches[
                                                                        item._id
                                                                    ] ?? false
                                                                }
                                                                onValueChange={() =>
                                                                    onToggleStockSwitch(
                                                                        item._id
                                                                    )
                                                                }
                                                            />
                                                            <Text
                                                                style={{
                                                                    fontSize: 17,
                                                                    fontWeight:
                                                                        'bold',
                                                                    color: dark
                                                                        ? COLORS.white
                                                                        : COLORS.gray,
                                                                }}
                                                            >
                                                                In Stock
                                                            </Text>
                                                        </View>

                                                        <View
                                                            style={{
                                                                flexDirection:
                                                                    'row',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            <MaterialIcons
                                                                name="edit"
                                                                size={24}
                                                                color={
                                                                    dark
                                                                        ? COLORS.white
                                                                        : COLORS.greyscale900
                                                                }
                                                                onPress={() =>
                                                                    handleEdit(
                                                                        item._id
                                                                    )
                                                                }
                                                            />
                                                            <Text
                                                                style={{
                                                                    marginLeft: 3,
                                                                    fontSize: 17,
                                                                    fontWeight:
                                                                        'bold',
                                                                    color: dark
                                                                        ? COLORS.white
                                                                        : COLORS.gray,
                                                                }}
                                                            >
                                                                Edit
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={[
                                                            styles.separateLine,
                                                            {
                                                                marginVertical: 10,
                                                                backgroundColor:
                                                                    dark
                                                                        ? COLORS.greyScale800
                                                                        : COLORS.grayscale200,
                                                            },
                                                        ]}
                                                    />
                                                </TouchableOpacity>
                                            )}
                                        />
                                        {category?.subCategory?.length > 0
                                            ? category?.subCategory?.map(
                                                  (subCat) => (
                                                      <>
                                                          <View
                                                              style={{
                                                                  flexDirection:
                                                                      'row',
                                                                  alignItems:
                                                                      'center',
                                                                  justifyContent:
                                                                      'space-between',
                                                                  marginHorizontal: 10,
                                                                  marginBottom: 10,
                                                              }}
                                                          >
                                                              <Text
                                                                  style={{
                                                                      fontSize: 18,
                                                                      fontWeight:
                                                                          'semi bold',
                                                                      color: dark
                                                                          ? COLORS.white
                                                                          : COLORS.gray,
                                                                  }}
                                                              >
                                                                  {subCat.name}(
                                                                  {
                                                                      subCat
                                                                          ?.merchantItems
                                                                          ?.length
                                                                  }
                                                                  )
                                                              </Text>
                                                              <Switch
                                                                  value={
                                                                      isSwitchOn
                                                                  }
                                                                  onValueChange={
                                                                      onToggleSwitch
                                                                  }
                                                              />
                                                          </View>
                                                          <FlatList
                                                              data={
                                                                  subCat?.merchantItems
                                                              }
                                                              keyExtractor={(
                                                                  item
                                                              ) => item.id}
                                                              showsVerticalScrollIndicator={
                                                                  false
                                                              }
                                                              renderItem={({
                                                                  item,
                                                              }) => (
                                                                  <TouchableOpacity
                                                                      style={[
                                                                          styles.cardContainer,
                                                                          {
                                                                              backgroundColor:
                                                                                  dark
                                                                                      ? COLORS.dark2
                                                                                      : COLORS.white,
                                                                          },
                                                                      ]}
                                                                  >
                                                                      <View
                                                                          style={
                                                                              styles.detailsContainer
                                                                          }
                                                                      >
                                                                          <View>
                                                                              <Image
                                                                                  source={
                                                                                      item?.images
                                                                                  }
                                                                                  resizeMode="cover"
                                                                                  style={
                                                                                      styles.serviceImage
                                                                                  }
                                                                              />
                                                                              <View
                                                                                  style={
                                                                                      styles.reviewContainer
                                                                                  }
                                                                              >
                                                                                  <FontAwesome
                                                                                      name="star"
                                                                                      size={
                                                                                          12
                                                                                      }
                                                                                      color="orange"
                                                                                  />
                                                                                  <Text
                                                                                      style={
                                                                                          styles.rating
                                                                                      }
                                                                                  >
                                                                                      {
                                                                                          item.rating
                                                                                      }
                                                                                  </Text>
                                                                              </View>
                                                                          </View>
                                                                          <View
                                                                              style={
                                                                                  styles.detailsRightContainer
                                                                              }
                                                                          >
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
                                                                                  {
                                                                                      item.name
                                                                                  }
                                                                              </Text>
                                                                              <Text
                                                                                  style={[
                                                                                      styles.address,
                                                                                      {
                                                                                          color: dark
                                                                                              ? COLORS.grayscale400
                                                                                              : COLORS.grayscale700,
                                                                                      },
                                                                                  ]}
                                                                              >
                                                                                  {
                                                                                      item?.additionalInfo
                                                                                  }
                                                                              </Text>
                                                                              <View
                                                                                  style={
                                                                                      styles.priceContainer
                                                                                  }
                                                                              >
                                                                                  <View
                                                                                      style={
                                                                                          styles.priceItemContainer
                                                                                      }
                                                                                  >
                                                                                      <Text
                                                                                          style={
                                                                                              styles.totalPrice
                                                                                          }
                                                                                      >
                                                                                          Rs{' '}
                                                                                          {
                                                                                              item?.price
                                                                                          }
                                                                                          /-
                                                                                      </Text>
                                                                                  </View>
                                                                                  {/* <View
                                                    style={
                                                        styles.statusContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.statusText
                                                        }
                                                    >
                                                        {item.status}
                                                    </Text>
                                                </View> */}
                                                                              </View>
                                                                          </View>
                                                                      </View>
                                                                      <View
                                                                          style={[
                                                                              styles.separateLine,
                                                                              {
                                                                                  marginVertical: 10,
                                                                                  backgroundColor:
                                                                                      dark
                                                                                          ? COLORS.greyScale800
                                                                                          : COLORS.grayscale200,
                                                                              },
                                                                          ]}
                                                                      />

                                                                      <View
                                                                          style={{
                                                                              flexDirection:
                                                                                  'row',
                                                                              alignItems:
                                                                                  'center',
                                                                              justifyContent:
                                                                                  'space-between',
                                                                              marginHorizontal: 10,
                                                                          }}
                                                                      >
                                                                          <TouchableOpacity
                                                                              onPress={
                                                                                  toggleRecommend
                                                                              }
                                                                          >
                                                                              <View
                                                                                  style={{
                                                                                      flexDirection:
                                                                                          'row',
                                                                                      alignItems:
                                                                                          'center',
                                                                                  }}
                                                                              >
                                                                                  <FontAwesome
                                                                                      name="thumbs-up"
                                                                                      size={
                                                                                          24
                                                                                      }
                                                                                      color={
                                                                                          isRecommendActive
                                                                                              ? COLORS.blue
                                                                                              : dark
                                                                                                ? COLORS.white
                                                                                                : COLORS.greyscale900
                                                                                      }
                                                                                  />
                                                                                  <Text
                                                                                      style={{
                                                                                          marginLeft: 3,
                                                                                          fontSize: 17,
                                                                                          fontWeight:
                                                                                              'bold',
                                                                                          color: dark
                                                                                              ? COLORS.white
                                                                                              : COLORS.gray,
                                                                                      }}
                                                                                  >
                                                                                      Recommend
                                                                                  </Text>
                                                                              </View>
                                                                          </TouchableOpacity>

                                                                          <View
                                                                              style={{
                                                                                  flexDirection:
                                                                                      'row',
                                                                                  alignItems:
                                                                                      'center',
                                                                              }}
                                                                          >
                                                                              <Switch
                                                                                  value={
                                                                                      stockSwitches[
                                                                                          item
                                                                                              ._id
                                                                                      ] ??
                                                                                      false
                                                                                  }
                                                                                  onValueChange={() =>
                                                                                      onToggleStockSwitch(
                                                                                          item._id
                                                                                      )
                                                                                  }
                                                                              />
                                                                              <Text
                                                                                  style={{
                                                                                      fontSize: 17,
                                                                                      fontWeight:
                                                                                          'bold',
                                                                                      color: dark
                                                                                          ? COLORS.white
                                                                                          : COLORS.gray,
                                                                                  }}
                                                                              >
                                                                                  In
                                                                                  Stock
                                                                              </Text>
                                                                          </View>

                                                                          <View
                                                                              style={{
                                                                                  flexDirection:
                                                                                      'row',
                                                                                  alignItems:
                                                                                      'center',
                                                                              }}
                                                                          >
                                                                              <MaterialIcons
                                                                                  name="edit"
                                                                                  size={
                                                                                      24
                                                                                  }
                                                                                  color={
                                                                                      dark
                                                                                          ? COLORS.white
                                                                                          : COLORS.greyscale900
                                                                                  }
                                                                                  onPress={() =>
                                                                                      handleEdit(
                                                                                          item._id
                                                                                      )
                                                                                  }
                                                                              />
                                                                              <Text
                                                                                  style={{
                                                                                      marginLeft: 3,
                                                                                      fontSize: 17,
                                                                                      fontWeight:
                                                                                          'bold',
                                                                                      color: dark
                                                                                          ? COLORS.white
                                                                                          : COLORS.gray,
                                                                                  }}
                                                                              >
                                                                                  Edit
                                                                              </Text>
                                                                          </View>
                                                                      </View>
                                                                      <View
                                                                          style={[
                                                                              styles.separateLine,
                                                                              {
                                                                                  marginVertical: 10,
                                                                                  backgroundColor:
                                                                                      dark
                                                                                          ? COLORS.greyScale800
                                                                                          : COLORS.grayscale200,
                                                                              },
                                                                          ]}
                                                                      />
                                                                  </TouchableOpacity>
                                                              )}
                                                          />
                                                      </>
                                                  )
                                              )
                                            : null}

                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate(
                                                        'SubCategoryList',
                                                        {
                                                            categoryId:
                                                                category?._id,
                                                        }
                                                    )
                                                }
                                                style={styles.cancelBtn}
                                            >
                                                <Text
                                                    style={styles.cancelBtnText}
                                                >
                                                    Add Item
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate(
                                                        'AddSubCategory',
                                                        {
                                                            categoryId:
                                                                category?._id,
                                                        }
                                                    )
                                                }
                                                style={styles.receiptBtn}
                                            >
                                                <Text
                                                    style={
                                                        styles.receiptBtnText
                                                    }
                                                >
                                                    Add Sub Category
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    ))}
            </ScrollView>

            <RBSheet
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
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 332,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        alignItems: 'center',
                        width: '100%',
                    },
                }}
            >
                <Text
                    style={[
                        styles.bottomSubtitle,
                        {
                            color: dark ? COLORS.red : COLORS.red,
                        },
                    ]}
                >
                    Cancel Booking
                </Text>
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

                <View style={styles.selectedCancelContainer}>
                    <Text
                        style={[
                            styles.cancelTitle,
                            {
                                color: dark
                                    ? COLORS.secondaryWhite
                                    : COLORS.greyscale900,
                            },
                        ]}
                    >
                        Are you sure you want to cancel your order?
                    </Text>
                    <Text
                        style={[
                            styles.cancelSubtitle,
                            {
                                color: dark
                                    ? COLORS.grayscale400
                                    : COLORS.grayscale700,
                            },
                        ]}
                    >
                        Only 80% of the money you can refund from your payment
                        according to our policy.
                    </Text>
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Cancel"
                        filled
                        style={styles.removeButton}
                        onPress={() => {
                            refRBSheet.current.close()
                            navigation.navigate('CancelOrder')
                        }}
                    />
                </View>
            </RBSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.tertiaryWhite,
        marginVertical: 22,
        marginBottom: 50,
    },
    cardContainer: {
        width: SIZES.width - 32,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 8,
        // marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    statusContainer: {
        width: 54,
        height: 24,
        borderRadius: 6,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.primary,
        fontFamily: 'medium',
    },
    separateLine: {
        width: '100%',
        height: 0.7,
        backgroundColor: COLORS.greyScale800,
        marginVertical: 12,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImage: {
        width: 88,
        height: 88,
        borderRadius: 16,
        marginHorizontal: 12,
    },
    detailsRightContainer: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    address: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 6,
    },
    serviceTitle: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
    },
    serviceText: {
        fontSize: 12,
        color: COLORS.primary,
        fontFamily: 'medium',
        marginTop: 6,
    },
    cancelBtn: {
        width: (SIZES.width - 32) / 2 - 16,
        height: 36,
        borderRadius: 24,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    receiptBtn: {
        width: (SIZES.width - 32) / 2 - 16,
        height: 36,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
    },
    receiptBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
    },
    buttonContainer: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    remindMeText: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
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
        textAlign: 'center',
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
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    totalPrice: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    duration: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        textAlign: 'center',
    },
    priceItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    reviewContainer: {
        position: 'absolute',
        top: 6,
        right: 16,
        width: 46,
        height: 20,
        borderRadius: 16,
        backgroundColor: COLORS.transparentWhite2,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rating: {
        fontSize: 12,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        marginLeft: 4,
    },
})

export default ActiveOrders
