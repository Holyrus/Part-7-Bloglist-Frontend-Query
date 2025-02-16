import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

const Blog = ({ singleBlog, updateBlog, deleteBlog, user }) => {

  const navigate = useNavigate()

  useEffect(() => {
    if (!singleBlog) {
      navigate('/')
    }
  }, [singleBlog, navigate])

  if (!singleBlog) {
    return null
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  const canUserDelete = user.username === singleBlog.user.username ? true : false

  const removeBtn = () => {
    return <button onClick={() => deleteBlog(singleBlog.id)}>Remove</button>
  }

  return (
    <div style={blogStyle} className='blog'>
        <button><Link to={'/'}>Back</Link></button>
      {/* CSS attribute className 'blog' is used for access the component in tests */}
        <h2>{singleBlog.title}</h2>
        <p><i>Author - {singleBlog.author}</i></p>
        <div>
          <a href={singleBlog.url}>{singleBlog.url}</a> 
          <h4>{singleBlog.likes} - Likes <button onClick={() => updateBlog(singleBlog.id)}>Like</button></h4>
          <p><b>Created by {singleBlog.user.name}</b></p>
        </div>
        {canUserDelete && 
        removeBtn()}
    </div>
  )
}

export default Blog