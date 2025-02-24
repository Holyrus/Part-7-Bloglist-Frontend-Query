import { Link } from 'react-router-dom'

const Menu = ({user, handleLogout}) => {

  return (
    <div className="flex flex-row items-center justify-between p-4 bg-amber-600">
      <div className="flex flex-row items-center justify-start gap-2">
        <h1 className="font-bold text-2xl">Blogs</h1>
        <Link className="font-medium border-2 rounded-full bg-amber-200 px-4 py-2 hover:bg-amber-400" to="/">Main</Link>
        <Link className="font-medium border-2 rounded-full bg-amber-200 px-4 py-2 hover:bg-amber-400" to="/users">Users</Link>
      </div>
      <div className="flex flex-row items-center justify-start gap-2">
        <p className="font-medium underline">{user.name} logged-in</p>
        <button className="font-medium border-2 rounded-full bg-red-500 px-3 py-1 hover:bg-red-800 hover:text-white hover:border-black" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Menu