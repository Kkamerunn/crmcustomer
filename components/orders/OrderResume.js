import { useContext } from "react"
import OrderContext from "../../context/orders/OrderContext"
import ProductResume from "./ProductResume"

const OrderResume = () => {
    // Orders context
    const orderContext = useContext(OrderContext)
    const { products } = orderContext

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Adjust quantities of the product</p>
            {products.length > 0 ? (
                <>
                    {products.map(product => (
                        <ProductResume
                            key={product.id}
                            product={product}
                        />
                    ))}
                </>
            ) : (
                <p>There are not products yet</p>
            )}
        </>
    )
}

export default OrderResume