import { useState } from "react"
import Layout from "../components/Layout"
import { useFormik } from "formik"
import * as Yup from 'yup'
import { gql, useMutation } from "@apollo/client"
import { useRouter } from 'next/router'

const NEW_CUSTOMER = gql`
    mutation newCustomer($input: CustomerInput!) {
            newCustomer(input: $input) {
            name
            last_name
            company
            email
            phone_number
        }
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

const NewCustomer = () => {

    const router = useRouter()

    const [message, saveMessage] = useState(null)

    const showMessage = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{message}</p>
            </div>
        )
    }

    // Mutation for creating new customers
    const [ newCustomer ] = useMutation(NEW_CUSTOMER, {
        update(cache, { data: newCustomer }) {
            // Get the cache object that we want to override
            const { getCustomersBySeller } = cache.readQuery({ query: GET_SELLER_CUSTOMERS }) 

            // Rewrite cache (we must never edit a mutation or cache just rewrite it)
            cache.writeQuery({
                query: GET_SELLER_CUSTOMERS,
                data: {
                    getCustomersBySeller: [...getCustomersBySeller, newCustomer]
                }
            })

        }
    })


    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            company: '',
            email: '',
            phone: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('customer name is mandatory'),
            lastname: Yup.string().required('customer lastname is mandatory'),
            company: Yup.string().required('customer company is mandatory'),
            email: Yup.string().email('Email format not valid').required('customer name is mandatory')
        }),
        onSubmit: async values => {
            const { name, lastname, company, email, phone } = values

            try {
                const { data } = await newCustomer({
                    variables: {
                        input: {
                            name,
                            last_name: lastname,
                            company,
                            email,
                            phone_number: phone
                        }
                    }
                })
                console.log(data.newCustomer)

                router.push('/')
            } catch (error) {
                saveMessage(error.message.replace('GraphQL error: ', ''))
                
                setTimeout(() => {
                    saveMessage(null)
                }, 2000)
            }
            
        }
    })

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New customer</h1>

            {message && showMessage()}

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                                Name
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="text"
                                id="name"
                                placeholder='Customer name'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.name}
                            />
                        </div>

                        {formik.touched.name && formik.errors.name ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.name}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='lastname'>
                                Lastname
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="text"
                                id="lastname"
                                placeholder='Customer lastname'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastname}
                            />
                        </div>

                        {formik.touched.lastname && formik.errors.lastname ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.lastname}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='company'>
                                Company
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="text"
                                id="company"
                                placeholder='Customer company'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.company}
                            />
                        </div>

                        {formik.touched.company && formik.errors.company ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.company}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="email"
                                id="email"
                                placeholder='Customer email'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                        </div>

                        {formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>
                                Phone
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="tel"
                                id="phone"
                                placeholder='Customer phone'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                            />
                        </div>
                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Register a customer"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NewCustomer