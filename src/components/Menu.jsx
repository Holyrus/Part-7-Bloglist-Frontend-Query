import { Link } from 'react-router-dom'

const Menu = () => {

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <Link style={padding} to="/">Main</Link>
      <Link style={padding} to="/users">Users</Link>
    </div>
    
  )
}

export default Menu