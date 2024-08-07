import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
    CancelledOrders,
    CompletedOrders,
    InProgressOrders,
    NewOrders,
    ReadyOrders,
} from '../../tabs';

const TabView = () => {
    const [key, setKey] = React.useState('first');
    const [routes] = React.useState([
        { key: 'first', title: 'New' },
        { key: 'second', title: 'In Progress' },
        { key: 'third', title: 'Ready' },
        { key: 'fourth', title: 'Completed' },
        { key: 'fifth', title: 'Cancelled' },
    ]);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {routes?.map((item) => {
                    const isActive = item?.key === key;
                    return (
                        <TouchableOpacity
                            key={item.key}
                            style={[styles.tab, isActive && styles.activeTab]}
                            onPress={() => setKey(item?.key)}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {item?.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <ScrollView style={styles.contentContainer}>
                {key == 'first' && <NewOrders />}
                {key == 'second' && <InProgressOrders />}
                {key == 'third' && <ReadyOrders />}
                {key == 'fourth' && <CancelledOrders />}
                {key == 'fifth' && <CancelledOrders />}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 5,
    },
    tab: {
        paddingVertical: 5,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'red',
    },
    tabText: {
        fontSize: 16,
        color: 'black',
    },
    activeTabText: {
        color: 'red',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
    },
});

export default TabView;

