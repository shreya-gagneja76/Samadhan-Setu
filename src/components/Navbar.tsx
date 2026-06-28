import React, { useState } from 'react';
import { TabName, UserProfile } from '../types';
import { Menu, X, Sun, Moon, Home, Camera, ClipboardList, Map, BarChart3, User, LogOut } from 'lucide-react';

interface NavbarProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  profile?: UserProfile | null;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode, 
  isAuthenticated, 
  onLogout,
  profile
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isInspector = profile?.role === 'inspector';

  const navigationItems = isInspector
    ? [
        { name: 'Home' as TabName, label: 'Inspector Portal', icon: Home },
        { name: 'Issues Feed' as TabName, label: 'Audit Desk', icon: ClipboardList },
        { name: 'Map View' as TabName, label: 'Ward Map', icon: Map },
        { name: 'Dashboard' as TabName, label: 'Analytics Insights', icon: BarChart3 },
        { name: 'Profile' as TabName, label: 'Official Profile', icon: User },
      ]
    : [
        { name: 'Home' as TabName, label: 'Home', icon: Home },
        { name: 'Report Issue' as TabName, label: 'Report Issue', icon: Camera },
        { name: 'Issues Feed' as TabName, label: 'Issues Feed', icon: ClipboardList },
        { name: 'Map View' as TabName, label: 'Map View', icon: Map },
        { name: 'Dashboard' as TabName, label: 'Dashboard', icon: BarChart3 },
        { name: 'Profile' as TabName, label: 'Profile', icon: User },
      ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          
          {/* Logo Brand Section */}
          <div className="flex items-center cursor-pointer" onClick={() => isAuthenticated && setActiveTab('Home')}>
            <div className="relative mr-3 w-11 h-11 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Orange Arc Circle */}
                <path
                  d="M 15,50 A 35,35 0 0,1 85,50"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                
                {/* City Skyline Background */}
                <rect x="25" y="30" width="8" height="20" fill="#94A3B8" />
                <rect x="35" y="20" width="10" height="30" fill="#64748B" />
                <rect x="47" y="15" width="12" height="35" fill="#475569" />
                <rect x="61" y="25" width="8" height="25" fill="#64748B" />
                <rect x="71" y="32" width="6" height="18" fill="#94A3B8" />
                
                {/* Bridge Rails and Floor */}
                <path d="M 10,54 Q 50,44 90,54" fill="none" stroke="#1B3A6B" strokeWidth="4.5" />
                <path d="M 10,50 Q 50,40 90,50" fill="none" stroke="#1B3A6B" strokeWidth="1.5" />
                
                {/* Bridge Railing Pillars */}
                <line x1="25" y1="46" x2="25" y2="52" stroke="#1B3A6B" strokeWidth="1" />
                <line x1="40" y1="44" x2="40" y2="50" stroke="#1B3A6B" strokeWidth="1" />
                <line x1="50" y1="43" x2="50" y2="49" stroke="#1B3A6B" strokeWidth="1" />
                <line x1="60" y1="44" x2="60" y2="50" stroke="#1B3A6B" strokeWidth="1" />
                <line x1="75" y1="46" x2="75" y2="52" stroke="#1B3A6B" strokeWidth="1" />
                
                {/* Three People Silhouettes on Bridge */}
                <circle cx="50" cy="33" r="3.5" fill="#FF6B35" />
                <path d="M 46,45 C 46,39 54,39 54,45 Z" fill="#FF6B35" />
                <path d="M 52,36 Q 56,28 58,29" fill="none" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
                
                <circle cx="41" cy="36" r="3" fill="#1B3A6B" />
                <path d="M 38,46 C 38,41 44,41 44,46 Z" fill="#1B3A6B" />
                
                <circle cx="59" cy="36" r="3" fill="#1B3A6B" />
                <path d="M 56,46 C 56,41 62,41 62,46 Z" fill="#1B3A6B" />
              </svg>
            </div>
            
            {/* Brand text */}
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-xl font-extrabold tracking-tight text-[#1B3A6B] dark:text-blue-400">Samadhan</span>
                <span className="text-xl font-extrabold tracking-tight text-[#FF6B35] ml-0.5">Setu</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide text-gray-500 dark:text-gray-400 mt-0.5 hidden xs:inline">
                Bridging Citizens to Solutions
              </span>
            </div>
          </div>

          {/* Desktop Control Panel */}
          <div className="flex items-center space-x-1 lg:space-x-3">
            {/* Desktop Navigation Link Tabs - ONLY if authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2 mr-2">
                {navigationItems.map((item) => {
                  const isActive = activeTab === item.name;
                  const IconComponent = item.icon;
                  return (
                    <button
                      id={`nav-item-${item.name.toLowerCase().replace(' ', '-')}`}
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`relative px-3 py-2 text-xs font-bold transition-all duration-150 rounded-lg flex items-center gap-1.5 focus:outline-none ${
                        isActive
                          ? 'text-[#FF6B35] bg-orange-50/50 dark:bg-orange-950/10'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <IconComponent size={14} className={isActive ? 'text-[#FF6B35]' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dark Mode Switcher */}
            <button
              id="theme-switcher-desktop"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
            </button>

            {/* Logout Prompt - ONLY if active session */}
            {isAuthenticated && (
              <button
                id="signout-button-desktop"
                onClick={onLogout}
                className="hidden md:flex items-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-700 hover:border-red-500/30 hover:bg-red-50/20 text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-lg text-xs font-bold focus:outline-none transition-all cursor-pointer"
                title="Log Out session"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}

            {/* Hamburger Button (Mobile Drawer) - ONLY if authenticated */}
            {isAuthenticated && (
              <button
                id="mobile-menu-burger"
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu on tab selector */}
      {isOpen && isAuthenticated && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800/80 animate-fadeIn px-2 pt-2 pb-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.name;
            const IconComponent = item.icon;
            return (
              <button
                id={`nav-item-mobile-${item.name.toLowerCase().replace(' ', '-')}`}
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold focus:outline-none ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-950/20 text-[#FF6B35] border-l-4 border-[#FF6B35]'
                    : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-950'
                }`}
              >
                <IconComponent size={16} className={isActive ? 'text-[#FF6B35]' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <button
            id="mobile-signout"
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50/10 focus:outline-none border-t border-slate-50 dark:border-slate-800/80 mt-2"
          >
            <LogOut size={16} />
            <span>Sign Out Session</span>
          </button>
        </div>
      )}
    </nav>
  );
}
