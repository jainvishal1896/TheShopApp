import React from "react";
import { StyleSheet, LogBox } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import ReduxThunk from "redux-thunk";
import * as Notifications from "expo-notifications";

import CartReducer from "./store/reducers/cart";
import AuthReducer from "./store/reducers/auth";
import ProductsReducer from "./store/reducers/products";
import OrdersReducer from "./store/reducers/orders";
import AppNavigator from "./navigator/AppNavigator";

Notifications.setNotificationHandler({
	handleNotification: async () => {
		return {
			shouldShowAlert: true,
		};
	},
});

export default App = () => {
	const [fontLoaded] = useFonts({
		"open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
		"open-sans-reg": require("./assets/fonts/OpenSans-Regular.ttf"),
	});

	if (!fontLoaded) {
		return <AppLoading />;
	}

	const rootReducer = combineReducers({
		products: ProductsReducer,
		cart: CartReducer,
		orders: OrdersReducer,
		auth: AuthReducer,
	});
	const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
	LogBox.ignoreLogs([
		"Your project is accessing the following APIs from a deprecated global rather than a module import: Constants (expo-constants).",
	]);
	return (
		<Provider store={store}>
			<AppNavigator />
		</Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
