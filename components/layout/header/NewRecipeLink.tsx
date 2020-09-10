import Link from 'next/link'

const PLUS = require('images/icons/plus.svg')

type LogoProps = {}

const Logo: React.FC<LogoProps> = () => {
  return (
    // Logo, wrapped in an h2 tag
    <h2>
      <Link href="/recipes/new">
        <a aria-label="RecipeJoiner create new recipe page">
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
