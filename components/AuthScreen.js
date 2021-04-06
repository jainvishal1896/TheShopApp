import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
	View,
	StyleSheet,
	Button,
	ScrollView,
	KeyboardAvoidingView,
	Alert,
	ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../components/UI/Input";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

export const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
	switch (action.type) {
		case FORM_INPUT_UPDATE:
			const updatedValues = {
				...state.inputValues,
				[action.input]: action.value,
			};
			const updatedValidities = {
				...state.inputValidities,
				[action.input]: action.isValid,
			};
			let UpdatedFormisValid = true;
			for (const key in updatedValidities) {
				UpdatedFormisValid = UpdatedFormisValid && updatedValidities[key];
			}
			return {
				inputValues: updatedValues,
				inputValidities: updatedValidities,
				formIsValid: UpdatedFormisValid,
			};
	}
	return state;
};

const AuthScreen = (props) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const [isSignUp, setIsSignUp] = useState(false);
	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: "",
			password: "",
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});

	const inputChangeHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	const AuthHandler = async () => {
		let action;
		if (isSignUp) {
			action = authActions.signup(
				formState.inputValues.email,
				formState.inputValues.password
			);
		} else {
			action = authActions.login(
				formState.inputValues.email,
				formState.inputValues.password
			);
		}
		setError(null);
		setIsLoading(true);
		try {
			await dispatch(action);
			//props.navigation.navigate("Shop");
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (error) {
			Alert.alert("You got ERROR", error, [
				{
					text: "Okay",
					style: "destructive",
				},
			]);
		}
	}, [error]);
	return (
		<KeyboardAvoidingView style={styles.screen}>
			<LinearGradient colors={["#e5a88b", "white"]} style={styles.gradient}>
				<View style={styles.card}>
					<ScrollView>
						<Input
							id="email"
							label="E-mail"
							onInputChange={inputChangeHandler}
							initialValue=""
							initialValidity={false}
							keyboardType="email-address"
							autoCapitalize="none"
							returnKeyType="next"
							errorText="Please enter a valid Email"
							required
							email
						/>
						<Input
							id="password"
							label="Password"
							onInputChange={inputChangeHandler}
							initialValue=""
							secureTextEntry
							required
							minLength={5}
							autoCapitalize="none"
							returnKeyType="next"
							errorText="Please enter a valid Password"
						/>
						{isLoading ? (
							<ActivityIndicator size="small" color={Colors.primary} />
						) : (
							<Button
								title={isSignUp ? "Sign Up" : "Login"}
								color={Colors.primary}
								onPress={AuthHandler}
							/>
						)}
						<Button
							title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
							color={Colors.accent}
							onPress={() => {
								setIsSignUp((prevState) => !prevState);
							}}
						/>
					</ScrollView>
				</View>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
	card: {
		elevation: 5,
		backgroundColor: "white",
		overflow: "hidden",
		borderRadius: 20,
		width: "80%",
		maxWidth: 400,
		maxHeight: 400,
		padding: 20,
	},
});

export default AuthScreen;
