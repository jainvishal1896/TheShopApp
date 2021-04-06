import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
	View,
	ScrollView,
	StyleSheet,
	Alert,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import HeaderButton from "../../components/UI/HeaderButton";
import * as prodActions from "../../store/actions/products";

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

const EditProductScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const prodId = props.route.params ? props.route.params.productId : null;
	const editProduct = useSelector((state) =>
		state.products.userProducts.find((prod) => prod.id === prodId)
	);

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editProduct ? editProduct.title : "",
			image: editProduct ? editProduct.imageUrl : "",
			price: "",
			description: editProduct ? editProduct.description : "",
		},
		inputValidities: {
			title: editProduct ? true : false,
			image: editProduct ? true : false,
			price: editProduct ? true : false,
			description: editProduct ? true : false,
		},
		formIsValid: editProduct ? true : false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("You got error", error, [
				{ text: "Okay", style: "destructive" },
			]);
		}
	}, [error]);

	const dispatch = useDispatch();

	const submitHandler = useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert("Wrong input!", "Please check the errors in the form.", [
				{ text: "Okay" },
			]);
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			if (editProduct) {
				await dispatch(
					prodActions.updateProduct(
						prodId,
						formState.inputValues.title,
						formState.inputValues.image,
						formState.inputValues.description
					)
				);
			} else {
				await dispatch(
					prodActions.createProduct(
						formState.inputValues.title,
						formState.inputValues.image,
						+formState.inputValues.price,
						formState.inputValues.description
					)
				);
			}
			props.navigation.goBack();
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
	}, [dispatch, prodId, formState]);

	useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item title="Save" iconName="md-checkmark" onPress={submitHandler} />
				</HeaderButtons>
			),
		});
	}, [submitHandler]);

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

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			//style={{ flex: 1 }}
			//behavior="padding"
			keyboardVerticalOffset={100}
		>
			<ScrollView>
				<View style={styles.MainContainer}>
					<Input
						id="title"
						label="title"
						onInputChange={inputChangeHandler}
						initialValue={editProduct ? editProduct.title : ""}
						initialValidity={!!editProduct}
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						errorText="Please enter a valid title"
						required
					/>

					<Input
						id="image"
						label="image"
						onInputChange={inputChangeHandler}
						initialValue={editProduct ? editProduct.imageUrl : ""}
						initialValidity={!!editProduct}
						keyboardType="default"
						returnKeyType="next"
						errorText="Please enter a valid image"
						required
					/>

					{editProduct ? null : (
						<Input
							id="price"
							label="price"
							onInputChange={inputChangeHandler}
							keyboardType="decimal-pad"
							returnKeyType="next"
							errorText="Please enter a valid Price"
							required
							min={0.1}
						/>
					)}

					<Input
						id="description"
						label="description"
						onInputChange={inputChangeHandler}
						initialValue={editProduct ? editProduct.description : ""}
						initialValidity={!!editProduct}
						required
						minLength={5}
						errorText="Please enter a valid description."
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						numberOfLines={3}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	MainContainer: {
		margin: 20,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export const EditProductScreenOptions = (navData) => {
	const routeParams = navData.route.params ? navData.route.params : {};
	return {
		headerTitle: routeParams.productId ? "Edit Product" : "Add Product",
	};
};

export default EditProductScreen;
