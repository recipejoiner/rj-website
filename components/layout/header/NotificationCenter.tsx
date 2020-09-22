import * as React from 'react'

import Notification from 'components/Notification'

import {
  UserNotificationsVarsType,
  USER_NOTIFICATIONS,
  NotificationNodeType,
  notificationConnectionNodeInit,
  NEW_USER_NOTIFICATION_SUBSCRIPTIONS,
} from 'requests/users'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'

type NotificationCenter = {}

const NotificationCenter: React.FC<NotificationCenter> = () => {
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
      hasSubscription={true}
      subscriptionRequest={NEW_USER_NOTIFICATION_SUBSCRIPTIONS}
    >
      {(edges: Array<EdgeType<NotificationNodeType>>) => (
        <ul>
          {edges.map((edge) => {
            return (
              <Notification key={edge.cursor} notificationNode={edge.node} />
            )
          })}
        </ul>
      )}
    </InfiniteScroll>
  )
}

export default NotificationCenter
