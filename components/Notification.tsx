import * as React from 'react'
import Skeleton from 'react-loading-skeleton'

import { NotificationNodeType, CommentNotificationType } from 'requests/users'

interface NotificationProps {
  notificationNode: NotificationNodeType
}

const Notification: React.FC<NotificationProps> = ({ notificationNode }) => {
  if (notificationNode && notificationNode.notifiable) {
    if (notificationNode.notifiable.__typename == 'Comment') {
      return (
        <CommentNotification
          commentNotification={notificationNode.notifiable}
        />
      )
    } else if (notificationNode.notifiable.__typename == 'Reaction') {
      return <span className="block py-2">is a reaction</span>
    } else if (notificationNode.notifiable.__typename == 'UserRelationship') {
      return <span className="block py-2">is a relationship</span>
    } else if (notificationNode.notifiable.__typename == 'Saved') {
      return <span className="block py-2">is a saved</span>
    } else {
      return (
        <span className="block py-2 text-red-500">
          is an unhandled notification
        </span>
      )
    }
  } else {
    return <Skeleton />
  }
}

const BlankComment: React.FC = ({}) => {
  return (
    <React.Fragment>
      <div className="inline-flex space-x-3 border-b border-gray-300 w-full py-2">
        <div>User</div>
        <div>Actioned</div>
        <div>Locations</div>
      </div>
    </React.Fragment>
  )
}

interface CommentNotificationProps {
  commentNotification: CommentNotificationType
}
const CommentNotification: React.FC<CommentNotificationProps> = ({
  commentNotification,
}) => {
  const commentable =
    commentNotification.commentable.__typename == 'Comment' ? (
      <span>{commentNotification.commentable.content}</span>
    ) : (
      <span>{commentNotification.commentable.title}</span>
    )
  return (
    <div>
      <span>
        {commentNotification.by.username} commented on your{' '}
        {commentNotification.commentable.__typename}, {commentable}
      </span>
    </div>
  )
}

export default Notification
