import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import blogService from '../services/blogs'

const Blog = ({ singleBlog, updateBlog, deleteBlog, user }) => {

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
    if (!singleBlog) {
      navigate('/')
    }
  }, [singleBlog, navigate])

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await blogService.getComments(singleBlog.id);
      setComments(comments);
    }
    fetchComments()
  }, [singleBlog.id])

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const comment = { content: newComment };
    await blogService.addComment(singleBlog.id, comment)
    const updatedComments = await blogService.getComments(singleBlog.id)
    setComments(updatedComments);
    setNewComment('');
  }

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

        <h3>Comments</h3>
          {comments.length !== 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  {comment.content} by {comment.user.username}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments</p>
          )}
        <h3>Leave comment</h3>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={handleCommentChange}
          />
          <button type="submit">Add Comment</button>
        </form>
    </div>
  )
}

export default Blog