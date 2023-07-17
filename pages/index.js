import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Customer from '../components/Customer'
import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'

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

export default function Home() {

  const router = useRouter()

  const { data, loading, error } = useQuery(GET_SELLER_CUSTOMERS)

  if (loading) return 'loading...'

  if (!data) router.push('/login')

  return (
    <div className={styles.container}>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Customers</h1>
        <Link href='/newcustomer'>
          <a className='bg-blue-800 inline-block py-2 px-5 mt-3 text-white rounded text-sm hover:bg-gray-500 mb-3 uppercase font-bold w-full lg:w-auto text-center'>New customer</a>
        </Link>
        <div className='overflow-x-scroll'>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-2'>Name</th>
                <th className='w-1/5 py-2'>Company</th>
                <th className='w-1/5 py-2'>Email</th>
                <th className='w-1/5 py-2'>Delete</th>
                <th className='w-1/5 py-2'>Edit</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {data && data.getCustomersBySeller.map( customer => (
                <Customer key={customer.id} customer={customer} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  )
}
