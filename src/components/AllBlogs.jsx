import Blog from "./Blog"
import { Link } from "react-router-dom"

const AllBlogs = ({blogs}) => {
  return (
    <div>
      <h2>All Blogs</h2>
      { blogs.length !== 0 ?
        [...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <p key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></p>
         ) : (
          <p>No blogs</p>
        )}
    </div>
  )
}

export default AllBlogs
