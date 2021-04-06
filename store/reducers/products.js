import PRODUCTS from "../../data/dummy-data";
import Product from "../../models/products";
import {
	CREATE_PRODUCT,
	DELETE_ITEM,
	SET_PRODUCT,
	UPDATE_PRODUCT,
} from "../actions/products";

const initialState = {
	availableProducts: [],
	userProducts: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_PRODUCT:
			return {
				availableProducts: action.products,
				userProducts: action.userProducts,
			};
		case DELETE_ITEM:
			return {
				...state,
				userProducts: state.userProducts.filter(
					(product) => product.id !== action.pid
				),
				availableProducts: state.availableProducts.filter(
					(product) => product.id !== action.pid
				),
			};
		case CREATE_PRODUCT:
			const newProduct = new Product(
				action.productData.id,
				action.productData.ownerId,
				action.productData.pushToken,
				action.productData.title,
				action.productData.image,
				action.productData.description,
				action.productData.price
			);
			return {
				...state,
				userProducts: state.userProducts.concat(newProduct),
				availableProducts: state.availableProducts.concat(newProduct),
			};
		case UPDATE_PRODUCT:
			const productIndex = state.userProducts.findIndex(
				(prod) => prod.id === action.pid
			);
			const AvailProductIndex = state.availableProducts.findIndex(
				(prod) => prod.id === action.pid
			);
			const updatedProduct = new Product(
				action.pid,
				state.userProducts[productIndex].ownerId, // thats why we need the index of product
				state.userProducts[productIndex].pushToken,
				action.productData.title,
				action.productData.image,
				action.productData.description,
				state.userProducts[productIndex].price
			);
			const updatedUserProducts = [...state.userProducts];
			updatedUserProducts[productIndex] = updatedProduct;
			const updatedAvailableProducts = [...state.availableProducts];
			updatedAvailableProducts[AvailProductIndex] = updatedProduct;
			return {
				...state,
				userProducts: updatedUserProducts,
				availableProducts: updatedAvailableProducts,
			};
	}
	return state;
};
