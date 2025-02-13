import Blog from "./Blog"

const AllBlogs = ({blogs, updateBlog, deleteBlog, user}) => {
  return (
    <div>
      <h2>All Blogs</h2>
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
  )
}

export default AllBlogs
