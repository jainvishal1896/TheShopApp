import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { ShopNavigator, AuthNavigator } from "./ShopNavigation";
import StartupScreen from "../screens/StartupScreen";

const AppNavigator = (props) => {
	// const navRef = useRef();
	const isAuth = useSelector((state) => !!state.auth.token);
	const didTryAutoLogin = useSelector((state) => !!state.auth.didTryAutoLogin);

	// useEffect(() => {
	// 	if (!isAuth) {
	// 		navRef.current.dispatch(
	// 			NavigationActions.navigate({ routeName: "Auth" })
	// 		);
	// 	}
	// }, [isAuth]);
	return (
		<NavigationContainer>
			{isAuth && <ShopNavigator />}
			{!isAuth && didTryAutoLogin && <AuthNavigator />}
			{!isAuth && !didTryAutoLogin && <StartupScreen />}
		</NavigationContainer>
	);
	// return <ShopNavigation ref={navRef} />;
};

export default AppNavigator;
