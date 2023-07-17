import { PICK_CUSTOMER, PICK_PRODUCT, PRODUCTS_QUANTITY, UPDATE_TOTAL } from "../../types";

export default (state, action) => {
    switch(action.type) {
        case PICK_CUSTOMER:
            return {
                ...state,
                customer: action.payload
            }
        case PICK_PRODUCT:
            return {
                ...state,
                products: action.payload
            }
        case PRODUCTS_QUANTITY:
            return {
                ...state,
                products: state.products.map(product => product.id === action.payload.id ? product = action.payload : product)
            }
        case UPDATE_TOTAL:
            return {
                ...state,
                total: state.products.reduce((newTotal, item) => newTotal += item.quantity * item.price, 0)
            }
        default:
            return state
    }
}