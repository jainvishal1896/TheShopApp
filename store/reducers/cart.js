import CartItem from "../../models/cart-items";
import { ADD_TO_CART, DELETE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_ITEM } from "../actions/products";

const initialState = {
	items: {},
	totalAmount: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const selectedProduct = action.product;
			const prodId = selectedProduct.id;
			const pushToken = selectedProduct.pushToken;

			let updatedOrNewProduct;
			if (state.items[prodId]) {
				updatedOrNewProduct = new CartItem(
					state.items[prodId].quantity + 1,
					selectedProduct.price,
					selectedProduct.title,
					pushToken,
					state.items[prodId].sum + selectedProduct.price
				);
			} else {
				updatedOrNewProduct = new CartItem(
					1,
					selectedProduct.price,
					selectedProduct.title,
					pushToken,
					selectedProduct.price
				);
			}
			return {
				...state,
				items: {
					...state.items,
					[prodId]: updatedOrNewProduct,
				},
				totalAmount: state.totalAmount + selectedProduct.price,
			};
		case DELETE_FROM_CART:
			const cartProduct = state.items[action.productId];
			const currentQty = cartProduct.quantity;
			let updatedCartitems;
			if (currentQty > 1) {
				const updatedCartitem = new CartItem(
					cartProduct.quantity - 1,
					cartProduct.prodPrice,
					cartProduct.prodTitle,
					cartProduct.pushToken,
					cartProduct.sum - cartProduct.prodPrice
				);
				updatedCartitems = {
					...state.items,
					[action.productId]: updatedCartitem,
				};
			} else {
				updatedCartitems = { ...state.items };
				delete updatedCartitems[action.productId];
			}
			return {
				...state,
				items: updatedCartitems,
				totalAmount: state.totalAmount - cartProduct.prodPrice,
			};

		case ADD_ORDER:
			return initialState;

		case DELETE_ITEM:
			if (!state.items[action.pid]) {
				return state;
			}
			const updatedItems = { ...state.items };
			const productAmount = state.items[action.pid].sum;
			delete updatedItems[action.pid];

			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - productAmount,
			};
	}
	return state;
};
