import Link from 'next/link'
import DesktopDropdown from 'components/layout/header/desktop/DesktopDropdown'
import { CurrentUserLoginCheckType } from 'requests/auth'

type NavMenuDesktopProps = {
  closeMenus(): void
  testDropdownOpen: boolean
  setTestDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
  currentUserInfo: CurrentUserLoginCheckType
}

const NavMenuDesktop: React.FC<NavMenuDesktopProps> = ({
  closeMenus,
  testDropdownOpen,
  setTestDropdownOpen,
  currentUserInfo,
}) => {
  const linkStyle =
    'px-8 py-4 md:px-6 lg:px-10 block font-semibold hover:text-gray-700 uppercase text-sm tracking-widest h-full flex items-center'
  return (
    <nav
      className={`hidden md:block h-auto z-90 scrolling-auto scrolling-touch flex flex-no-wrap`}
    >
      <div className="m-auto flex whitespace-no-wrap">
        <Link href="/">
          <a
            onClick={() => {
              closeMenus()
            }}
            className={linkStyle}
          >
            Home
          </a>
        </Link>
        <Link href="/[username]" as={`/${currentUserInfo.me.username}`}>
          <a
            onClick={() => {
              closeMenus()
            }}
            className={linkStyle}
          >
            My Recipes
          </a>
        </Link>
        <DesktopDropdown
          linkStyle={linkStyle}
          closeMenus={closeMenus}
          menuOpen={testDropdownOpen}
          setMenuOpen={setTestDropdownOpen}
          menuName="Test Dropdown"
          menuLinks={[
            {
              href: '/#',
              link: '/#',
              title: 'Test Link 1',
            },
            {
              href: '/#',
              link: '/#',
              title: 'Test Link 2',
            },
            {
              href: '/#',
              link: '/#',
              title: 'Test Link 3',
            },
            {
              href: '/#',
              link: '/#',
              title: 'Test Link 4',
            },
          ]}
        />
        <Link href="/#" as="/#">
          <a
            onClick={() => {
              closeMenus()
            }}
            className={linkStyle}
          >
            Test Link 2
          </a>
        </Link>
        <Link href="/#" as="/#">
          <a
            onClick={() => {
              closeMenus()
            }}
            className={`hidden lg:block ${linkStyle}`}
          >
            Test Link 3
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default NavMenuDesktop
