import { useState, useEffect, useContext } from "react"
import Select from "react-select"
import { gql, useQuery } from '@apollo/client'
import OrderContext from "../../context/orders/OrderContext";

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      price
      stock
    }
  }
`

const AssignProduct = () => {
    const [products, setProducts] = useState([])
    const { data, loading, error } = useQuery(GET_PRODUCTS)

    const orderContext = useContext(OrderContext)

    const { addProduct } = orderContext

    useEffect(() => {
        addProduct(products)
    }, [products])

    const handleSetProduct = product => {
        setProducts(product)
    }

    if (loading) return null

    const { getProducts } = data

    return (
        <>
            <h1 className="my-2 bg-white border-l-4 border-gray-800 text-gray-800 p-2 text-sm font-bold">2.- Assign a product to the order</h1>
            <Select 
                className="mt-3"
                options={getProducts}
                onChange={option => handleSetProduct(option)}
                isMulti={true}
                getOptionValue={options => options.id}
                getOptionLabel={options => `${options.name} - ${options.stock} Available`}
                placeholder="Pick a customer"
                noOptionMessage={() => "There are no results for this search"}
            />
        </>
    )
}

export default AssignProduct