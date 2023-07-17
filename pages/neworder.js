import Layout from '../components/Layout'
import AssignCustomer from '../components/orders/AssignCustomer'
import AssignProduct from '../components/orders/AssignProduct'
import { useContext, useState } from 'react'
import OrderContext from '../context/orders/OrderContext'
import OrderResume from '../components/orders/OrderResume'
import Total from '../components/orders/Total'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const NEW_ORDER = gql`
    mutation newOrder($input: OrderInput!) {
        newOrder(input: $input) {
            id
        }
    }  
`

const GET_ORDERS = gql`
    query getOrdersBySeller {
        getOrdersBySeller {
            id
            order {
                id
                quantity
                name
                price
            }
            customer {
                id
                name
                last_name
                email
                phone_number
            }
            user
            total
            orderState
        }
    }
`

const NewOrder = () => {
    const [message, setMessage] = useState(null)

    const orderContext = useContext(OrderContext)
    const { total, customer, products } = orderContext

    const router = useRouter()

    // Mutation to create a new order
    const [newOrder] = useMutation(NEW_ORDER, {
        update(cache, { data: newOrder }) {
            const { getOrdersBySeller } = cache.readQuery({
                query: GET_ORDERS
            })

            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersBySeller: [...getOrdersBySeller, newOrder]
                }
            })
        }
    })

    const validateOrder = () => !products.every(prod => prod.quantity > 0) || total === 0 ? "opacity-50 cursor-not-allowed" : ""

    const createNewOrder = async () => {

        const { id } = customer

        // Remove useless products fields
        const order = products.map(( {__typename, stock, ...product} ) => product)
 
        try {
            const { data } = await newOrder({
                variables: {
                    input: {
                        customer: id,
                        total,
                        order
                    }
                }
            })
            
            router.push('/orders')
        } catch (error) {
            setMessage(error.message.replace('GraphQL error: ', ''))

            setTimeout(() => {
                setMessage(null)
            }, 3000)
        }
    }

    const showMessage = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{message}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Create a new order</h1>
            {message && showMessage()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>

                </div>
            </div>
            <AssignCustomer />
            <AssignProduct />
            <OrderResume />
            <Total />

            <button
                type='button'
                className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
                onClick={() => createNewOrder()}
            >Save your order</button>
        </Layout>
    )
}

export default NewOrder