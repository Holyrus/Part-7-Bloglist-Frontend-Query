import { Link } from "react-router-dom"

const User = ({ user }) => {

  if (!user) {
    return null
  }

  return (
    <div>
      <br/>
      <button><Link to={'/users'}>Back</Link></button>
      <h2>{user.name}</h2>
      <h4>Added blogs</h4>
      {user.blogs.length !== 0 ?
        user.blogs.map(blog => 
          <p key={blog.id}>{blog.title}</p>
        )
        :
      <p>There is no blogs</p>
      }
    </div>
  )
}

export default User
