import { useReducer } from "react";
import OrderContext from "./OrderContext";
import OrderReducer from "./OrderReducer";

import { PICK_CUSTOMER, PICK_PRODUCT, PRODUCTS_QUANTITY, UPDATE_TOTAL } from "../../types";

const OrderState = ({children}) => {
    const initialState = {
        customer: {},
        products: [],
        total: 0
    }

    const [ state, dispatch ] = useReducer(OrderReducer, initialState)

    const addCustomer = customer => {
        dispatch({
            type: PICK_CUSTOMER,
            payload: customer
        })
    }

    const addProduct = productSelected => {
        let newState
        if (state.products.length > 0) {
            newState = productSelected.map(product => {
                const newObject = state.products.find(productState => productState.id === product.id)
                return {...product, ...newObject}
            })
        } else {
            newState = productSelected
        }

        dispatch({
            type: PICK_PRODUCT,
            payload: newState
        })
    }

    // Modify the quantity of products
    const productsQuantity = newProduct => {
        dispatch({
            type: PRODUCTS_QUANTITY,
            payload: newProduct
        })
    }

    // Update total
    const updateTotal = () => {
        dispatch({
            type: UPDATE_TOTAL
        })
    }

    return (
        <OrderContext.Provider
            value={{
                products: state.products,
                addCustomer,
                addProduct,
                productsQuantity,
                updateTotal,
                total: state.total,
                customer: state.customer
            }}
        >
            {children}
        </OrderContext.Provider>
    )
}

export default OrderState