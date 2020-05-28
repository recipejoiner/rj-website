import * as React from 'react'
import Link from 'next/link'

interface MenuLink {
  href: string
  link: string
  title: string
}

interface DDProps {
  linkStyle: string
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  closeMenus(): void
  menuName: string
  menuLinks: Array<MenuLink>
}

const DesktopDropdown: React.FC<DDProps> = ({
  linkStyle,
  menuOpen,
  setMenuOpen,
  closeMenus,
  menuName,
  menuLinks,
}) => {
  const [yPos, setYPos] = React.useState(0)
  const [closedWithBGClick, setClosedWithBGClick] = React.useState(false)

  // Closing the menu by clicking the background resets the yPos to 0, so need to do this
  // This will run every time that closedWithBGClick is changed
  React.useEffect(() => {
    if (closedWithBGClick) {
      window.scrollTo(0, yPos)
      setClosedWithBGClick(false)
    }
  }, [closedWithBGClick])

  return (
    // Make this menu on top if it's open - this is to stop multiple dropdown menus from being opened at the same time
    <div className={`relative ${menuOpen ? 'z-100' : ''}`}>
      <button
        // This button has z-10 so that when it's open, it goes above that large overlay closeMenus button
        className={`${linkStyle} focus:outline-none relative z-10`}
        onClick={() => (menuOpen ? setMenuOpen(false) : setMenuOpen(true))}
      >
        {menuName}
        <svg className="h-5 w-5 fill-current inline-block" viewBox="0 0 32 32">
          {menuOpen ? (
            // The right/down chevrons
            <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" />
          ) : (
            <path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z" />
          )}
        </svg>
      </button>
      {/* This button takes up the entire screen (behind the dropdown) when the dropdown is open, so that
			the menu closes if the user clicks outside of the menu. tabIndex -1 stops users from tabbing to this button. */}
      <button
        className={`${
          menuOpen ? '' : 'hidden'
        } fixed inset-0 w-full h-full cursor-default`}
        onClick={() => {
          setYPos(window.pageYOffset)
          closeMenus()
          setClosedWithBGClick(true)
        }}
        tabIndex={-1}
      />
      <div
        className={`${
          menuOpen ? 'block' : 'hidden'
        } absolute bg-white shadow-xl rounded-b py-3`}
      >
        {menuLinks.map((link) => {
          return (
            <Link href={link.href} as={link.link} key={link.title}>
              <a
                // Need to close any open menus when navigating to another page, hence the onClick
                onClick={() => closeMenus()}
                className="px-6 py-3 block hover:text-white hover:bg-gray-900 text-sm tracking-widest"
              >
                {link.title}
              </a>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default DesktopDropdown
