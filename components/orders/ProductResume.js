import { useContext, useEffect, useState } from "react"
import OrderContext from "../../context/orders/OrderContext"

const ProductResume = ({product}) => {

    // Order context
    const orderContext = useContext(OrderContext)
    const { productsQuantity, updateTotal } = orderContext

    const [quantity, setQuantity] = useState(0)

    useEffect(() => {
        updateQuantity()
        updateTotal()
    }, [quantity])

    const updateQuantity = () => {
        const newProduct = { ...product, quantity: Number(quantity) }
        productsQuantity(newProduct)
    }

    const { name, price } = product

    return (
        <div className="md:flex md:justify-between md:items-center mt-5">
            <div className="md:w-2/4 mb-2 md:mb-0">
                <p className="text-sm">{name}</p>
                <p>{price}</p>
            </div>
            <input
                type="number"
                placeholder="Quantity"
                className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={e => setQuantity(e.target.value)}
                value={quantity}
            />
        </div>
    )
}

export default ProductResume