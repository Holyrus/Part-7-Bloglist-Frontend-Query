import { Link } from 'react-router-dom'

const Menu = ({user, handleLogout}) => {

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <Link style={padding} to="/">Main</Link>
      <Link style={padding} to="/users">Users</Link>
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
    
  )
}

export default Menu