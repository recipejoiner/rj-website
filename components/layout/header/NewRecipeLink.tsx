import Link from 'next/link'

const PLUS = require('images/icons/plus.svg')

type LogoProps = {
  closeMenus(): void
}

const Logo: React.FC<LogoProps> = ({ closeMenus }) => {
  return (
    // Logo, wrapped in an h2 tag
    <h2>
      <Link href="/recipes/new">
        {/* Need to close any open menus when navigating to another page, hence the onClick */}
        <a
          aria-label="RecipeJoiner create new recipe page"
          onClick={() => closeMenus()}
        >
          <img
            className="w-10 p-1 text-gray-900 hover:text-gray-700 fill-current"
            src={PLUS}
          />
        </a>
      </Link>
    </h2>
  )
}

export default Logo
