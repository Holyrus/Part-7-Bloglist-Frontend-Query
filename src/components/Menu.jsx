import { Link } from 'react-router-dom'

const Menu = ({user, handleLogout}) => {

  const padding = {
    paddingRight: 5
  }

  return (
    <div className="flex flex-row items-center justify-start p-4">
      <h1 className="">Blogs</h1>
      <Link style={padding} to="/">Main</Link>
      <Link style={padding} to="/users">Users</Link>
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Menu