import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Order from '../components/Order'

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

export default function Orders() {

  const { data, loading, error } = useQuery(GET_ORDERS)

  if (loading) return 'Loading...'

  const { getOrdersBySeller } = data

  return (
    <div className={styles.container}>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Orders</h1>
        <Link href='/neworder'>
          <a className='bg-blue-800 inline-block py-2 px-5 mt-3 text-white rounded text-sm hover:bg-gray-500 mb-3 uppercase font-bold'>New order</a>
        </Link>
        { getOrdersBySeller.length === 0 ? (
          <p className='mt-5 text-center text-2xl'>There are no orders just yet</p>
        ) : (
          getOrdersBySeller.map(order => (
            <Order
              key={order.id}
              order={order}
            />
          ))
        )}
      </Layout>
    </div>
  )
}