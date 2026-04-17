import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="footer-v2 bg-[#0E0E0E] w-full pt-16 pb-8 border-t border-outline-variant/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-8 max-w-7xl mx-auto mb-16">
        <div className="col-span-2 md:col-span-1">
          <Logo iconSize="text-2xl" textSize="text-xl" className="mb-6" />
          <p className="text-[#F5FFF3]/50 text-sm leading-relaxed mb-6">High-performance trading infrastructure for professional asset managers and individual traders.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#F5FFF3]/50 hover:text-primary-container cursor-pointer transition-colors">hub</span>
            <span className="material-symbols-outlined text-[#F5FFF3]/50 hover:text-primary-container cursor-pointer transition-colors">terminal</span>
            <span className="material-symbols-outlined text-[#F5FFF3]/50 hover:text-primary-container cursor-pointer transition-colors">monitoring</span>
          </div>
        </div>
        <div>
          <h4 className="font-headline font-bold text-on-surface mb-6">Product</h4>
          <ul className="space-y-3">
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Features</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">MT4 Connector</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">MT5 Connector</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-bold text-on-surface mb-6">Resources</h4>
          <ul className="space-y-3">
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Documentation</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">API Docs</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Status Page</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-bold text-on-surface mb-6">Company</h4>
          <ul className="space-y-3">
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">About Us</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Legal</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Privacy Policy</a></li>
            <li><a className="text-[#F5FFF3]/50 hover:text-secondary-container transition-colors text-sm" href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="px-8 max-w-7xl mx-auto pt-8 border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#F5FFF3]/50 text-xs font-body antialiased uppercase tracking-widest">© 2024 TRADEMYPIPS Infrastructure. All rights reserved.</div>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-[10px] text-secondary-container">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            <span>ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
