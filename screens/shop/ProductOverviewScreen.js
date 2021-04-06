import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	FlatList,
	Button,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import HeaderButton from "../../components/UI/HeaderButton";
import * as cartActions from "../../store/actions/cart";
import * as prodActions from "../../store/actions/products";
import Colors from "../../constants/Colors";

const ProductOverviewScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState();

	const dispatch = useDispatch();
	const productsData = useSelector((state) => state.products.availableProducts);

	const loadProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(prodActions.fetchProducts());
		} catch (err) {
			setError(err.message);
		}
		setIsRefreshing(false);
	}, [dispatch, setError, setIsLoading]);

	useEffect(() => {
		setIsLoading(true);
		loadProducts().then(() => {
			setIsLoading(false);
		});
	}, [dispatch]);

	useEffect(() => {
		const unsubscribe = props.navigation.addListener("focus", loadProducts);
		return () => {
			unsubscribe();
		};
	}, [loadProducts]);

	const selectHandler = (id) => {
		props.navigation.navigate("productDetail", {
			prodId: id,
		});
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>An Error Occured</Text>
				<Button
					title="Try Again"
					color={Colors.primary}
					onPress={loadProducts}
				/>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size={20} color={Colors.primary} />
			</View>
		);
	}
	if (!isLoading && productsData.length === 0) {
		return (
			<View style={styles.centered}>
				<Text>No products has been found, Start Adding some products.</Text>
			</View>
		);
	}

	return (
		<FlatList
			onRefresh={loadProducts}
			refreshing={isRefreshing}
			data={productsData}
			keyExtractor={(item) => item.id}
			renderItem={(itemdata) => (
				<ProductItem
					title={itemdata.item.title}
					price={itemdata.item.price}
					uri={itemdata.item.imageUrl}
					onSelect={() => {
						selectHandler(itemdata.item.id);
					}}
				>
					<Button
						title="Details"
						color={Colors.primary}
						onPress={() => {
							selectHandler(itemdata.item.id);
						}}
					/>
					<Button
						title="Add To Cart"
						color={Colors.primary}
						onPress={() => {
							dispatch(cartActions.AddToCart(itemdata.item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const screenOptionsOverviewScreen = (navData) => {
	return {
		headerTitle: "All Products",
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
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Cart"
					iconName="md-cart"
					onPress={() => {
						navData.navigation.navigate("Cart");
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

export default ProductOverviewScreen;
