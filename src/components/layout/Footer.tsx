
import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-gray-900 py-8 border-t">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-purple-600">Lost & Found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Helping people reconnect with their lost belongings
            through our community-driven platform.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            </li>
            <li>
              <Link to="/lost-items" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Lost Items</Link>
            </li>
            <li>
              <Link to="/found-items" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Found Items</Link>
            </li>
            <li>
              <Link to="/report-lost" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Report an Item</Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
            </li>
            <li>
              <Link to="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
            </li>
            <li>
              <Link to="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Cookie Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">contact@lostandfound.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">(123) 456-7890</span>
            </li>
            <li className="flex items-center space-x-2">
              <Github className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <Link to="https://github.com" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">GitHub</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">© 2025 Lost & Found. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
