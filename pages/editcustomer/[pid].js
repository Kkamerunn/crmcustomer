import { gql, useQuery, useMutation } from "@apollo/client"
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Formik } from "formik";
import * as Yup from 'yup'

const GET_CUSTOMER = gql`
    query getCustomer($id: ID!) {
        getCustomer(id: $id) {
            name
            last_name
            company
            email
            phone_number
        }
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($id: ID!, $input: CustomerInput!) {
        updateCustomer(id: $id, input: $input) {
            name
            last_name
            company
            email
            phone_number
        }
    }
`

const EditCustomer = () => {

    const router = useRouter()
    const { query: { pid } } = router

    const { data, loading, error } = useQuery(GET_CUSTOMER, {
        variables: {
            id: pid
        }
    })

    const [ updateCustomer ] = useMutation(UPDATE_CUSTOMER)

    const validationSchema = Yup.object({
        name: Yup.string().required('customer name is mandatory'),
        lastname: Yup.string().required('customer lastname is mandatory'),
        company: Yup.string().required('customer company is mandatory'),
        email: Yup.string().email('Email format not valid').required('customer name is mandatory')
    })

    if (loading) return 'Downloading...'

    const { getCustomer } = data

    const updateInfoCustomer = async (values) => {
        const { name, lastname, email, company, phone } = values

        try {
            const { data } = await updateCustomer({
                variables: {
                    id,
                    input: {
                        name,
                        last_name: lastname,
                        email,
                        company,
                        phone_number: phone
                    }
                }
            })

            console.log(data)

            Swal.fire(
                'Updated!',
                'Customer has been updated succesfully',
                'success'
            )

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit customer</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={getCustomer}
                        onSubmit={(values) => {
                            updateInfoCustomer(values)
                        }}
                    >
                        {props => {

                            return (
                                <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={props.handleSubmit}>
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                                            Name
                                        </label>
                                        <input
                                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            type="text"
                                            id="name"
                                            placeholder='Customer name'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.name}
                                        />
                                    </div>

                                    {props.touched.name && props.errors.name ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.name}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.last_name}
                                        />
                                    </div>

                                    {props.touched.last_name && props.errors.last_name ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.last_name}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.company}
                                        />
                                    </div>

                                    {props.touched.company && props.errors.company ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.company}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>

                                    {props.touched.email && props.errors.email ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.email}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.phone_number}
                                        />
                                    </div>
                                    <input 
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Edit customer"
                                    />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

export default EditCustomer