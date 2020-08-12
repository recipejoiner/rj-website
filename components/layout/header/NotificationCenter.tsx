import * as React from 'react'

import AppOverlay from 'components/AppOverlay'
import Notification from 'components/Notification'

import client from 'requests/client'
import {
  UserNotificationsVarsType,
  USER_NOTIFICATIONS,
  NotificationNodeType,
  notificationConnectionNodeInit,
} from 'requests/users'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'

type NotificationCenter = {}

const NotificationCenter: React.FC<NotificationCenter> = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [newNotifications, setNewNotifications] = React.useState(false)

  return (
    <InfiniteScroll
      inModal={true}
      QUERY={USER_NOTIFICATIONS}
      hasJustConnection={false}
      nodeInit={notificationConnectionNodeInit}
      QueryVars={(() => {
        const queryVars: UserNotificationsVarsType = {
          cursor: null,
        }
        return queryVars
      })()}
    >
      {(edges: Array<EdgeType<NotificationNodeType>>) => (
        <ul>
          {edges.map((edge) => {
            return <Notification notificationNode={edge.node} />
          })}
        </ul>
      )}
    </InfiniteScroll>
  )
}

export default NotificationCenter
