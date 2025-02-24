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

  const canUserDelete = user.username === singleBlog.user.username ? true : false

  const removeBtn = () => {
    return <button className="mt-2 px-2 py-1 bg-red-800 text-white rounded-3xl text-[12px] hover:bg-red-700" onClick={() => deleteBlog(singleBlog.id)}>Remove</button>
  }

  return (
    <div className='blog'>
        <button className="bg-amber-600 border-2 rounded-full border-black px-3 py-1 hover:bg-amber-300" ><Link to={'/'}>Back</Link></button>
      {/* CSS attribute className 'blog' is used for access the component in tests */}
        <h2 className="text-2xl font-bold mt-2">{singleBlog.title}</h2>
        <p><i>Author - {singleBlog.author}</i></p>
        <div>
          <a href={singleBlog.url} className="text-blue-600">{singleBlog.url}</a> 
          <h4 className="font-semibold">{singleBlog.likes} - Likes <button className="border-2 bg-green-400 rounded-2xl px-1.5 py-0.3 hover:bg-green-500" onClick={() => updateBlog(singleBlog.id)}>Like</button></h4>
          <p><b>Created by {singleBlog.user.name}</b></p>
        </div>
        {canUserDelete && 
        removeBtn()}

        <h3 className="font-semibold text-2xl mt-2">Comments</h3>
          {comments.length !== 0 ? (
            <ul className="border-2 rounded-2xl p-2 my-3">
              {comments.map((comment) => (
                <li className="border-b-2" key={comment.id}>
                  {comment.content} by <b>{comment.user.username}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments</p>
          )}
        <h3 className="font-semibold">Leave comment</h3>
        <form onSubmit={handleCommentSubmit}>
          <input
            className="bg-white text-[13px] border-2 border-black text-black pl-1 placeholder-[#707073ff] font-medium curson-text mr-1.5"
            type="text"
            value={newComment}
            onChange={handleCommentChange}
          />
          <button className="text-[12px] font-semibold border-2 bg-blue-400 hover:bg-blue-300 py-1 px-2 rounded-sm" type="submit">Comment</button>
        </form>
    </div>
  )
}

export default Blog