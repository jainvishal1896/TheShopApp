import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CartItem = (props) => {
	return (
		<View style={styles.MainContainer}>
			<View style={styles.textContainer}>
				<Text style={styles.quantity}>{props.quantity} </Text>
				<Text style={styles.title} numberOfLines={2}>
					{"   "}
					{props.title}
				</Text>
			</View>
			<View style={styles.amountContainer}>
				<View style={styles.itemContainer}>
					<Text style={styles.styledAmount}>
						{props.amount.toFixed(2)}
					</Text>
				</View>
				{props.deletable && (
					<TouchableOpacity
						onPress={props.onRemove}
						style={styles.deleteButton}
					>
						<Ionicons name="md-trash" size={20} color="red" />
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	MainContainer: {
		padding: 10,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 10,
		width: "100%",
	},
	textContainer: {
		flexDirection: "row",
		alignItems: "center",
		flexShrink: 1,
		width: "50%",
	},
	itemContainer: {
		width: "50%",
		alignItems: "center",
		paddingTop: 5,
	},
	quantity: {
		fontSize: 20,
	},
	title: {
		fontSize: 20,
		padding: 5,
		margin: 5,
	},
	amountContainer: {
		flexDirection: "row",
		margin: 5,
		width: "50%",
		justifyContent: "space-around",
	},
	styledAmount: {
		fontSize: 20,
	},
	deleteButton: {
		margin: 3,
	},
});

export default CartItem;
