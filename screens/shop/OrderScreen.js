import React, { useEffect, useState, useCallback } from "react";
import {
	FlatList,
	ActivityIndicator,
	StyleSheet,
	View,
	Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";
import OrderItem from "../../components/shop/OrderItem";
import HeaderButton from "../../components/UI/HeaderButton";

const OrderScreen = (props) => {
	const [error, setError] = useState();
	const [isLoading, SetIsLoading] = useState(false);
	const orderList = useSelector((state) => state.orders.orders);
	const dispatch = useDispatch();

	const fetchOrder = useCallback(async () => {
		setError(null);
		SetIsLoading(true);
		try {
			await dispatch(orderActions.fetchOrders());
		} catch (err) {
			setError(err.message);
		}
		SetIsLoading(false);
	}, [dispatch, setError, SetIsLoading]);

	useEffect(() => {
		fetchOrder();
	}, [dispatch]);

	useEffect(() => {
		const unsubscribe = props.navigation.addListener("focus", fetchOrder);
		return () => {
			unsubscribe();
		};
	}, [fetchOrder]);

	useEffect(() => {
		if (error) {
			Alert.alert("You got Error", error, [
				{ text: "Okay", style: "destructive" },
			]);
		}
	}, [error]);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<FlatList
			data={orderList}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<OrderItem
					amount={itemData.item.totalAmount}
					date={itemData.item.readableDate}
					items={itemData.item.items}
				/>
			)}
		/>
	);
};

export const OrderScreenOptions = (navData) => {
	return {
		headerTitle: "Your Orders",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Menu"
					iconName="md-menu"
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default OrderScreen;
