import Link from 'next/link'

import { CurrentUserLoginCheckType } from 'requests/auth'

const PROFILE = require('images/chef-rj.svg')

type ProfileLinkProps = {
  currentUserInfo: CurrentUserLoginCheckType
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ currentUserInfo }) => {
  const { me } = currentUserInfo
  const { username, profileImageUrl } = me
  return (
    <h2>
      <Link href="/[username]" as={`/${username}`}>
        <a aria-label="RecipeJoiner create new recipe page">
          <img
            className="h-12 p-2 rounded-full text-gray-900 hover:text-gray-700 fill-current"
            src={profileImageUrl ? profileImageUrl : PROFILE}
          />
        </a>
      </Link>
    </h2>
  )
}

export default ProfileLink
