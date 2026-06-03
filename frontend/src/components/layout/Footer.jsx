import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-dark text-white border-t border-outline/10 py-10 mt-auto shadow-inner">
      <div className="max-w-containerMax mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Ministry */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base tracking-wide text-white uppercase">Bharat Digital Census</h4>
          </div>
          <p className="text-xs text-outlineVariant leading-relaxed">
            The national digital portal for secure, accurate, and comprehensive citizen data documentation. 
            All stored details are protected under the Census Act and National Encryption standards.
          </p>
          <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold mt-2">
            <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL Layered
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3 md:items-center">
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-secondary mb-2">Legal &amp; Information</h4>
            <ul className="space-y-2 text-xs text-outlineVariant">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Security Declaration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility Statement</a></li>
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-xs tracking-wider uppercase text-secondary">Helpline Support</h4>
          <p className="text-xs text-outlineVariant leading-relaxed">
            For filing assistance, OTP issues, or registration queries:
          </p>
          <div className="text-sm font-bold text-white mt-1">
            Toll Free: 1800-11-2026
          </div>
          <p className="text-[10px] text-outlineVariant">Available 24/7 in English, Hindi, and 12 regional languages.</p>
        </div>

      </div>

      <div className="max-w-containerMax mx-auto px-6 mt-8 pt-6 border-t border-outline/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-outlineVariant gap-4">
        <div>
          © {currentYear} Ministry of Home Affairs, Government of India.
        </div>
        <div className="text-right">
          Designed and developed in compliance with National Informatics guidelines.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
