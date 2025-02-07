import { useErrorNotificationValue } from "./ErrorNotificationContext"

const ErrorNotification = () => {
  
  const errorNotification = useErrorNotificationValue()

  return (
    <div>
      {errorNotification === null ?
      <p></p>
      :
      <div className="error">
        {errorNotification}
      </div>
      }
    </div>
  )
}

export default ErrorNotification