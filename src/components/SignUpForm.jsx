const SignUpForm = ({handleSubmit, handleUsernameChange, handleNameChange, handlePasswordChange, username, name, password}) => {
  return (
    <div>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div>
          Username
          <br />
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Name
          <br />
          <input
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          Password
          <br />
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpForm