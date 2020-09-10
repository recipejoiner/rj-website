function Banner() {
  return (
    <div className="bg-gray-100">
      {/* For medium screens */}
      <div className="lg:flex m-auto">
        <div className="hidden lg:block xl:hidden relative px-2 text-gray-900 w-1/2">
          <div className="py-24 pl-10 pr-5">
            <h1 className="font-semibold text-3xl lg:text-4xl leading-tight uppercase">
              RecipeJoiner:
              <br />A Chef's Home
            </h1>
            <div className="mt-2 lg:mt-4 text-lg lg:text-2xl">
              <div>
                The perfect place to keep and share whatever's going on in your
                kitchen.
              </div>
            </div>
          </div>
        </div>
        {/* Image */}
        <div className="relative pb-64 sm:pb-80 lg:pb-96 xl:pb-136 lg:w-1/2 xl:w-full"></div>
      </div>
      {/* For smaller screens and larger ones */}
      <div className="flex justify-center">
        <div className="relative bg-white px-2 text-gray-900 lg:hidden xl:block xl:w-256 xl:-m-32 xl:mb-1 xl:shadow-xl xl:rounded-lg xl:py-2">
          <div className="p-1 pt-6 pb-6">
            <h1 className="font-semibold text-3xl lg:text-4xl leading-tight uppercase text-center">
              RecipeJoiner:
              <br className="xl:hidden" />A Chef's Home
            </h1>
            <div className="mt-2 lg:mt-4 text-lg lg:text-2xl text-center">
              <div>
                The perfect place to keep and share whatever's going on in your
                kitchen.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
