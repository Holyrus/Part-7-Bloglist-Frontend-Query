import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import signUpService from './services/signup'
import usersService from './services/users'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './components/NotificationContext'
import { useErrorNotificationDispatch } from './components/ErrorNotificationContext'

import { useReducer } from 'react'
import SignUpForm from './components/SignUpForm'

import {
  Routes, Route, useMatch
} from 'react-router-dom'

import Menu from './components/Menu'
import AllBlogs from './components/AllBlogs'
import Users from './components/Users'
import User from './components/User'

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER": 
      return action.payload
    case "REMOVE_USER": 
      return null
    default:
      return state
  }
}

const App = () => {

  const [loginVisibility, setLoginVisibility] = useState(false)
  const [signUpVisibility, setSignUpVisibility] = useState(false)
  
  const handleLoginClick = () => {
    setLoginVisibility(false);
    setSignUpVisibility(true);
  }

  const handleSignUpClick = () => {
    setLoginVisibility(true);
    setSignUpVisibility(false);
  }

  const notificationDispatch = useNotificationDispatch()
  const errorNotificationDispatch = useErrorNotificationDispatch()

  const [unauthorizedError, setUnauthorizedError] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null) // Here we store the user token

  const [user, userDispatch] = useReducer(userReducer, null)

  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) => blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldData) => {
        console.log(oldData)
        return oldData.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      })
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: (deletedBlog) => blogService.remove(deletedBlog.id),
    onSuccess: (deletedBlog) => {
      queryClient.setQueryData(['blogs'], (oldData) => {
        return oldData.filter(blog => blog.id !== deletedBlog.id)
      })
      queryClient.invalidateQueries(['blogs'])
      queryClient.invalidateQueries(['users'])
    }
  })

  const blogFormRef = useRef()

  //----------------------------------------------------

  // When we enter the page, all checks if user is already logged in and can be found in local storage

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: "SET_USER", payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user, // Only fetch blogs if the user is logged in
    onError: (error) => {
      if (error.response && error.response.status === 401) {
        setUnauthorizedError('Unauthorized')
        userDispatch({ type: "REMOVE_USER" })
        window.localStorage.removeItem('loggedBlogappUser')
      }
    }
  })

  const usersResult = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAllUsers,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user,
  })

  const users = usersResult.data || []

  const match = useMatch('/users/:id')
  const singleUser = match ? users.find(user => user.id === match.params.id) : null;

  console.log(singleUser)

  console.log(users)

  const blogs = result.data || []

  const blogsMatch = useMatch('/blogs/:id')
  const singleBlog = blogsMatch ? blogs.find(blog => blog.id === blogsMatch.params.id) : null;

  if (result.isLoading) {
    return <div>Loading data...</div>
  } else if (result.error?.message === "Request failed with status code 500") {
    return <div>Currently service is unavaiable</div>
  }

  // console.log(blogs)
  // console.log(JSON.stringify(result.error, null, 2))
  // console.log(result.error?.config.method)
  // console.log(result.error?.message)
  // console.log(unauthorizedError)


  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: "REMOVE_USER" })
    notificationDispatch({ type: "LOGOUT", payload: 'Logged out successfully' })
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      // If browser are refreshed, the user token will be still logged
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user) // Storing the user token in the local storage
      )

      blogService.setToken(user.token) // Setting the token to the blogService
      usersService.setToken(user.token)
      userDispatch({ type: "SET_USER", payload: user }) // Storing the user token
      setUsername('')
      setPassword('')
      notificationDispatch({ type: "LOGIN", payload: 'Logged in successfully' })
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" })
      }, 5000)

      // Need invalidation after logging in to display the blog list
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    
    } catch (exception) {
      errorNotificationDispatch({ type: "LOGIN", payload: 'Wrong credentials'})
      setTimeout(() => {
        errorNotificationDispatch({ type: "CLEAR" })
      }, 5000)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()

    try {

      const username = signUpUsername
      const name = signUpName
      const password = signUpPassword

      await signUpService.signup({
        username, name, password
      })

      setSignUpUsername('')
      setSignUpName('')
      setSignUpPassword('')
      notificationDispatch({ type: "SIGNUP", payload: 'Created new account successfully' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 5000)
    } catch (exception) {
      errorNotificationDispatch({ type: "SIGNUP", payload: 'Wrong validation'})
      setTimeout(() => {
        errorNotificationDispatch({ type: "CLEAR" })
      }, 5000)
    }

  }

  const handleAccountDeleting = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        signUpService.setToken(user.token)
        await signUpService.remove(user.id)
        window.localStorage.removeItem('loggedBlogappUser')
        userDispatch({ type: "REMOVE_USER" })
        notificationDispatch({ type: "DELETE_ACCOUNT", payload: 'Account deleted successfully' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 5000)
      } catch (exception) {
        errorNotificationDispatch({ type: "DELETE_ACCOUNT", payload: `Failed to delete account ${exception}` })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 5000)
      }
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    newBlogMutation.mutate(blogObject, {
      onError: (error) => {
        errorNotificationDispatch({ type: "CREATE", payload: `Cannot create new blog, ${error.response.data.error}`})
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 5000)
      },
      onSuccess: () => {
        notificationDispatch({ type: "CREATE", payload: `A new blog ${blogObject.title} by ${blogObject.author} added` })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 5000)
      }
    })
  }

  const updateBlog = id => {
    const likedBlog = blogs.find(blog => blog.id === id)

    updateBlogMutation.mutate({...likedBlog, likes: likedBlog.likes += 1}, {
      onError: (error) => {
        errorNotificationDispatch({ type: "LIKE", payload: `Cannot add Like, ${error.response.data}`})
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 5000)
      },
      onSuccess: () => {
        notificationDispatch({ type: "LIKE", payload: 'Like added' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 5000)
      }
    })
  }

  const deleteBlog = id => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if (window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      deleteBlogMutation.mutate(blogToDelete, {
        onError: (error) => {
          errorNotificationDispatch({ type: "DELETE", payload: `Cannot remove blog, ${error.response.data}`})
          setTimeout(() => {
            errorNotificationDispatch({ type: "CLEAR" })
          }, 5000)
        },
        onSuccess: () => {
          notificationDispatch({ type: "DELETE", payload: 'Blog removed' })
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 5000)
        }
      })
    }
  }

  return (
    <main className="antialiased overflow-x-hidden">

    {user === null || (result.error?.message === "Request failed with status code 401" && result.error?.config.method === "get") ? (
      <div className="bg-[#d8a71f88] flex flex-col items-center justify-center w-full h-[100vh] pb-16">
        <Notification />
        <ErrorNotification />
        <h1 className="font-semibold text-[2rem] underline hover:no-underline mb-4">Blogs</h1>
        <div className="flex flex-row gap-10">
          <Togglable buttonLabel='Sign up' clickHandle={handleLoginClick} formVisibility={signUpVisibility}>
            <SignUpForm
              username={signUpUsername}
              name={signUpName}
              password={signUpPassword}
              handleUsernameChange={({ target }) => setSignUpUsername(target.value)}
              handleNameChange={({ target }) => setSignUpName(target.value)}
              handlePasswordChange={({ target }) => setSignUpPassword(target.value)}
              handleSubmit={handleSignUp}
            />
          </Togglable>

          <Togglable buttonLabel='Login' clickHandle={handleSignUpClick} formVisibility={loginVisibility}>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        </div>
      </div>

    ) : (

      <div>
        <Menu user={user} handleLogout={handleLogout}/>
        
        <div className='flex lex-row items-start justify-evenly bg-amber-100 py-7'>
          <Routes>
            <Route path='/' element={<AllBlogs blogs={blogs} />} />
            <Route path='/users' element={<Users users={users}/>} />
            <Route path='/users/:id' element={<User user={singleUser}/>} />
            <Route path='/blogs/:id' element={<Blog singleBlog={singleBlog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>} />
          </Routes>

          <Togglable buttonLabel='New blog' ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
        </div>
        <footer className="bg-amber-400 p-4">
          <button className="font-medium text-[12px] border-2 border-black rounded-3xl p-1.5 px-2 bg-red-600 text-black hover:bg-red-400" onClick={handleAccountDeleting}>Delete account</button>
        </footer>
      </div>

    )}

    </main>
  )
}

export default App