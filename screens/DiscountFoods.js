import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { discountFoods } from '../data';
import VerticalFoodCard from '../components/VerticalFoodCard';
import { useTheme } from '../theme/ThemeProvider';

const DiscountFoods = () => {
  const { colors, dark } = useTheme();
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Discount guaranteed!👌" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          <FlatList
            data={discountFoods}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
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
                  onPress={() => navigation.navigate("FoodDetails")}
                />
              )
            }}
          />
        </ScrollView>
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
  scrollView: {
    marginVertical: 16
  }
})

export default DiscountFoods