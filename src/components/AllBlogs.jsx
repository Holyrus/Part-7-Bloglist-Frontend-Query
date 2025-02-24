import Blog from "./Blog"
import { Link } from "react-router-dom"

const AllBlogs = ({blogs}) => {
  return (
    <div>
      <h2 className="font-bold text-3xl underline">All Blogs</h2>
      { blogs.length !== 0 ?
        [...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <p className="text-[18px] font-semibold text-amber-950 hover:text-gray-700" key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></p>
         ) : (
          <p className="font-bold text-2xl">No blogs</p>
        )}
    </div>
  )
}

export default AllBlogs
