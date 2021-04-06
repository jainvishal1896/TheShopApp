import { ADD_ORDER, SET_ORDER } from "../actions/orders";

import Order from "../../models/order";

const initialState = {
	orders: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_ORDER:
			return {
				orders: action.orders,
			};
		case ADD_ORDER:
			const newOrder = new Order(
				action.id,
				action.CartItems,
				action.TotalAmount,
				action.date
			);
			return {
				orders: state.orders.concat(newOrder),
			};
	}
	return state;
};
