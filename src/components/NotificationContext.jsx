import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch(action.type) {
    case "LOGIN":
      return action.payload
    case "LOGOUT":
      return action.payload
    case "SIGNUP":
      return action.payload
    case "DELETE_ACCOUNT":
      return action.payload
    case "LIKE":
      return action.payload
    case "CREATE":
      return action.payload
    case "DELETE":
      return action.payload
    case "CLEAR":
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={ [notification, notificationDispatch] }>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext