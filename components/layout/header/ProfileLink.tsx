import Link from 'next/link'

import { CurrentUserLoginCheckType } from 'requests/auth'

const PROFILE = require('images/chef-rj.svg')

type ProfileLinkProps = {
  closeMenus(): void
  currentUserInfo: CurrentUserLoginCheckType
}

const ProfileLink: React.FC<ProfileLinkProps> = ({
  closeMenus,
  currentUserInfo,
}) => {
  const { me } = currentUserInfo
  const { username, profileImageUrl } = me
  return (
    <h2>
      <Link href="/[username]" as={`/${username}`}>
        {/* Need to close any open menus when navigating to another page, hence the onClick */}
        <a
          aria-label="RecipeJoiner create new recipe page"
          onClick={() => closeMenus()}
        >
          <img
            className="w-10 rounded-full p-1 text-gray-900 hover:text-gray-700 fill-current"
            src={profileImageUrl ? profileImageUrl : PROFILE}
          />
        </a>
      </Link>
    </h2>
  )
}

export default ProfileLink
