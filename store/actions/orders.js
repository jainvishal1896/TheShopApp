import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDER = "SET_ORDER";

export const fetchOrders = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;
		try {
			const response = await fetch(
				`https://rn-theshopapp-22381-default-rtdb.firebaseio.com/orders/${userId}.json`
			);

			if (!response.ok) {
				throw new Error("Something went wrong."); // ths error is URL breakdown.
			}

			const resData = await response.json();
			const loadedOrders = [];
			for (const key in resData) {
				loadedOrders.push(
					new Order(
						key,
						resData[key].cartItems,
						resData[key].totalAmount,
						new Date(resData[key].date)
					)
				);
			}
			dispatch({ type: SET_ORDER, orders: loadedOrders });
		} catch (err) {
			throw err; // this error is for not being able to fetch data.
		}
	};
};

export const addOrder = (cartItems, totalAmount) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;
		const date = new Date();
		const response = await fetch(
			`https://rn-theshopapp-22381-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cartItems,
					totalAmount,
					date: date.toISOString(),
				}),
			}
		);
		const resData = await response.json();
		if (!response.ok) {
			throw new Error("Something went wrong");
		}
		dispatch({
			type: ADD_ORDER,
			id: resData.name,
			CartItems: cartItems,
			TotalAmount: totalAmount,
			date: date.toISOString(),
		});

		for (const cartItem of cartItems) {
			const pushToken = cartItem.productPushToken;

			fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Accept-Encoding": "gzip, deflate",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: pushToken,
					title: "Order was placed.",
					body: cartItem.prodTitle,
				}),
			});
		}
	};
};
