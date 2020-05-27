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
      <svg className="w-10 p-1 fill-current" viewBox="0 0 189 117">
        {/* If the drawer is open, display the X. Otherwise, display the hamburger. */}
        {drawerOpen ? (
          <g id="UI-Icons" transform="translate(-476.000000, -72.000000)">
            <path
              d="M665.463756,76.25 C667.534824,79.8371947 666.30576,84.4241227 662.718566,86.4951905 L586.499182,130.499748 L662.718566,174.504809 C666.30576,176.575877 667.534824,181.162805 665.463756,184.75 C663.392688,188.337195 658.80576,189.566258 655.218566,187.495191 L571.499182,139.159748 L487.781434,187.495191 C484.19424,189.566258 479.607312,188.337195 477.536244,184.75 C475.465176,181.162805 476.69424,176.575877 480.281434,174.504809 L556.500182,130.499748 L480.281434,86.4951905 C476.69424,84.4241227 475.465176,79.8371947 477.536244,76.25 C479.607312,72.6628053 484.19424,71.4337417 487.781434,73.5048095 L571.500182,121.839748 L655.218566,73.5048095 C658.80576,71.4337417 663.392688,72.6628053 665.463756,76.25 Z"
              id="hamburger-x"
            />
          </g>
        ) : (
          <g id="UI-Icons" transform="translate(-258.000000, -72.000000)">
            <path
              d="M439.5,174 C443.642136,174 447,177.357864 447,181.5 C447,185.642136 443.642136,189 439.5,189 L265.5,189 C261.357864,189 258,185.642136 258,181.5 C258,177.357864 261.357864,174 265.5,174 L439.5,174 Z M439.5,123 C443.642136,123 447,126.357864 447,130.5 C447,134.642136 443.642136,138 439.5,138 L265.5,138 C261.357864,138 258,134.642136 258,130.5 C258,126.357864 261.357864,123 265.5,123 L439.5,123 Z M439.5,72 C443.642136,72 447,75.3578644 447,79.5 C447,83.6421356 443.642136,87 439.5,87 L265.5,87 C261.357864,87 258,83.6421356 258,79.5 C258,75.3578644 261.357864,72 265.5,72 L439.5,72 Z"
              id="hamburger"
            />
          </g>
        )}
      </svg>
    </button>
  )
}

export default HamburgerMenu
