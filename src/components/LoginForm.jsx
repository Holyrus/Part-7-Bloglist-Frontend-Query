import React from 'react'

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          Username
          <br />
          <input
            data-testid='username'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Password
          <br />
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
