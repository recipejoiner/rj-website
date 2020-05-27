import Link from 'next/link'
import MobileDropdown from 'components/layout/header/mobile/MobileDropdown'

type NavMenuMobileProps = {
  closeMenus(): void
  testDropdownOpen: boolean
  setTestDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavMenuMobile: React.FC<NavMenuMobileProps> = ({
  closeMenus,
  testDropdownOpen,
  setTestDropdownOpen,
}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 uppercase text-sm tracking-widest border-b border-gray-300'
  return (
    <nav
      className={`mt-14 bg-gray-100 md:bg-white md:flex fixed inset-0 h-full md:h-6 z-90 overflow-auto scrolling-auto inset-0 scrolling-touch`}
    >
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
      <Link href="/#" as="/#">
        <a
          onClick={() => {
            closeMenus()
          }}
          className={linkStyle}
        >
          Test Link 1
        </a>
      </Link>
      <MobileDropdown
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
          className={linkStyle}
        >
          Test Link 3
        </a>
      </Link>
    </nav>
  )
}

export default NavMenuMobile
