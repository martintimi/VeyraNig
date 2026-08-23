'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store/useStore';
import {
  ShoppingBag, Sparkles, Sun, Moon, SlidersHorizontal, User, LogOut,
  Bell, Check, Package, Star, ChevronRight
} from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    theme,
    toggleTheme,
    cart,
    setIsCartOpen,
    userAuth,
    logout,
    setSelectedGender,
    selectedGender,
    userNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifs = userNotifications.filter(n => !n.read).length;

  // Consumer shopper navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/studio', label: 'Outfit Studio', badge: 'Try On' },
    { href: '/shop', label: 'Shop Catalog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-xl transition-all">
      {/* 100% Full-Width Edge-to-Edge Navigation Bar (Taller & Larger Typography) */}
      <div className="w-full flex h-20 items-center justify-between px-4 sm:px-8 lg:px-12">
        
        {/* Left: Department Switch (Men / Women) & Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          
          {/* Department Switcher */}
          <div className="flex items-center gap-3.5 pr-5 border-r border-[var(--border-subtle)] font-mono-luxury text-sm uppercase tracking-wider">
            <button
              onClick={() => setSelectedGender('male')}
              className={`transition-colors font-bold text-sm ${
                selectedGender === 'male' ? 'text-[var(--gold-accent)] underline underline-offset-4' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Men
            </button>
            <span className="text-[var(--border-subtle)] font-light">/</span>
            <button
              onClick={() => setSelectedGender('female')}
              className={`transition-colors font-bold text-sm ${
                selectedGender === 'female' ? 'text-[var(--gold-accent)] underline underline-offset-4' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Women
            </button>
          </div>

          {/* Main Links */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm tracking-wider uppercase font-semibold transition-all py-1.5 ${
                    isActive
                      ? 'text-[var(--text-primary)] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono-luxury bg-[var(--gold-subtle)] text-[var(--gold-accent)] border border-[var(--gold-accent)]/30 font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Center: Brand Logo (Bigger & Grand) */}
        <div className="flex items-center justify-center">
          <Link href="/" className="group flex flex-col items-center">
            <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-[0.25em] text-[var(--text-primary)] group-hover:opacity-80 transition-opacity">
              VEYRA
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono-luxury tracking-[0.35em] text-[var(--gold-accent)] uppercase -mt-0.5 font-bold">
              Nigeria
            </span>
          </Link>
        </div>

        {/* Right Actions: Notifications + Theme Toggle + User Profile + Shopping Bag */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Light / Dark Mode Switcher */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--badge-bg)] transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-300 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 text-zinc-700 transition-transform hover:-rotate-12" />
              )}
            </button>
          )}

          {/* Interactive Notifications Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--badge-bg)] transition-colors"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[var(--bg-primary)] animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl surface-card border border-[var(--border-subtle)] shadow-2xl p-4 space-y-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono-luxury font-bold uppercase text-[var(--text-primary)]">
                      Notifications
                    </span>
                    {unreadNotifs > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold">
                        {unreadNotifs} new
                      </span>
                    )}
                  </div>

                  {unreadNotifs > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] font-mono-luxury text-[var(--gold-accent)] font-bold hover:underline uppercase"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {userNotifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        notif.read
                          ? 'bg-[var(--bg-primary)] border-[var(--border-subtle)] opacity-70'
                          : 'bg-[var(--bg-surface)] border-[var(--gold-accent)]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono-luxury text-[var(--text-muted)]">
                        <span className="font-bold text-[var(--text-primary)]">{notif.title}</span>
                        <span>{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] text-center">
                  <Link
                    href="/profile"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-mono-luxury text-[var(--gold-accent)] uppercase font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Orders & Reviews</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Dashboard Link */}
          {userAuth.isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] hover:border-[var(--gold-accent)] transition-all group shadow-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold-subtle)] text-[var(--gold-accent)] font-bold text-xs">
                  {userAuth.name.charAt(0)}
                </div>
                <span className="font-bold text-xs truncate max-w-[100px]">
                  {userAuth.name.split(' ')[0]}
                </span>
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--gold-accent)] transition-colors" />
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-full text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-luxury text-xs uppercase tracking-wider font-bold hover:opacity-90 transition-all shadow-md"
            >
              <User className="h-4 w-4" />
              <span>Sign In / Join</span>
            </Link>
          )}

          {/* Shopping Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center h-11 w-11 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all shadow-sm"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold-accent)] text-[11px] font-bold text-black shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-3 px-4 text-xs font-mono-luxury uppercase tracking-wider">
        <button
          onClick={() => setSelectedGender(selectedGender === 'male' ? 'female' : 'male')}
          className="text-[var(--gold-accent)] font-bold px-3 py-1.5 rounded-lg bg-[var(--badge-bg)]"
        >
          {selectedGender === 'male' ? "Men's Wear" : "Women's Wear"}
        </button>
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2.5 py-1.5 rounded transition-colors ${
                isActive ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
