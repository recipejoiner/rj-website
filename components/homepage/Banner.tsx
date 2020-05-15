function Banner() {
	return(
		<div className="bg-gray-100">
			{/* For medium screens */}
			<div className="lg:flex m-auto">
				<div className="hidden lg:block xl:hidden relative px-2 text-gray-900 w-1/2">
					<div className="py-24 pl-10 pr-5">
						<h1 className="font-semibold text-3xl lg:text-4xl leading-tight uppercase">Medical Equipment<br/>Made Easy</h1>
						<div className="mt-2 lg:mt-4 text-lg lg:text-2xl">
							<div>
								Offering quality medical equipment with in-house service at the best prices available.
							</div>
							<div className="lg:pt-4">
								Call us today at <a id="callnumber" href="tel:+18452742204" className="font-semibold underline"> +1 (845) 274-2204‬</a> for a quote!
							</div>
						</div>
					</div>
				</div>
				{/* Image */}
				<div className="relative pb-64 sm:pb-80 lg:pb-96 xl:pb-136 lg:w-1/2 xl:w-full">
					<img
						className="absolute h-full w-full object-cover"
						src={require('images/misc/rj-banner-1').src}
						srcSet={require('images/misc/rj-banner-1?resize&sizes[]=300&sizes[]=600&sizes[]=1000&sizes[]=1280&sizes[]=1920').srcSet}
						alt="Medical professional performing an ultrasound" 
					/>
				</div>
			</div>
			{/* For smaller screens and larger ones */}
			<div className="flex justify-center">
				<div className="relative bg-white px-2 text-gray-900 lg:hidden xl:block xl:w-256 xl:-m-32 xl:mb-1 xl:shadow-xl xl:rounded-lg xl:py-2">
					<div className="p-1 pt-6 pb-6">
						<h1 className="font-semibold text-3xl lg:text-4xl leading-tight uppercase text-center">Medical Equipment<br className="xl:hidden"/> Made Easy</h1>
						<div className="mt-2 lg:mt-4 text-lg lg:text-2xl text-center">
							<div>
								Offering quality medical equipment with in-house service at the best prices available.
							</div>
							<div className="lg:pt-4">
								Call us today at <a id="callnumber" href="tel:+18452742204" className="font-semibold underline"> +1 (845) 274-2204‬</a> for a quote!
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Banner;