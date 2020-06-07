import React from 'react'
import { logout } from 'helpers/auth'
import Link from 'next/link'

type UserSettingsProps = {}

const UserSettings: React.FC<UserSettingsProps> = ({}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 uppercase text-sm tracking-widest border-b border-gray-300'

  return (
    <React.Fragment>
      <span className="block text-center">More settings coming soon!</span>
      <div className="pt-10">
        <button
          className={`${linkStyle} text-red-700`}
          onClick={() => logout(false)}
        >
          log out
        </button>
        <button
          className={`${linkStyle} text-red-700 border-none`}
          onClick={() => logout(true)}
        >
          log out everywhere
        </button>
      </div>
    </React.Fragment>
  )
}

export default UserSettings
