import React from 'react'
import { logout } from 'helpers/auth'
import Link from 'next/link'

type UserSettingsProps = {}

const UserSettings: React.FC<UserSettingsProps> = ({}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 text-center text-sm tracking-widest border-b border-gray-300'

  return (
    <React.Fragment>
      <span className="block text-center pt-10">
        More settings coming soon!
      </span>
      <div className="pt-10">
        <Link href="/accounts/edit">
          <a className={linkStyle}>Edit Profile</a>
        </Link>
        <button
          className={`${linkStyle} text-red-700`}
          onClick={() => logout(false)}
        >
          Log Out
        </button>
        <button
          className={`${linkStyle} text-red-700 border-none`}
          onClick={() => logout(true)}
        >
          Log Out Everywhere
        </button>
      </div>
    </React.Fragment>
  )
}

export default UserSettings
