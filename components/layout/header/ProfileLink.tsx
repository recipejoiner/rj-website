import Link from 'next/link'

import { CurrentUserLoginCheckType } from 'requests/auth'

const PROFILE = require('images/chef-rj.svg')

type LogoProps = {
  closeMenus(): void
  currentUserInfo: CurrentUserLoginCheckType
}

const Logo: React.FC<LogoProps> = ({ closeMenus, currentUserInfo }) => {
  return (
    // Logo, wrapped in an h2 tag
    <h2>
      <Link href="/[username]" as={`/${currentUserInfo.me.username}`}>
        {/* Need to close any open menus when navigating to another page, hence the onClick */}
        <a
          aria-label="RecipeJoiner create new recipe page"
          onClick={() => closeMenus()}
        >
          <img
            className="w-10 rounded-full p-1 text-gray-900 hover:text-gray-700 fill-current"
            src={PROFILE}
          />
        </a>
      </Link>
    </h2>
  )
}

export default Logo
