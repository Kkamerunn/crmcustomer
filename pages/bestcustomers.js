import { useEffect } from "react";
import Layout from "../components/Layout"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { gql, useQuery } from "@apollo/client";

const GET_BEST_CUSTOMERS = gql`
  query getBestCustomers {
    getBestCustomers {
      total
      customer {
        name
        company
      }
    }
  }
`

export default function BestCustomers() {
  const {data, loading, error, startPolling, stopPolling} = useQuery(GET_BEST_CUSTOMERS)

  useEffect(() => {
    startPolling(2000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  if (loading) return 'loading...'

  const { getBestCustomers } = data

  const customerGraph = []

  getBestCustomers.forEach((customer, i) => {
    customerGraph[i] = {
      ...customer.customer[0],
      total: customer.total
    }
  })

  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Best customers</h1>
        <ResponsiveContainer
          width={'99%'}
          height={550}
        >
          <BarChart
            className="mt-5"
            width={600}
            height={450}
            data={customerGraph}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3182CE" />
          </BarChart> 
        </ResponsiveContainer>
    </Layout>
  )
}