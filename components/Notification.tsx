import * as React from 'react'

type Notification = {}

const Notification: React.FC<Notification> = () => {
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

export default Notification
