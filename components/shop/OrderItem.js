import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import Colors from "../../constants/Colors";
import CartItem from "./CartItem";

const OrderItem = (props) => {
	const [showDetails, setShowDetails] = useState(false);
	return (
		<View style={styles.MainContainer}>
			<View style={styles.summary}>
				<Text style={styles.totalAmount}>{props.amount.toFixed(2)}</Text>
				<Text style={styles.date}>{props.date}</Text>
			</View>
			<Button
				title={showDetails ? "Hide Details" : "Show Details"}
				color={Colors.primary}
				onPress={() => setShowDetails((prevState) => !prevState)}
			/>
			{showDetails && (
				<View styles={styles.ViewDetails}>
					{props.items.map((cartItem) => (
						<CartItem
							key={cartItem.productId}
							quantity={cartItem.quantity}
							title={cartItem.prodTitle}
							amount={cartItem.sum}
						/>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	MainContainer: {
		elevation: 5,
		//borderWidth: 1,
		borderRadius: 10,
		backgroundColor: "white",
		padding: 10,
		margin: 20,
		alignItems: "center",
	},
	summary: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: "100%",
		marginBottom: 15,
	},
	totalAmount: {
		fontFamily: "open-sans-bold",
		fontSize: 16,
	},
	date: {
		fontSize: 16,
		fontFamily: "open-sans-reg",
		color: "#888",
	},
	ViewDetails: {
		width: "100%",
	},
});

export default OrderItem;
