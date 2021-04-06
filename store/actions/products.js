import Product from "../../models/products";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

export const DELETE_ITEM = "DELETE_ITEM";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCT = "SET_PRODUCT";

export const fetchProducts = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;
		try {
			const response = await fetch(
				"https://rn-theshopapp-22381-default-rtdb.firebaseio.com/products.json"
			);

			if (!response.ok) {
				throw new Error("Something went wrong."); // ths error is URL breakdown.
			}

			const resData = await response.json();
			const loadedProduct = [];
			for (const key in resData) {
				loadedProduct.push(
					new Product(
						key,
						resData[key].ownerId,
						resData[key].ownerPushToken,
						resData[key].title,
						resData[key].image,
						resData[key].description,
						resData[key].price
					)
				);
			}
			dispatch({
				type: SET_PRODUCT,
				products: loadedProduct,
				userProducts: loadedProduct.filter((prod) => prod.ownerId === userId),
			});
		} catch (err) {
			throw err; // this error is for not being able to fetch data.
		}
	};
};

export const deleteItem = (productId) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const response = await fetch(
			`https://rn-theshopapp-22381-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
			{
				method: "DELETE",
			}
		);
		if (!response.ok) {
			throw new Error("Something went wrong."); // ths error is URL breakdown.
		}
		dispatch({ type: DELETE_ITEM, pid: productId });
	};
};

export const createProduct = (title, image, price, description) => {
	return async (dispatch, getState) => {
		let pushToken;
		let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		if (statusObj.status !== "granted") {
			statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		}
		if (statusObj.status !== "granted") {
			pushToken = null;
		} else {
			pushToken = (await Notifications.getExpoPushTokenAsync()).data;
		}

		const token = getState().auth.token;
		const userId = getState().auth.userId;
		const response = await fetch(
			`https://rn-theshopapp-22381-default-rtdb.firebaseio.com/products.json?auth=${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					image,
					price,
					description,
					ownerId: userId,
					ownerPushToken: pushToken,
				}),
			}
		);
		const resData = await response.json();
		dispatch({
			type: CREATE_PRODUCT,
			productData: {
				id: resData.name,
				title,
				image,
				price,
				description,
				ownerId: userId,
				pushToken: pushToken,
			},
		});
	};
};
export const updateProduct = (id, title, image, description) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const response = await fetch(
			`https://rn-theshopapp-22381-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					image,
					description,
				}),
			}
		);
		if (!response.ok) {
			throw new Error("Something went wrong."); // ths error is URL breakdown.
		}
		dispatch({
			type: UPDATE_PRODUCT,
			pid: id,
			productData: {
				title,
				image,
				description,
			},
		});
	};
};
