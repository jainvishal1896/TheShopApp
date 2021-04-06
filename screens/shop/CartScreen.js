import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Button,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as orderActions from "../../store/actions/orders";
import Color from "../../constants/Colors";

const CartScreen = (props) => {
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const cartItem = useSelector((state) => {
		const transformedCartItems = [];
		for (const key in state.cart.items) {
			transformedCartItems.push({
				productId: key,
				prodTitle: state.cart.items[key].prodTitle,
				prodPrice: state.cart.items[key].prodPrice,
				quantity: state.cart.items[key].quantity,
				sum: state.cart.items[key].sum,
				productPushToken: state.cart.items[key].pushToken,
			});
		}
		return transformedCartItems.sort((a, b) =>
			a.productId > b.productId ? 1 : -1
		);
	});
	const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

	useEffect(() => {
		if (error) {
			Alert.alert("You got Error", error, [
				{ text: "Okay", style: "destructive" },
			]);
		}
	}, [error]);

	const sendOrders = async () => {
		setError(null);
		setIsLoading(true);
		try {
			await dispatch(orderActions.addOrder(cartItem, cartTotalAmount));
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
	};

	return (
		<View style={styles.screen}>
			<View style={styles.summary}>
				<Text style={styles.amount}>
					$ {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
				</Text>
				{isLoading ? (
					<ActivityIndicator size={20} color={Color.primary} />
				) : (
					<Button
						title="ORDER"
						color={Color.primary}
						disabled={cartItem.length === 0}
						onPress={sendOrders}
					/>
				)}
			</View>
			<FlatList
				keyExtractor={(item) => item.productId}
				data={cartItem}
				renderItem={(itemData) => (
					<CartItem
						quantity={itemData.item.quantity}
						title={itemData.item.prodTitle}
						amount={itemData.item.sum}
						deletable
						onRemove={() => {
							dispatch(cartActions.deleteFromCart(itemData.item.productId));
						}}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		margin: 20,
	},
	summary: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		padding: 10,
		shadowColor: "black",
		shadowOpacity: 0.26,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: "white",
	},
	amount: {
		color: Color.primary,
		fontSize: 23,
	},
});

export const screenOptionsCartScreen = {
	headerTitle: "Your Cart",
};

export default CartScreen;
