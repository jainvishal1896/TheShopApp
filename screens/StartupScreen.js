import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch } from "react-redux";

import * as authActions from "../store/actions/auth";
import Colors from "../constants/Colors";

const StartupScreen = (props) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem("userData");
			if (!userData) {
				// props.navigation.navigate("Auth");
				dispatch(authActions.setDidTryAL());
				return;
			}
			const transformedData = JSON.parse(userData);
			const { token, userId, expiryDate } = transformedData;
			const expirationDate = new Date(expiryDate);
			if (expirationDate <= new Date() || !token || !userId) {
				// props.navigation.navigate("Auth");
				dispatch(authActions.setDidTryAL());
				return;
			}
			// props.navigation.navigate("Shop");

			const expirationTime = expirationDate.getTime() - new Date().getTime();
			await dispatch(authActions.authenticate(token, userId, expirationTime));
		};
		tryLogin();
	}, [dispatch]);
	return (
		<View>
			<ActivityIndicator size="large" color={Colors.primary} />
		</View>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default StartupScreen;
