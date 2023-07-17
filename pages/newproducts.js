import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup"
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const NEW_PRODUCT = gql`
    mutation NewProduct($input: ProductInput!) {
        newProduct(input: $input) {
            name
            price
            stock
        }
    }
`

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      price
      stock
    }
  }
`

const NewProduct = () => {
    const [newProduct] = useMutation(NEW_PRODUCT, {
        update(cache, { data: { newProduct } }) {
            // first we need to get the cache object
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })

            // then we rewrite the cache object
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, newProduct]
                }
            })
        }
    })
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            name: '',
            stock: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('The name of the product is mandatory'),
            stock: Yup.number().required('Add the available stock').positive('Negative numbers are not allowed').integer('stock must be integer'),
            price: Yup.number().required('The price is mandatory').positive('Negative numbers are not allowed')
        }),
        onSubmit: async values => {
            const { name, price, stock } = values
            
            try {
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            price,
                            stock
                        }
                    }
                })

                Swal.fire(
                    'Added',
                    'A new product has been added to the stock',
                    'success'
                )

                router.push('/products')
            } catch (error) {
                console.log(error)
            }
        }
    })

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light text-center">Create a new product</h1>
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
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='stock'>
                                Stock
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="number"
                                id="stock"
                                placeholder='stock'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.stock}
                            />
                        </div>
                        {formik.touched.stock && formik.errors.stock ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.stock}</p>
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                            />
                        </div>
                        {formik.touched.price && formik.errors.price ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.price}</p>
                            </div>
                        ) : null}
                        <input 
                            type="submit"
                            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                            value="Add new product"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NewProduct