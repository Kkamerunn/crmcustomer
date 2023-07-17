import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { gql, useQuery, useMutation } from "@apollo/client"
import { Formik } from "formik";
import * as Yup from "yup"
import Swal from 'sweetalert2'

const GET_PRODUCT = gql`
    query getProduct($getProductId: ID!) {
        getProduct(id: $getProductId) {
            name
            price
            stock
        }
    }
`

const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($updateProductId: ID!, $input: ProductInput) {
        updateProduct(id: $updateProductId, input: $input) {
            id
            name
            price
            stock
        }
    }
`

const EditProduct = () => {
    const router = useRouter()
    const { query: { pid } } = router
    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            getProductId: pid
        }
    })

    const [ updateProduct ] = useMutation(UPDATE_PRODUCT)

    if (loading) return 'loading...'

    if (!data) return 'Action forbidden!'

    const { getProduct } = data

    const validationSchema = Yup.object({
        name: Yup.string().required('The name of the product is mandatory'),
        stock: Yup.number().required('Add the available stock').positive('Negative numbers are not allowed').integer('stock must be integer'),
        price: Yup.number().required('The price is mandatory').positive('Negative numbers are not allowed')
    })

    const updateProductInfo = async (values) => {
        const { name, price, stock } = values
        try {
            const { data } = await updateProduct({
                variables: {
                    updateProductId: pid,
                    input: {
                        name,
                        stock,
                        price
                    }
                }
            })
            router.push('/products')

            Swal.fire(
                'Correct',
                'The product has been updated succesfully',
                'success'
            )
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit product</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        enableReinitialize
                        initialValues={getProduct}
                        validationSchema={validationSchema}
                        onSubmit={values => {
                            updateProductInfo(values)
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
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='stock'>
                                            Stock
                                        </label>
                                        <input
                                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            type="number"
                                            id="stock"
                                            placeholder='stock'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.stock}
                                        />
                                    </div>
                                    {props.touched.stock && props.errors.stock ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.stock}</p>
                                        </div>
                                    ) : null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='price'>
                                            Price
                                        </label>
                                        <input
                                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                            type="number"
                                            id="price"
                                            placeholder='price'
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.price}
                                        />
                                    </div>
                                    {props.touched.price && props.errors.price ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.price}</p>
                                        </div>
                                    ) : null}
                                    <input 
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Save changes"
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

export default EditProduct