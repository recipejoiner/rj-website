import * as React from 'react'
import Skeleton from 'react-loading-skeleton'

import { NotificationNodeType, CommentNotificationType } from 'requests/users'
import Link from 'next/link'
import ScreenContext from 'helpers/ScreenContext'
const PROFILE = require('images/chef-rj.svg')

interface NotificationProps {
  notificationNode: NotificationNodeType
}

const Notification: React.FC<NotificationProps> = ({ notificationNode }) => {
  const { setNotificationsState } = React.useContext(ScreenContext)

  if (notificationNode && notificationNode.notifiable) {
    let note = notificationNode.notifiable
    if (note.__typename == 'Comment') {
      return (
        <div className="bg-gray-200 p-3 rounded my-3" id={notificationNode.id}>
          <div className="flex align-middle whitespace-no-wrap">
            <User
              username={note.by.username}
              profileImageUrl={note.by.profileImageUrl}
            />
            <span className="font-bold"> &nbsp;commented</span>
            <span> &nbsp;on your</span>
            {note.__typename === 'Comment' ? (
              <span className="">&nbsp;comment &nbsp;</span>
            ) : (
              <span>&nbsp;recipe</span>
            )}
          </div>
          {note.commentable.__typename === 'Comment' ? (
            <div className="truncate italic">{note.commentable.content}</div>
          ) : (
            <Link
              href="/[username]/[recipehandle]"
              as={`/${note.commentable.by.username || '#'}/${
                note.commentable.handle || '#'
              }`}
            >
              <a
                className="contents"
                onClick={() =>
                  setNotificationsState ? setNotificationsState(false) : null
                }
              >
                <span className="truncate underline">
                  <span className="">
                    {note.commentable.title || <Skeleton width={40} />}
                  </span>
                </span>
              </a>
            </Link>
          )}
        </div>
      )
    } else if (note.__typename == 'Reaction') {
      return (
        <div className="bg-gray-200 p-3 rounded my-3">
          <div className="flex align-middle whitespace-no-wrap">
            <User
              username={note.by.username}
              profileImageUrl={note.by.profileImageUrl}
            />
            <span className="font-bold">
              {' '}
              &nbsp;{note.reactionType === '0' ? 'yummed' : 'liked'}
            </span>
            <span> &nbsp;your</span>
            {note.reactable.__typename === 'Comment' ? (
              <span className="">&nbsp;comment &nbsp;</span>
            ) : (
              <span>&nbsp;recipe</span>
            )}
          </div>
          {note.reactable.__typename === 'Comment' ? (
            <div className="truncate italic">{note.reactable.content}</div>
          ) : (
            <Link
              href="/[username]/[recipehandle]"
              as={`/${note.reactable.by.username || '#'}/${
                note.reactable.handle || '#'
              }`}
            >
              <a
                className="contents"
                onClick={() =>
                  setNotificationsState ? setNotificationsState(false) : null
                }
              >
                <span className="truncate underline">
                  <span className="">
                    {note.reactable.title || <Skeleton width={40} />}
                  </span>
                </span>
              </a>
            </Link>
          )}
        </div>
      )
    } else if (note.__typename == 'UserRelationship') {
      return (
        <div className="flex align-middle rounded bg-gray-200 p-3 my-3">
          <User
            username={note.follower.username}
            profileImageUrl={note.follower.profileImageUrl}
          />
          <span className="font-bold"> &nbsp;followed</span>
          <span> &nbsp;you</span>
        </div>
      )
    } else if (notificationNode.notifiable.__typename == 'Saved') {
      return (
        <div className="bg-gray-200 p-3 rounded my-3">
          <div className="flex align-middle whitespace-no-wrap">
            <User
              username={note.by.username}
              profileImageUrl={note.by.profileImageUrl}
            />
            <span className="font-bold"> &nbsp;saved</span>
            <span> &nbsp;your recipe</span>
          </div>
          <Link
            href="/[username]/[recipehandle]"
            as={`/${note.saveable.by.username || '#'}/${
              note.saveable.handle || '#'
            }`}
          >
            <a
              className="contents"
              onClick={() =>
                setNotificationsState ? setNotificationsState(false) : null
              }
            >
              <span className="truncate underline">
                <span className="">
                  {note.saveable.title || <Skeleton width={40} />}
                </span>
              </span>
            </a>
          </Link>
        </div>
      )
    } else {
      return <span className="block py-2 text-red-500"></span>
    }
  } else {
    return <Skeleton />
  }
}

interface CommentNotificationProps {
  commentNotification: CommentNotificationType
}

interface UserProps {
  username: string
  profileImageUrl: string
}
const User: React.FC<UserProps> = ({ username, profileImageUrl }) => {
  const { setNotificationsState } = React.useContext(ScreenContext)

  return (
    <Link href="/[username]" as={`/${username}`}>
      <a
        className="contents"
        onClick={() =>
          setNotificationsState ? setNotificationsState(false) : null
        }
      >
        <img
          src={profileImageUrl || PROFILE}
          className="h-6 w-6 cursor-pointer rounded-full"
        />
        <span className=" ml-2">
          <span className="">{username || <Skeleton width={40} />}</span>
        </span>
      </a>
    </Link>
  )
}

export default Notification
