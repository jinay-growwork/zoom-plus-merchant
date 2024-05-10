import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import Rating from '../components/Rating';
import Button from '../components/Button';

const RateTheRestaurant = ({ navigation }) => {
  const { dark, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Image
              source={images.pizza1}
              resizeMode='contain'
              style={styles.avatar}
            />
            <Text style={[styles.rateName, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>How was the delivery of your order from Big Garden Salad?</Text>
            <Text style={[styles.rateText, {
              color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
            }]}>
              Enjoyed your food ? Rate the restaurant, your feedback is matters.
            </Text>
            <Rating color="orange" size={40} />
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <TextInput
              placeholder='This food is very tasty and in good condition. I like it very much😍😍'
              placeholderTextColor={dark ? COLORS.white : COLORS.black}
              style={[styles.input, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                borderColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                color: dark ? COLORS.secondaryWhite : COLORS.black
              }]}
              multiline
            />
            <Text style={[styles.viewSubtitle, {
              color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
            }]}>
              Haven't received your order ?
            </Text>
            <TouchableOpacity>
              <Text style={styles.driverName}>
                Call your driver?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={[styles.bottomContainer, {
        backgroundColor: dark ? COLORS.dark1 : COLORS.white
      }]}>
        <Button
          title="Cancel"
          style={styles.cancelBtn}
        />
        <Button
          title="Submit"
          filled
          style={styles.submitBtn}
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </SafeAreaView>
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
  contentContainer: {
    alignItems: "center",
  },
  avatar: {
    height: 132,
    width: 132,
    borderRadius: 32,
    marginVertical: 12
  },
  rateName: {
    fontSize: 30,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  rateText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  viewSubtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 12
  },
  driverName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: 112,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36
  },
  cancelBtn: {
    width: (SIZES.width - 48) / 2,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  submitBtn: {
    width: (SIZES.width - 48) / 2,
  },
  input: {
    height: 84,
    width: SIZES.width - 48,
    backgroundColor: COLORS.tertiaryWhite,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    marginVertical: 12
  }
})

export default RateTheRestaurant