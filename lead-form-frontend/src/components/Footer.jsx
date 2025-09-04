import React from 'react'

const Footer = () => {
  return (
    <footer
      className="w-full border-t border-gray-800"
      style={{ backgroundColor: '#191919', height: '98px', flexShrink: 0 }}
    >
      <div className="h-full w-full p-0">
        <div className="h-full flex flex-row justify-between items-center w-full">
          <div className="mb-0 flex-shrink-0">
            <p
              className="text-white text-[18px] leading-[27px] font-normal whitespace-nowrap"
              style={{ fontFamily: '"Anek Latin", sans-serif', paddingLeft: 0, marginLeft: 0 }}
            >
              © 2025 Tandem. All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 flex-shrink-0" style={{paddingRight: 0, marginRight: 0}}>
            <div className="flex space-x-6">
              <a href="#" className="text-white transition-colors">
                Terms and Conditions
              </a>
              <a href="#" className="text-white transition-colors">
                Privacy policy
              </a>
              <a href="#" className="text-white transition-colors">
                Social Links
              </a>
            </div>

            <div className="flex space-x-4">
              {/* Social media icons */}
              <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-texthigh" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-texthigh" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800/50 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 text-texthigh" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.524 1.037 1.155 0 .703-.449 1.753-.68 2.729-.194.820.411 1.489 1.219 1.489 1.463 0 2.588-1.543 2.588-3.771 0-1.972-1.417-3.353-3.441-3.353-2.344 0-3.721 1.759-3.721 3.575 0 .708.273 1.467.614 1.88.067.081.077.152.057.235-.061.254-.196.793-.223.904-.035.146-.116.177-.268.107-1.001-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.287-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.978l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12.013 12.013 0 0 0 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
