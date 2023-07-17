import { useEffect } from "react";
import Layout from "../components/Layout"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { gql, useQuery } from "@apollo/client";

const GET_BEST_SELLERS = gql`
  query getBestSellers {
    getBestSellers {
      total
      seller {
        name
        email
      }
    }
  }
`

export default function BestSellers() {
  const {data, loading, error, startPolling, stopPolling} = useQuery(GET_BEST_SELLERS)

  useEffect(() => {
    startPolling(2000)
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  if (loading) return 'loading...'

  const { getBestSellers } = data

  const sellerGraph = []

  getBestSellers.forEach((seller, i) => {
    sellerGraph[i] = {
      ...seller.seller[0],
      total: seller.total
    }
  })

  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Best sellers</h1>
        <ResponsiveContainer
          width={'99%'}
          height={550}
        >
          <BarChart
            className="mt-5"
            width={600}
            height={450}
            data={sellerGraph}
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