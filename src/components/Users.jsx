import { Link } from "react-router-dom"

const Users = ({users}) => {
  return (
    <div>
      <h2>Users</h2>
      { users.length !== 0 && 
        [...users]
          .map(user =>
            <p key={user.id}><Link to={`/users/${user.id}`}>{user.name}</Link> has {user.blogs.length} {user.blogs.length === 1 ? 'blog' : 'blogs'}</p>
          )
      }
    </div>
  )
}

export default Users
