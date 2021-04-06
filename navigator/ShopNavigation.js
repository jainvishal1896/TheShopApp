import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
	createDrawerNavigator,
	DrawerItemList,
} from "@react-navigation/drawer";
import { useDispatch } from "react-redux";

import Color from "../constants/Colors";
import StartupScreen from "../screens/StartupScreen";
import UserProductsScreen, {
	UserProductScreenOptions,
} from "../screens/user/UserProductsScreen";
import ProductOverviewScreen, {
	screenOptionsOverviewScreen,
} from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen, {
	screenOptionsDetailsScreeen,
} from "../screens/shop/ProductDetailScreen";
import CartScreen, {
	screenOptionsCartScreen,
} from "../screens/shop/CartScreen";
import OrderScreen, { OrderScreenOptions } from "../screens/shop/OrderScreen";
import EditProductScreen, {
	EditProductScreenOptions,
} from "../screens/user/EditProductScreen";
import * as authActions from "../store/actions/auth";
import AuthScreen from "../components/AuthScreen";
import { Ionicons } from "@expo/vector-icons";
import { Button, SafeAreaView, View } from "react-native";

const defaultNavOptions = {
	headerStyle: {
		backgroundColor: Color.primary,
	},
	headerTintColor: "white",
};

const ProductStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
	return (
		<ProductStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<ProductStackNavigator.Screen
				name="productOverview"
				component={ProductOverviewScreen}
				options={screenOptionsOverviewScreen}
			/>
			<ProductStackNavigator.Screen
				name="productDetail"
				component={ProductDetailScreen}
				options={screenOptionsDetailsScreeen}
			/>
			<ProductStackNavigator.Screen
				name="Cart"
				component={CartScreen}
				options={screenOptionsCartScreen}
			/>
		</ProductStackNavigator.Navigator>
	);
};

// const ProductNavigator = createStackNavigator(
// 	{
// 		productOverview: ProductOverviewScreen,
// 		productDetail: ProductDetailScreen,
// 		Cart: CartScreen,
// 	},
// 	{
// 		navigationOptions: {
// 			drawerIcon: (drawerConfig) => (
// 				<Ionicons name="md-cart" color={drawerConfig.tintColor} size={23} />
// 			),
// 		},
// 		defaultNavigationOptions: defaultNavOptions,
// 	}
// );

const UserStackNavigator = createStackNavigator();

export const UserNavigator = () => {
	return (
		<UserStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<UserStackNavigator.Screen
				name="UserProduct"
				component={UserProductsScreen}
				options={UserProductScreenOptions}
			/>
			<UserStackNavigator.Screen
				name="EditProduct"
				component={EditProductScreen}
				options={EditProductScreenOptions}
			/>
		</UserStackNavigator.Navigator>
	);
};

// const UserNavigator = createStackNavigator(
// 	{
// 		UserProduct: UserProductsScreen,
// 		EditProduct: EditProductScreen,
// 	},
// 	{
// 		navigationOptions: {
// 			drawerIcon: (drawerConfig) => (
// 				<Ionicons name="md-create" color={drawerConfig.tintColor} size={23} />
// 			),
// 		},
// 		defaultNavigationOptions: defaultNavOptions,
// 	}
// );

const OrderStackNavigator = createStackNavigator();

export const OrderNavigator = () => {
	return (
		<OrderStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<OrderStackNavigator.Screen
				name="orders"
				component={OrderScreen}
				options={OrderScreenOptions}
			/>
		</OrderStackNavigator.Navigator>
	);
};

// const OrderNavigator = createStackNavigator(
// 	{
// 		orders: OrderScreen,
// 	},
// 	{
// 		navigationOptions: {
// 			drawerIcon: (drawerConfig) => (
// 				<Ionicons name="md-list" color={drawerConfig.tintColor} size={23} />
// 			),
// 		},
// 		defaultNavigationOptions: defaultNavOptions,
// 	}
// );

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
	const dispatch = useDispatch();
	return (
		<ShopDrawerNavigator.Navigator
			drawerContent={(props) => {
				return (
					<View style={{ flex: 1, paddingTop: 30, margin: 20 }}>
						<SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
							<DrawerItemList {...props} />
							<Button
								title="Logout"
								color={Color.primary}
								onPress={() => {
									dispatch(authActions.logout());
								}}
							/>
						</SafeAreaView>
					</View>
				);
			}}
			drawerContentOptions={{
				activeTintColor: Color.primary,
			}}
		>
			<ShopDrawerNavigator.Screen
				name="Products"
				component={ProductsNavigator}
				options={{
					drawerIcon: (props) => (
						<Ionicons name="md-cart" color={props.color} size={23} />
					),
				}}
			/>
			<ShopDrawerNavigator.Screen
				name="Orders"
				component={OrderNavigator}
				options={{
					drawerIcon: (props) => (
						<Ionicons name="md-list" color={props.color} size={23} />
					),
				}}
			/>
			<ShopDrawerNavigator.Screen
				name="User"
				component={UserNavigator}
				options={{
					drawerIcon: (props) => (
						<Ionicons name="md-create" color={props.color} size={23} />
					),
				}}
			/>
		</ShopDrawerNavigator.Navigator>
	);
};

// const ShopNavigator = createDrawerNavigator(
// 	{
// 		Products: ProductNavigator,
// 		Orders: OrderNavigator,
// 		User: UserNavigator,
// 	},
// 	{
// 		contentOptions: {
// 			activeTintColor: Color.primary,
// 		},
// 		contentComponent: (props) => {
// 			const dispatch = useDispatch();
// 			return (
// 				<View style={{ flex: 1, paddingTop: 30, margin: 20 }}>
// 					<SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
// 						<DrawerItems {...props} />
// 						<Button
// 							title="Logout"
// 							color={Color.primary}
// 							onPress={() => {
// 								dispatch(authActions.logout());
// 							}}
// 						/>
// 					</SafeAreaView>
// 				</View>
// 			);
// 		},
// 	}
// );

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
	return (
		<AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
			<AuthStackNavigator.Screen name="Authentication" component={AuthScreen} />
		</AuthStackNavigator.Navigator>
	);
};

// const AuthNavigator = createStackNavigator(
// 	{
// 		Authentication: AuthScreen,
// 	},
// 	{ defaultNavigationOptions: defaultNavOptions }
// );

// const MainNavigator = createSwitchNavigator({
// 	Startup: StartupScreen,
// 	Auth: AuthNavigator,
// 	Shop: ShopNavigator,
// });

// export default createAppContainer(MainNavigator);
