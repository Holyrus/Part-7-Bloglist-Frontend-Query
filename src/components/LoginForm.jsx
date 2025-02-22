import React from 'react'

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <div className="flex flex-col h-[290px]">
      <h2 className="font-semibold underline text-2xl">Login</h2>

      <form className="py-4 text-[16px]" onSubmit={handleSubmit}>
        <div>
          Username
          <br />
          <input
            className="bg-white border-2 border-black text-black w-full pl-1 placeholder-[#707073ff] font-medium curson-text"
            data-testid='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Password
          <br />
          <input
            className="bg-white border-2 border-black text-black w-full pl-1 placeholder-[#707073ff] font-medium curson-text"
            data-testid='password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <br />
        <button className="font-semibold border-2 rounded-full p-2 px-3 border-black bg-emerald-400 hover:bg-emerald-500" type="submit">Login</button>
      </form>
      <button className=" text-[16px] font-semibold border-2 rounded-full h-[40px] w-[156px] border-black bg-pink-600 hover:bg-pink-500">Forgot Password?</button>
    </div>
  )
}

export default LoginForm
