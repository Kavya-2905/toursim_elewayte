import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { HiOutlineGlobe } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <HiOutlineGlobe className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white font-heading">
                Travel<span className="text-primary-400">Ease</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your AI-powered travel companion. Discover amazing destinations, plan perfect trips, and create unforgettable memories with TravelEase.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-all hover:scale-110">
                  <Icon size={16} className="text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Destinations', path: '/destinations' },
                { name: 'Hotels', path: '/hotels' },
                { name: 'Travel Packages', path: '/packages' },
                { name: 'Budget Planner', path: '/budget-planner' },
                { name: 'Travel Blogs', path: '/blogs' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {['About Us', 'Contact Us', 'FAQs', 'Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-sm">Raichur, Karnataka 584102, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">+91 9187099952</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-400 flex-shrink-0" />
                <span className="text-sm">kavyachandrashekhar29@gmail.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white text-sm font-medium mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-r-lg hover:opacity-90 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} TravelEase. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-primary-400">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary-400">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
