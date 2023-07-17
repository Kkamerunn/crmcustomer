import DeleteIcon from "./icons/deleteIcon"
import EditIcon from "./icons/EditIcon";
import Swal from "sweetalert2"
import { gql, useMutation } from "@apollo/client"
import Router from "next/router";

const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($id: ID!) {
        deleteCustomer(id: $id)
    }
`;

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

const Customer = ({ customer }) => {

    const { name, last_name, company, email, id } = customer

    const [ deleteCustomer ] = useMutation(DELETE_CUSTOMER, {
        update(cache) {
            // get a cache's object copy
            const { getCustomersBySeller } = cache.readQuery({ query: GET_SELLER_CUSTOMERS })

            // rewrite cache
            cache.writeQuery({
                query: GET_SELLER_CUSTOMERS,
                data: {
                    getCustomersBySeller: getCustomersBySeller.filter( currentCustomers => currentCustomers.id !== id)
                }
            })
        }
    })

    const confirmDeleteCustomer = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then( async (result) => {
            if (result.isConfirmed) {      
                try {
                    const { data } = await deleteCustomer({
                        variables: {
                            id
                        }
                    })
                    Swal.fire(
                        'Deleted!',
                        data.deleteCustomer,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
          })
    }

    const confirmEditCustomer = () => {
        Router.push({
            pathname: "/editcustomer/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <td className='border px-4 py-2'>{name} {last_name}</td>
            <td className='border px-4 py-2'>{company}</td>
            <td className='border px-4 py-2'>{email}</td>
            <td className='border px-4 py-2'>
                <button type="button" 
                        className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={() => confirmDeleteCustomer()}
                >
                    Delete
                    <DeleteIcon />
                </button>
            </td>
            <td className='border px-4 py-2'>
                <button type="button" 
                        className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={() => confirmEditCustomer()}
                >
                    Edit
                    <EditIcon />
                </button>
            </td>
        </tr>
    )
}

export default Customer