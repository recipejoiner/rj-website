import * as React from 'react'
import Link from 'next/link'

interface MenuLink {
  href: string
  link: string
  title: string
}

interface MDProps {
  linkStyle: string
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  closeMenus(): void
  menuName: string
  menuLinks: Array<MenuLink>
}

const MobileDropdown: React.FC<MDProps> = ({
  linkStyle,
  menuOpen,
  setMenuOpen,
  closeMenus,
  menuName,
  menuLinks,
}) => {
  return (
    <React.Fragment>
      <button
        className={`${linkStyle} flex items-center justify-between focus:outline-none`}
        onClick={() => (menuOpen ? setMenuOpen(false) : setMenuOpen(true))}
      >
        {menuName}
        <svg className="h-5 w-5 fill-current" viewBox="0 0 32 32">
          {menuOpen ? (
            // The right/down chevrons
            <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" />
          ) : (
            <path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z" />
          )}
        </svg>
      </button>
      <div
        className={`${menuOpen ? 'block' : 'hidden'} border-b border-gray-300`}
      >
        {menuLinks.map((link) => {
          return (
            <Link href={link.href} as={link.link} key={link.title}>
              <a
                // Need to close any open menus when navigating to another page, hence the onClick
                onClick={() => closeMenus()}
                className="px-12 py-3 block hover:text-gray-700 text-sm tracking-widest"
              >
                {link.title}
              </a>
            </Link>
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default MobileDropdown
