import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const NEW_ACCOUNT = gql`
    mutation newUser($input: UserInput!) {
        newUser(input: $input) {
            name
            last_name
            email
        }
    }
`;

export default function Signup() {

    const [newUser] = useMutation(NEW_ACCOUNT)

    const [message, saveMessage] = useState(null)

    const router = useRouter()
 
    // form validation
    const formik = useFormik({
        initialValues: {
            name: '',
            lastname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            lastname: Yup.string().required('Lastname is required'),
            email: Yup.string().email('This format is invalid').required('Password is required'),
            password: Yup.string().required('Name is required').min(6, 'Password must have at least 6 characters')
        }),
        onSubmit: async values => {
            const { name, lastname, email, password } = values

            try {
                const data = await newUser({
                    variables: {
                        input: {
                            name,
                            last_name: lastname,
                            email,
                            password
                        }
                    }
                })

                saveMessage(`User ${data.newUser.name} created correctly`)

                setTimeout(() => {
                    saveMessage(null)
                    router.push('/login')
                }, 3000)


            } catch (error) {
                saveMessage(error.message)

                setTimeout(() => {
                    saveMessage(null)
                }, 3000)
            }
        }
    })

    const showMessage = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{message}</p>
            </div>
        )
    }

    return (
      <div>
        <Layout>    

            {message && showMessage()}

            <h1 className='text-center text-white font-light'>Signup</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                                Name
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="text"
                                id="name"
                                placeholder='Your name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                placeholder='Your lastname'
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.lastname && formik.errors.lastname ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.lastname}</p>
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
                                placeholder='Your email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="password"
                                id="password"
                                placeholder='Your password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.password && formik.errors.password ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.password}</p>
                            </div>
                        ) : null}

                        <input 
                            type="submit"
                            className='bg-gray-800 w-full mt-5 p-2 uppercase text-white hover:bg-gray-900 hover:cursor-pointer'
                            value="Create account"
                        />
                    </form>
                </div>
            </div>
        </Layout>
      </div>
    )
  }