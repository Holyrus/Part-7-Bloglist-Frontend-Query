import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from './components/NotificationContext'
import { useErrorNotificationDispatch } from './components/ErrorNotificationContext'

import { useReducer } from 'react'

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

  const notificationDispatch = useNotificationDispatch()
  const errorNotificationDispatch = useErrorNotificationDispatch()

  const [unauthorizedError, setUnauthorizedError] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [user, setUser] = useState(null) // Here we store the user token

  const [user, userDispatch] = useReducer(userReducer, null)

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
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

  if (result.isLoading) {
    return <div>Loading data...</div>
  } else if (result.error?.message === "Request failed with status code 500") {
    return <div>Currently service is unavaiable</div>
  }


  const blogs = result.data || []
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
      userDispatch({ type: "SET_USER", payload: user }) // Storing the user token
      setUsername('')
      setPassword('')
      notificationDispatch({ type: "LOGIN", payload: 'Logged in successfully' })
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" })
      }, 5000)

      // Need invalidation after logging in to display the blog list
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    
    } catch (exception) {
      errorNotificationDispatch({ type: "LOGIN", payload: 'Wrong credentials'})
      setTimeout(() => {
        errorNotificationDispatch({ type: "CLEAR" })
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    newBlogMutation.mutate(blogObject)

    notificationDispatch({ type: "CREATE", payload: `A new blog ${blogObject.title} by ${blogObject.author} added` })
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR" })
    }, 5000)
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
    <div>

      <h1>Blogs</h1>
      <Notification />
      <ErrorNotification />

    {user === null || (result.error?.message === "Request failed with status code 401" && result.error?.config.method === "get") ? (
      
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>

    ) : (

      <div>
        <p>{user.name} logged-in</p>
        <button onClick={handleLogout}>Logout</button>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
        <h2>blogs</h2>
        { blogs.length !== 0 ?
          [...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={blog.user.username}
                canUserDelete={user.username === blog.user.username}
              />
           ) : (
            <p>No blogs</p>
          )}
        </div>

    )}

    </div>
  )
}

export default App