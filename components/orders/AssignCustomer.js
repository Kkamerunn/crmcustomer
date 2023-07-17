import { useState, useEffect, useContext } from "react"
import Select from "react-select"
import { gql, useQuery } from '@apollo/client'
import OrderContext from "../../context/orders/OrderContext";

const GET_SELLER_CUSTOMERS = gql`
  query getCustomersBySeller {
    getCustomersBySeller {
      id
      name
      last_name
      company
      email
    }
  }
`;

const AssignCustomer = () => {
    const [customer, setCustomer] = useState([])

    const orderContext = useContext(OrderContext)

    const { addCustomer } = orderContext

    // Database request
    const { data, loading, error } = useQuery(GET_SELLER_CUSTOMERS)

    useEffect(() => {
        addCustomer(customer)
    }, [customer])

    const handleSetCustomer = customer => {
        setCustomer(customer)
    }

    if (loading) return null

    const { getCustomersBySeller } = data

    return (
        <>
            <h1 className="my-2 bg-white border-l-4 border-gray-800 text-gray-800 p-2 text-sm font-bold">1.- Assign a customer to the order</h1>
            <Select 
                className="mt-3"
                options={getCustomersBySeller}
                onChange={option => handleSetCustomer(option)}
                getOptionValue={options => options.id}
                getOptionLabel={options => options.name}
                placeholder="Pick a customer"
                noOptionMessage={() => "There are no results for this search"}
            />
        </>
    )
} 

export default AssignCustomer