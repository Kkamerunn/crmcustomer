import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            last_name
        }    
    }
`;

const Header = () => {

    const router = useRouter()

    const logOut = () => {
        localStorage.removeItem('token')
        router.push('/login')
    }

    const { data, loading, error } = useQuery(GET_USER)

    if (loading) return "loading..."

    if (!data) {
        return router.push('/login')
    }

    let username, userlastname

    // const { name, last_name } = data.getUser

    if (data.getUser) {
        username = data.getUser.name
        userlastname = data.getUser.last_name
    }

    return (
        <div className='sm:flex sm:justify-between mb-6'>
            <p className='mr-2'>Hola: {username} {userlastname}</p>
            <button onClick={() => logOut()} className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md ' type='button'>
                Log out
            </button>
        </div>
    )

}

export default Header