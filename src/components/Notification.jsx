import { useNotificationValue } from "./NotificationContext"

const Notification = () => {

  const notification = useNotificationValue()

  return (
    <div>
      {notification === null ? 
        <p></p>
        :
        <div className="notification">
          {notification}
        </div>
      }
    </div>
  )
}

export default Notification