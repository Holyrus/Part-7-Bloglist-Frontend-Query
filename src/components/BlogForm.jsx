import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setNewLikes('')
    
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLikesChange = (event) => {
    setNewLikes(event.target.value)
  }
  
  return (
    <div className="formDiv flex flex-col">
      <h2 className="font-semibold underline text-2xl">Create new blog</h2>

      <form className="py-2 text-[16px]" onSubmit={addBlog}>
        <input
          className="bg-white border-2 border-black text-black w-full pl-1 mb-1 placeholder-[#707073ff] font-medium curson-text"
          data-testid='title'
          value={newTitle}
          onChange={(e) => handleTitleChange(e)}
          placeholder='Title'
        />
        <br />
        <input
          className="bg-white border-2 border-black text-black w-full pl-1 mb-1 placeholder-[#707073ff] font-medium curson-text"
          data-testid='author'
          value={newAuthor}
          onChange={(e) => handleAuthorChange(e)}
          placeholder='Author'
        />
        <br />
        <input
          className="bg-white border-2 border-black text-black w-full pl-1 mb-1 placeholder-[#707073ff] font-medium curson-text"
          data-testid='url'
          value={newUrl}
          onChange={(e) => handleUrlChange(e)}
          placeholder='Url'
        />
        <br />
        <input
          className="bg-white border-2 border-black text-black w-full pl-1 mb-2 placeholder-[#707073ff] font-medium curson-text"
          data-testid='likes'
          value={newLikes}
          onChange={(e) => handleLikesChange(e)}
          placeholder='Likes'
        />
        <button className="font-semibold border-2 rounded-full p-2 px-3 border-black bg-emerald-400 hover:bg-emerald-500" type="submit">Save</button>
      </form>
    </div>
  )
}

export default BlogForm
