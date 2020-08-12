import * as React from 'react'

import AppOverlay from 'components/AppOverlay'
import Notification from 'components/Notification'

type NotificationCenter = {}

const NotificationCenter: React.FC<NotificationCenter> = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [newNotifications, setNewNotifications] = React.useState(false)

  return <Notification />
}

export default NotificationCenter
