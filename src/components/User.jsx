import { Link } from "react-router-dom"

const User = ({ user }) => {

  if (!user) {
    return null
  }

  return (
    <div>
      <button className="bg-amber-600 border-2 rounded-full border-black px-3 py-1 hover:bg-amber-300"><Link to={'/users'}>Back</Link></button>
      <h2 className="font-bold text-2xl">{user.name}</h2>
      <h4 className="font-semibold text-[20px]">Added blogs</h4>
      <ul className="list-disc pl-5">
        {user.blogs.length !== 0 ?
          user.blogs.map(blog => 
            <li key={blog.id}>{blog.title}</li>
          )
          :
        <p>There is no blogs</p>
        }
      </ul>
    </div>
  )
}

export default User
