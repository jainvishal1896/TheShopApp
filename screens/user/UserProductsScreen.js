import React from "react";
import { FlatList, Button, Alert } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as productActions from "../../store/actions/products";
import Colors from "../../constants/Colors";

const UserProductsScreen = (props) => {
	const UserProducts = useSelector((state) => state.products.userProducts);
	const dispatch = useDispatch();

	const editProductHandler = (id) => {
		props.navigation.navigate("EditProduct", { productId: id });
	};

	const deleteHandler = (id) => {
		Alert.alert("Delete Product", "Are you sure you want to delete?", [
			{
				text: "No",
				style: "default",
			},
			{
				text: "Yes",
				style: "destructive",
				onPress: () => {
					dispatch(productActions.deleteItem(id));
				},
			},
		]);
	};

	return (
		<FlatList
			data={UserProducts}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					uri={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						editProductHandler(itemData.item.id);
					}}
				>
					<Button
						title="Edit"
						color={Colors.primary}
						onPress={() => {
							editProductHandler(itemData.item.id);
						}}
					/>
					<Button
						title="Delete"
						color={Colors.primary}
						onPress={() => {
							deleteHandler(itemData.item.id);
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

export const UserProductScreenOptions = (navData) => {
	return {
		headerTitle: "User Products",
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
					title="ADD"
					iconName="md-add"
					onPress={() => {
						navData.navigation.navigate("EditProduct");
					}}
				/>
			</HeaderButtons>
		),
	};
};

export default UserProductsScreen;
