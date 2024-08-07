import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import {
    AddNewAddress,
    AddNewCard,
    AddPromo,
    Address,
    Call,
    CancelOrder,
    CancelOrderPaymentMethods,
    Categories,
    CategoryBread,
    CategoryHamburger,
    CategoryMeat,
    CategoryPizza,
    ChangeEmail,
    ChangePIN,
    ChangePassword,
    Chat,
    CheckoutOrders,
    CheckoutOrdersAddress,
    CheckoutOrdersCompleted,
    CreateNewPIN,
    CreateNewPassword,
    CustomerService,
    DiscountFoods,
    DriverDetails,
    EReceipt,
    EditProfile,
    EnterYourPIN,
    Favourite,
    FillYourProfile,
    Fingerprint,
    FoodDetails,
    FoodDetailsAbout,
    FoodDetailsAddItem,
    FoodDetailsOffers,
    FoodReviews,
    ForgotPasswordEmail,
    ForgotPasswordMethods,
    ForgotPasswordPhoneNumber,
    GiveTipForDriver,
    HelpCenter,
    Home,
    InviteFriends,
    Login,
    MyCart,
    Notifications,
    OTPVerification,
    Onboarding1,
    Onboarding2,
    Onboarding3,
    Onboarding4,
    PaymentMethods,
    RateTheDriver,
    RateTheRestaurant,
    RecommendedFoods,
    Search,
    SearchingDriver,
    SettingsLanguage,
    SettingsNotifications,
    SettingsPayment,
    SettingsPrivacyPolicy,
    SettingsSecurity,
    Signup,
    TopupEwalletAmount,
    TopupEwalletMethods,
    TrackDriver,
    TransactionHistory,
    VideoCall,
    VoiceCall,
    Welcome,
    WhatsYourMood,
} from '../screens'
import BottomTabNavigation from './BottomTabNavigation'
import { useSelector } from 'react-redux'
import { retrieveData } from '../helper'
import SplashScreen from './../components/Splash'
import useAuthContext from '../hooks/useAuth'
import LoginPage from '../screens/LoginPage'
import MenuCategories from '../screens/MenuCategories'
import RestaurantList from '../screens/RestaurantList'
import MenuSubCategories from '../screens/MenuSubCategories'
import SubCategoriesList from '../screens/SubCategoriesList'
import AddMenuItem from '../screens/AddMenuItem'
import AddMenuItemInfo from '../screens/AddMenuItemInfo'

const Stack = createNativeStackNavigator()

const AppNavigation = ({ hideSplashScreen, isfontsLoaded }) => {
    const {
        isAuthLoading,
        isLogin,
        isFirstLaunch,
        isAppReady,
        initialRouteName,
    } = useAuthContext()
    useEffect(() => {
        if (isAppReady && initialRouteName !== null) {
            hideSplashScreen()
        }
    }, [isLogin, isAppReady, isFirstLaunch])

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    headerBackVisible: false,
                }}
                initialRouteName="Login"
            >
                <>
                    {!isLogin ? (
                        <>
                            <Stack.Group>
                                <Stack.Screen
                                    name="Onboarding1"
                                    component={Onboarding1}
                                />
                                <Stack.Screen
                                    name="Onboarding2"
                                    component={Onboarding2}
                                />
                                <Stack.Screen
                                    name="Onboarding3"
                                    component={Onboarding3}
                                />
                                <Stack.Screen
                                    name="Onboarding4"
                                    component={Onboarding4}
                                />
                                <Stack.Screen
                                    name="Welcome"
                                    component={Welcome}
                                />
                                <Stack.Screen name="Login" component={Login} />
                                <Stack.Screen
                                    name="LoginPage"
                                    component={LoginPage}
                                />
                                <Stack.Screen
                                    name="Signup"
                                    component={Signup}
                                />
                                <Stack.Screen
                                    name="OTPVerification"
                                    component={OTPVerification}
                                />

                                <Stack.Screen
                                    name="ForgotPasswordMethods"
                                    component={ForgotPasswordMethods}
                                />
                                <Stack.Screen
                                    name="ForgotPasswordEmail"
                                    component={ForgotPasswordEmail}
                                />
                                <Stack.Screen
                                    name="ForgotPasswordPhoneNumber"
                                    component={ForgotPasswordPhoneNumber}
                                />
                                <Stack.Screen
                                    name="FillYourProfile"
                                    component={FillYourProfile}
                                />
                                <Stack.Screen
                                    name="RestaurantList"
                                    component={RestaurantList}
                                />
                            </Stack.Group>
                        </>
                    ) : (
                        <>
                            {/* <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen
                            name="CreateNewPassword"
                            component={CreateNewPassword}
                        />
                     
                        <Stack.Screen
                            name="CreateNewPIN"
                            component={CreateNewPIN}
                        />
                        <Stack.Screen
                            name="Fingerprint"
                            component={Fingerprint}
                        /> */}
                            {/* <Stack.Screen
                            name="FillYourProfile"
                            component={FillYourProfile}
                        /> */}

                            <Stack.Group>
                                <Stack.Screen
                                    name="Main"
                                    component={BottomTabNavigation}
                                />

                                <Stack.Screen
                                    name="EditProfile"
                                    component={EditProfile}
                                />

                                <Stack.Screen
                                    name="AddCategory"
                                    component={MenuCategories}
                                />
                                <Stack.Screen
                                    name="AddSubCategory"
                                    component={MenuSubCategories}
                                />
                                <Stack.Screen
                                    name="SubCategoryList"
                                    component={SubCategoriesList}
                                />
                                <Stack.Screen
                                    name="AddMenuItem"
                                    component={AddMenuItem}
                                />
                                <Stack.Screen
                                    name="AddMenuItemInfo"
                                    component={AddMenuItemInfo}
                                />
                                <Stack.Screen
                                    name="SettingsNotifications"
                                    component={SettingsNotifications}
                                />
                                <Stack.Screen
                                    name="SettingsPayment"
                                    component={SettingsPayment}
                                />
                                <Stack.Screen
                                    name="AddNewCard"
                                    component={AddNewCard}
                                />
                                <Stack.Screen
                                    name="SettingsSecurity"
                                    component={SettingsSecurity}
                                />
                                <Stack.Screen
                                    name="ChangePIN"
                                    component={ChangePIN}
                                />
                                <Stack.Screen
                                    name="ChangePassword"
                                    component={ChangePassword}
                                />
                                <Stack.Screen
                                    name="ChangeEmail"
                                    component={ChangeEmail}
                                />
                                <Stack.Screen
                                    name="SettingsLanguage"
                                    component={SettingsLanguage}
                                />
                                <Stack.Screen
                                    name="SettingsPrivacyPolicy"
                                    component={SettingsPrivacyPolicy}
                                />
                                <Stack.Screen
                                    name="InviteFriends"
                                    component={InviteFriends}
                                />
                                <Stack.Screen
                                    name="HelpCenter"
                                    component={HelpCenter}
                                />
                                <Stack.Screen
                                    name="CustomerService"
                                    component={CustomerService}
                                />
                                <Stack.Screen
                                    name="EReceipt"
                                    component={EReceipt}
                                />
                                <Stack.Screen name="Call" component={Call} />
                                <Stack.Screen name="Chat" component={Chat} />
                                <Stack.Screen
                                    name="Notifications"
                                    component={Notifications}
                                />
                                <Stack.Screen
                                    name="Search"
                                    component={Search}
                                />
                                <Stack.Screen
                                    name="PaymentMethods"
                                    component={PaymentMethods}
                                />
                                <Stack.Screen
                                    name="CancelOrder"
                                    component={CancelOrder}
                                />
                                <Stack.Screen
                                    name="CancelOrderPaymentMethods"
                                    component={CancelOrderPaymentMethods}
                                />
                                <Stack.Screen
                                    name="EnterYourPIN"
                                    component={EnterYourPIN}
                                />
                                <Stack.Screen
                                    name="TransactionHistory"
                                    component={TransactionHistory}
                                />
                                <Stack.Screen
                                    name="TopupEwalletAmount"
                                    component={TopupEwalletAmount}
                                />
                                <Stack.Screen
                                    name="TopupEwalletMethods"
                                    component={TopupEwalletMethods}
                                />
                                <Stack.Screen
                                    name="AddPromo"
                                    component={AddPromo}
                                />
                                <Stack.Screen
                                    name="Address"
                                    component={Address}
                                />
                                <Stack.Screen
                                    name="AddNewAddress"
                                    component={AddNewAddress}
                                />
                                <Stack.Screen
                                    name="Categories"
                                    component={Categories}
                                />
                                <Stack.Screen
                                    name="DiscountFoods"
                                    component={DiscountFoods}
                                />
                                <Stack.Screen
                                    name="RecommendedFoods"
                                    component={RecommendedFoods}
                                />
                                <Stack.Screen
                                    name="CategoryPizza"
                                    component={CategoryPizza}
                                />
                                <Stack.Screen
                                    name="CategoryBread"
                                    component={CategoryBread}
                                />
                                <Stack.Screen
                                    name="CategoryHamburger"
                                    component={CategoryHamburger}
                                />
                                <Stack.Screen
                                    name="CategoryMeat"
                                    component={CategoryMeat}
                                />
                                <Stack.Screen
                                    name="Favourite"
                                    component={Favourite}
                                />
                                <Stack.Screen
                                    name="FoodDetails"
                                    component={FoodDetails}
                                />
                                <Stack.Screen
                                    name="FoodReviews"
                                    component={FoodReviews}
                                />
                                <Stack.Screen
                                    name="FoodDetailsAbout"
                                    component={FoodDetailsAbout}
                                />
                                <Stack.Screen
                                    name="FoodDetailsOffers"
                                    component={FoodDetailsOffers}
                                />
                                <Stack.Screen
                                    name="FoodDetailsAddItem"
                                    component={FoodDetailsAddItem}
                                />
                                <Stack.Screen
                                    name="CheckoutOrders"
                                    component={CheckoutOrders}
                                />

                                <Stack.Screen
                                    name="CheckoutOrdersAddress"
                                    component={CheckoutOrdersAddress}
                                />
                                <Stack.Screen
                                    name="SearchingDriver"
                                    component={SearchingDriver}
                                />
                                <Stack.Screen
                                    name="CheckoutOrdersCompleted"
                                    component={CheckoutOrdersCompleted}
                                />
                                <Stack.Screen
                                    name="TrackDriver"
                                    component={TrackDriver}
                                />
                                <Stack.Screen
                                    name="DriverDetails"
                                    component={DriverDetails}
                                />
                                <Stack.Screen
                                    name="VoiceCall"
                                    component={VoiceCall}
                                />
                                <Stack.Screen
                                    name="VideoCall"
                                    component={VideoCall}
                                />
                                <Stack.Screen
                                    name="WhatsYourMood"
                                    component={WhatsYourMood}
                                />
                                <Stack.Screen
                                    name="RateTheDriver"
                                    component={RateTheDriver}
                                />
                                <Stack.Screen
                                    name="GiveTipForDriver"
                                    component={GiveTipForDriver}
                                />
                                <Stack.Screen
                                    name="RateTheRestaurant"
                                    component={RateTheRestaurant}
                                />
                                <Stack.Screen
                                    name="MyCart"
                                    component={MyCart}
                                />
                            </Stack.Group>
                        </>
                    )}
                </>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation
