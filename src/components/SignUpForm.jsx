const SignUpForm = ({handleSubmit, handleUsernameChange, handleNameChange, handlePasswordChange, username, name, password}) => {
  return (
    <div className="flex flex-col h-[290px]">
      <h2 className="font-semibold underline text-2xl">Sign Up</h2>

      <form className="py-4 text-[16px]" onSubmit={handleSubmit}>
        <div>
          Username
          <br />
          <input
            className="bg-white border-2 border-black text-black w-full pl-1 placeholder-[#707073ff] font-medium curson-text"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Name
          <br />
          <input
            className="bg-white border-2 border-black text-black w-full pl-1 placeholder-[#707073ff] font-medium curson-text"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          Password
          <br />
          <input
            className="bg-white border-2 border-black text-black w-full pl-1 placeholder-[#707073ff] font-medium curson-text"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <br />
        <button className="font-semibold border-2 rounded-full p-2 px-3 border-black bg-emerald-400 hover:bg-emerald-500" type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpForm