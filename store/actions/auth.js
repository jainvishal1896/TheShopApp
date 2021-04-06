import AsyncStorage from "@react-native-community/async-storage";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

let timer;

export const setDidTryAL = () => {
	return { type: SET_DID_TRY_AL };
};

export const authenticate = (token, userId, expiryTime) => {
	return (dispatch) => {
		dispatch(setLogoutTimer(expiryTime));
		dispatch({ type: AUTHENTICATE, token: token, userId: userId });
	};
};

export const signup = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCQWnl5XB0M7fWtI7ixR02_WcuolwNJTDQ",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);
		if (!response.ok) {
			const errorResData = await response.json();
			const errorMessage = errorResData.error.message;
			let errMessage = "Something went wrong";
			if (errorMessage === "EMAIL_EXISTS") {
				errMessage = "The Email already exists.";
			} else if (errorMessage === "OPERATION_NOT_ALLOWED") {
				errMessage = "Password sign-in is disabled for this project.";
			}
			throw new Error(errMessage);
		}
		const resData = await response.json();
		dispatch(
			authenticate(
				resData.idToken,
				resData.localId,
				parseInt(resData.expiresIn) * 1000
			)
		);
		const expirationDate = new Date(
			new Date().getTime() + parseInt(resData.expiresIn) * 1000
		);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
};

export const login = (email, password) => {
	return async (dispatch) => {
		const response = await fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCQWnl5XB0M7fWtI7ixR02_WcuolwNJTDQ",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
					returnSecureToken: true,
				}),
			}
		);
		if (!response.ok) {
			const errorResData = await response.json();
			const errorMessage = errorResData.error.message;
			let errMessage = "Something went wrong";
			if (errorMessage === "EMAIL_NOT_FOUND") {
				errMessage = "The Email is not registered.";
			} else if (errorMessage === "INVALID_PASSWORD") {
				errMessage = "Password is Invalid.";
			} else if (errorMessage === "USER_DISABLED") {
				errMessage = "User is disabled";
			}
			throw new Error(errMessage);
		}
		const resData = await response.json();
		console.log(resData);
		dispatch(
			authenticate(
				resData.idToken,
				resData.localId,
				parseInt(resData.expiresIn) * 1000
			)
		);
		const expirationDate = new Date(
			new Date().getTime() + parseInt(resData.expiresIn) * 1000
		);
		saveDataToStorage(resData.idToken, resData.localId, expirationDate);
	};
};

export const logout = () => {
	clearLogoutTimer();
	AsyncStorage.removeItem("userData");
	return { type: LOGOUT };
};

const clearLogoutTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
};

const setLogoutTimer = (expirationTime) => {
	return (dispatch) => {
		timer = setTimeout(() => {
			dispatch(logout());
		}, expirationTime);
	};
};

const saveDataToStorage = (token, userId, expirationDate) => {
	AsyncStorage.setItem(
		"userData",
		JSON.stringify({
			token: token,
			userId: userId,
			expiryDate: expirationDate,
		})
	);
};
