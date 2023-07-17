import Layout from '../components/Layout'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: UserAuthenticationInput!) {
        authenticateUser(input: $input) {
            token
        }
    }
`;

export default function Login() {

    const [ authenticateUser ] = useMutation(AUTHENTICATE_USER)

    const [message, saveMessage] = useState(null)

    const router = useRouter()

    const showMessage = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{message}</p>
            </div>
        )
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email invalid!').required('Email can\'t be empty'),
            password: Yup.string().required('Password required!')
        }),
        onSubmit: async values => {
            const { email, password } = values

            try {
                
                const { data } = await authenticateUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })
                
                const { token } = data.authenticateUser
                localStorage.setItem('token', token)

                saveMessage('Aunthenticating...')

                setTimeout(() => {
                    saveMessage(null)
                    router.push('/')
                }, 2000)
            } catch (error) {
                saveMessage(error.message.replace('GraphQL error: ', ''))
                
                setTimeout(() => {
                    saveMessage(null)
                }, 2000)
            }
        }
    })

    return (
      <div>
        <Layout>    
            <h1 className='text-center text-white font-light'>Login</h1>

            {message && showMessage()}

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="email"
                                id="email"
                                placeholder='Your email'
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
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                type="password"
                                id="password"
                                placeholder='Your password'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
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
                            value="Log in"
                        />
                    </form>
                </div>
            </div>
        </Layout>
      </div>
    )
  }