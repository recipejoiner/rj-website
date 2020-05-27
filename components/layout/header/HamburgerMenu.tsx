type HamburgerMenuProps = {
  drawerOpen: boolean
  setDrawerOpen(status: boolean): void
  closeMenus(): void
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  drawerOpen,
  setDrawerOpen,
  closeMenus,
}) => {
  return (
    // {/* Need to close any open menus when navigating to another page, hence the onClick */}
    <button
      type="button"
      title="Menu toggle"
      className="block text-black hover:text-gray-500 focus:text-gray-500 focus:outline-none"
      onClick={() =>
        drawerOpen ? closeMenus() : (closeMenus(), setDrawerOpen(true))
      }
    >
      <svg className="w-10 fill-current" viewBox="0 0 24 24">
        {/* If the drawer is open, display the X. Otherwise, display the hamburger. */}
        {drawerOpen ? (
          <path d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
        ) : (
          <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
        )}
      </svg>
    </button>
  )
}

export default HamburgerMenu
