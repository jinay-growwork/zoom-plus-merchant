import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { pizzaFoods } from '../data';
import HorizontalFoodCard from '../components/HorizontalFoodCard';

// render category pizza
const CategoryPizza = ({ navigation }) => {
  const { colors, dark } = useTheme();

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Pizza" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
            marginVertical: 16
          }}>
            <FlatList
              data={pizzaFoods}
              keyExtractor={item => item.id}
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
                    onPress={() => navigation.navigate("FoodDetails")}
                  />
                )
              }}
            />
          </View>
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
  }
})

export default CategoryPizza