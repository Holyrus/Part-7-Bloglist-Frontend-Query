import { createContext, useContext, useReducer } from "react";

const errorNotificationReducer = (state, action) => {
  switch(action.type) {
    case "LOGIN":
      return action.payload
    case "SIGNUP":
      return action.payload
    case "LIKE": 
      return action.payload
    case "DELETE": 
      return action.payload
    case "CLEAR":
      return null
    default: 
      return state
  }
}

const ErrorNotificationContext = createContext()

export const ErrorNotificationContextProvider = ({ children }) => {
  const [errorNotification, errorNotificationDispatch] = useReducer(errorNotificationReducer, null)

  return (
    <ErrorNotificationContext.Provider value={ [errorNotification, errorNotificationDispatch] }>
      {children}
    </ErrorNotificationContext.Provider>
  )
}

export const useErrorNotificationValue = () => {
  const notificationAndDispatch = useContext(ErrorNotificationContext)
  return notificationAndDispatch[0]
}

export const useErrorNotificationDispatch = () => {
  const notificationAndDispatch = useContext(ErrorNotificationContext)
  return notificationAndDispatch[1]
}

export default ErrorNotificationContext