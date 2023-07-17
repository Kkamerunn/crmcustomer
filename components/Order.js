import { useState, useEffect } from "react"
import DeleteIcon from "./icons/deleteIcon"
import { gql, useMutation } from "@apollo/client"
import Swal from "sweetalert2"

const UPDATE_ORDER = gql`
    mutation updateOrder($id: ID!, $input: UpdateOrderInput) {
        updateOrder(id: $id, input: $input) {
            orderState
        }
    }
`

const DELETE_ORDER = gql`
    mutation DeleteOrder($id: ID!) {
        deleteOrder(id: $id)
    }
`

const GET_ORDERS = gql`
    query getOrdersBySeller {
        getOrdersBySeller {
            id
        }
    }
`

const Order = ({order}) => {

    const { id, total, customer, orderState } = order

    // Mutation to change the order´s state
    const [updateOrder] = useMutation(UPDATE_ORDER)

    // Mutation for deleting orders
    const [deleteOrder] = useMutation(DELETE_ORDER, {
        update(cache) {
            const { getOrdersBySeller } = cache.readQuery({
                query: GET_ORDERS
            })

            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersBySeller: getOrdersBySeller.filter(order => order.id !== id)
                }
            })
        }
    })

    let name, last_name, phone_number, email

    if (customer) {
        name = customer.name
        last_name = customer.last_name
        phone_number = customer.phone_number
        email = customer.email
    }

    const [state, setState] = useState(orderState)
    
    const [clase, setClase] = useState('')

    useEffect(() => {
        if (state) {
            setState(state)
        }
        shiftStateClase()
    }, [state])

    const shiftStateClase = () => {
        if (state == 'COMPLETED') {
            setClase('border-green-500')
        } else if (state == 'PENDING') {
            setClase('border-yellow-500')
        } else {
            setClase('border-red-500')
        }
    }

    const shiftOrderState = async newState => {
        try {
            const { data } = await updateOrder({
                variables: {
                    id,
                    input: {
                        orderState: newState,
                        customer: customer.id
                    }
                }
            })

            setState(data.updateOrder.orderState)
        } catch (error) {
            console.log(error.message)
        }
    }

    const confirmDeleteOrder = () => {
        Swal.fire({
            title: 'Are you sure you want to delete this order?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "Cancel"
          }).then( async (result) => {
            if (result.value) {      
                try {
                    const { data } = await deleteOrder({
                        variables: {
                            id
                        }
                    })
                    Swal.fire(
                        'Deleted!',
                        data.deleteOrder,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
          })
    }

    return (
        <div className={`mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg border-t-4 ${clase}`}>
            <div>
                <p className="font-bold text-gray-800">Customer: {name} {last_name}</p>
                {email && (
                    <p className="flex items-center gap-2 my-2">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.5" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                        </svg>
                        {email}
                    </p>
                )}
                {phone_number && (
                    <p className="flex items-center gap-2 my-2">
                        <svg fill="none" stroke="currentColor" strokeWidth="1.5" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ariaHidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                        </svg>
                        {phone_number}
                    </p>
                )}
                <h2 className="text-gray-800 font-bold mt-10">Order State</h2>
                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-600 uppercase text-xs font-bold"
                    value={state}
                    onChange={e => shiftOrderState(e.target.value)}
                >
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>
            <div>
                <h2 className="text-gray-800 font-bold mt-2">Order resume</h2>
                {order.order.map(art => (
                    <div key={art.id} className="mt-4">
                        <p className="text-sm text-gray-600">Product: {art.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {art.quantity}</p>
                    </div>
                ))}
                <p className="text-gray-800 mt-3 font-bold">Total to pay:
                    <span className="font-light">$ {total}</span>
                </p>
                <button
                    className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 text-white rounded leading-tight"
                    onClick={() => confirmDeleteOrder()}
                >
                    Delete order <DeleteIcon />
                </button>
            </div>
        </div>
    )
}

export default Order