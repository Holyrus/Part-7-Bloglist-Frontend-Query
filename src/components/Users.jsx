import { Link } from "react-router-dom"

const Users = ({users}) => {
  return (
    <div>
      <h2 className="font-bold text-3xl underline mb-2">Users</h2>
      { users.length !== 0 && 
        [...users]
          .map(user =>
            <p key={user.id}><Link className="text-[20px] text-blue-600 hover:text-blue-800" to={`/users/${user.id}`}>{user.name}</Link> has {user.blogs.length} {user.blogs.length === 1 ? 'blog' : 'blogs'}</p>
          )
      }
    </div>
  )
}

export default Users
