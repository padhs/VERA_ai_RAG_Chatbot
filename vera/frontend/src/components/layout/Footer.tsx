'use client';

import React from 'react';
import Link from 'next/link';
import { FaGavel, FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Legal Domains', href: '/#domains' },
      { name: 'API Documentation', href: '/docs' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: FaGithub },
    { name: 'LinkedIn', href: '#', icon: FaLinkedin },
    { name: 'Twitter', href: '#', icon: FaTwitter },
  ];

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-200">
                <FaGavel className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors duration-200">
                  NyayAI
                </span>
                <span className="text-xs text-neutral-500 -mt-1">
                  Legal AI Assistant
                </span>
              </div>
            </Link>
            <p className="text-sm text-neutral-600 mb-4 max-w-xs">
              Empowering legal understanding through AI technology. Get instant, 
              accurate answers to your legal questions about Indian laws.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span>© {currentYear} NyayAI. Made with</span>
              <FaHeart className="text-red-500" size={14} />
              <span>for the legal community.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-600">
              <span>Powered by AI & Indian Legal Knowledge</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
