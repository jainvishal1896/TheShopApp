import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	Button,
	ScrollView,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";

import * as cartActions from "../../store/actions/cart";

const ProductDetailScreen = (props) => {
	const prodId = props.route.params ? props.route.params.prodId : null;
	const selectedProduct = useSelector((state) =>
		state.products.availableProducts.find((item) => item.id === prodId)
	);

	const dispatch = useDispatch();
	return (
		<ScrollView style={{ backgroundColor: "white" }}>
			<View style={styles.imgContainer}>
				<Image
					style={styles.image}
					source={{ uri: selectedProduct.imageUrl }}
				/>
			</View>
			<View style={styles.btnContainer}>
				<Button
					color="tomato"
					style={styles.btn}
					title="Add to Cart"
					onPress={() => {
						dispatch(cartActions.AddToCart(selectedProduct));
					}}
				/>
			</View>
			<View style={styles.txtContainer}>
				<Text style={styles.price}>$ {selectedProduct.price.toFixed(2)}</Text>
				<Text numberOfLines={2} style={styles.desc}>
					{selectedProduct.description}
				</Text>
			</View>
		</ScrollView>
	);
};

export const screenOptionsDetailsScreeen = (navData) => {
	return {
		headerTitle: "Product Details",
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
	imgContainer: {
		width: "100%",
		height: 300,
		elevation: 8,
		borderRadius: 10,
		borderWidth: 1,
		overflow: "hidden",
	},
	btnContainer: {
		alignItems: "center",
		marginVertical: 15,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	txtContainer: {
		alignItems: "center",
		margin: 5,
		padding: 10,
	},
	price: {
		fontSize: 20,
		marginBottom: 10,
	},

	desc: { fontSize: 20, textAlign: "center" },
});

export default ProductDetailScreen;
