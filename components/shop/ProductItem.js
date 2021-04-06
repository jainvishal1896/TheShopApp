import React from "react";
import {
	View,
	Image,
	Text,
	Button,
	StyleSheet,
	TouchableNativeFeedback,
} from "react-native";
import Colors from "../../constants/Colors";

const ProductItem = (props) => {
	return (
		<View style={styles.card}>
			<TouchableNativeFeedback useForeground onPress={props.onSelect}>
				<View>
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={{ uri: props.uri }} />
					</View>
					<View style={styles.txtContainer}>
						<Text style={styles.title}>{props.title}</Text>
						<Text style={styles.price}> $ {props.price}</Text>
					</View>
					<View style={styles.btnContainer}>{props.children}</View>
				</View>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	imageContainer: {
		width: "100%",
		height: "60%",
		overflow: "hidden",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	card: {
		margin: 20,
		height: 300,
		elevation: 5,
		borderRadius: 10,
		backgroundColor: "white",
		overflow: "hidden",
	},
	txtContainer: {
		alignItems: "center",
		height: "15%",
		padding: 10,
		//borderWidth: 1,
	},
	title: {
		fontSize: 18,
		marginVertical: 4,
	},
	price: {
		fontSize: 14,
		color: "#888",
	},
	btnContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 5,
		alignItems: "center",
		height: "25%",
		paddingHorizontal: 20,
	},
});

export default ProductItem;
