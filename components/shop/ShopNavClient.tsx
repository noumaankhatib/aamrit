"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/shop/Icon";

const NAV_LINKS = [
  { href: "/shop", label: "Buy Mangoes" },
  { href: "/#varieties", label: "Varieties" },
  { href: "/#farms", label: "Our Farms" },
  { href: "/#process", label: "Process" },
  { href: "/#b2b", label: "Business" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQs" },
  { href: "/blog", label: "Blog" },
];

interface User {
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
}

export default function ShopNavClient({
  cartCount,
  user,
}: {
  cartCount: number;
  user: User | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Click outside to close account dropdown
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) {
      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }
  }, [accountOpen]);

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <>
      {/* Free Delivery Banner */}
      <div className="bg-gradient-to-r from-leaf to-leaf-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Free Delivery All Over India · Maharashtra 4-5 Days · Other States 8-9 Days
        </span>
      </div>
      
      <header
        className={`sticky top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled ? "shadow-e2" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
          <nav className="backdrop-blur-xl bg-white/85 border border-cream-100/80 shadow-e1 rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
              <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full grad-gold-rich shadow-glow ring-1 ring-saffron/30">
                <svg className="w-4 h-4 text-white" aria-hidden="true">
                  <use href="#i-mango" />
                </svg>
              </span>
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-charcoal">
                Aamrit
              </span>
              <span className="hidden md:inline-block ml-1 px-2 py-0.5 rounded-full bg-cream-100 text-saffron-700 text-[10px] font-semibold tracking-wider uppercase">
                By Yeskay
              </span>
            </Link>

            {/* Desktop center links */}
            <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-charcoal/80">
              {NAV_LINKS.map((l) => {
                const isActive =
                  l.href === "/shop"
                    ? pathname === "/shop" || pathname.startsWith("/shop/")
                    : false;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`relative transition-colors hover:text-saffron after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-gold after:transition-all after:duration-300 ${
                        isActive ? "text-saffron after:w-full" : "after:w-0 hover:after:w-full"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right cluster */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                aria-label="Search"
                onClick={() => setSearchOpen((s) => !s)}
                className="hidden sm:inline-flex w-10 h-10 items-center justify-center rounded-full text-charcoal/80 hover:bg-cream-100 hover:text-charcoal transition-colors cursor-pointer"
              >
                <Icon name="search" className="w-5 h-5" />
              </button>

              {/* Account */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  aria-label="Account"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((s) => !s)}
                  className="hidden sm:inline-flex w-10 h-10 items-center justify-center rounded-full text-charcoal/80 hover:bg-cream-100 hover:text-charcoal transition-colors cursor-pointer overflow-hidden"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <Icon name="user" className="w-5 h-5" />
                  )}
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-cream-100 shadow-e3 p-2 z-50"
                    >
                      {user ? (
                        <>
                          <div className="px-3 py-2.5 border-b border-cream-100 mb-1">
                            <p className="text-sm font-medium text-charcoal">
                              {user.name || "Welcome"}
                            </p>
                            <p className="text-xs text-charcoal/60 truncate">
                              {user.email}
                            </p>
                          </div>
                          {user.isAdmin && (
                            <MenuLink href="/admin" icon="spark" label="Admin Dashboard" highlight />
                          )}
                          <MenuLink href="/account" icon="user" label="My Account" />
                          <MenuLink href="/account?tab=orders" icon="package" label="My Orders" />
                          <MenuLink href="/account?tab=addresses" icon="spark" label="Addresses" />
                          <div className="border-t border-cream-100 mt-1 pt-1">
                            <form action="/api/auth/logout" method="POST">
                              <button
                                type="submit"
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Icon name="close" className="w-4 h-4" />
                                Sign out
                              </button>
                            </form>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-3 py-2.5 border-b border-cream-100 mb-1">
                            <p className="text-sm font-medium text-charcoal">
                              Welcome to Aamrit
                            </p>
                            <p className="text-xs text-charcoal/60">
                              Sign in to track orders
                            </p>
                          </div>
                          <MenuLink href="/account/login" icon="user" label="Sign in" highlight />
                          <MenuLink href="/account/register" icon="spark" label="Create account" />
                          <MenuLink href="/shop" icon="spark" label="Browse products" />
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={`Cart (${cartCount} items)`}
                className="relative inline-flex w-10 h-10 items-center justify-center rounded-full text-charcoal/90 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <Icon name="cart" className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center bg-gold-400 text-white text-[10px] font-semibold rounded-full ring-2 ring-white"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Order Now (desktop only, replaces homepage CTA) */}
              <Link
                href="/shop"
                className="hidden sm:inline-flex ml-1 items-center gap-1.5 btn-gold text-white text-sm font-semibold px-4 py-2 rounded-full cursor-pointer"
              >
                Order
                <Icon name="arrow-right" className="w-4 h-4" />
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((s) => !s)}
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-cream-200 bg-white cursor-pointer"
              >
                <Icon name={mobileOpen ? "close" : "menu"} className="w-5 h-5 text-charcoal" />
              </button>
            </div>
          </nav>

          {/* Search bar (slides under navbar) */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={onSearchSubmit}
                  className="mt-2 backdrop-blur-xl bg-white/95 border border-cream-100 shadow-e1 rounded-2xl px-4 py-3 flex items-center gap-3"
                >
                  <Icon name="search" className="w-5 h-5 text-charcoal/50 flex-shrink-0" />
                  <input
                    name="q"
                    autoFocus
                    placeholder="Search Alphonso, Kesar, blends…"
                    className="flex-1 bg-transparent outline-none text-charcoal placeholder:text-charcoal/40"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                    className="text-charcoal/60 hover:text-charcoal cursor-pointer"
                  >
                    <Icon name="close" className="w-5 h-5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden mt-2 backdrop-blur-xl bg-white/95 border border-cream-100 shadow-e2 rounded-2xl p-4"
              >
                <form onSubmit={onSearchSubmit} className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-cream-50 border border-cream-100">
                  <Icon name="search" className="w-4 h-4 text-charcoal/50" />
                  <input
                    name="q"
                    placeholder="Search products"
                    className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-charcoal/40"
                  />
                </form>

                <ul className="grid gap-1 text-charcoal font-medium mb-3">
                  {NAV_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-cream-100 transition-colors"
                      >
                        <span>{l.label}</span>
                        <Icon name="chevron-right" className="w-4 h-4 text-charcoal/40" />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-cream-100 pt-3 grid gap-1">
                  {user ? (
                    <>
                      <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-medium text-charcoal">{user.name}</p>
                        <p className="text-xs text-charcoal/60 truncate">{user.email}</p>
                      </div>
                      {user.isAdmin && (
                        <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-cream-100">
                          <Icon name="spark" className="w-4 h-4 text-saffron" />
                          <span className="text-sm text-saffron font-medium">Admin</span>
                        </Link>
                      )}
                      <Link href="/account" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-cream-100">
                        <Icon name="package" className="w-4 h-4 text-charcoal/70" />
                        <span className="text-sm">My Account</span>
                      </Link>
                      <form action="/api/auth/logout" method="POST">
                        <button
                          type="submit"
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-red-50 text-red-600"
                        >
                          <Icon name="close" className="w-4 h-4" />
                          <span className="text-sm">Sign out</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link href="/account/login" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-cream-100">
                        <Icon name="user" className="w-4 h-4 text-saffron" />
                        <span className="text-sm text-saffron font-medium">Sign in</span>
                      </Link>
                      <Link href="/account/register" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-cream-100">
                        <Icon name="spark" className="w-4 h-4 text-charcoal/70" />
                        <span className="text-sm">Create account</span>
                      </Link>
                    </>
                  )}
                  <Link href="/cart" className="flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-cream-100">
                    <Icon name="cart" className="w-4 h-4 text-charcoal/70" />
                    <span className="text-sm">Cart {cartCount > 0 ? `(${cartCount})` : ""}</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

function MenuLink({
  href,
  icon,
  label,
  highlight,
}: {
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
        highlight
          ? "text-saffron-700 hover:bg-cream-100 font-medium"
          : "text-charcoal/80 hover:bg-cream-100 hover:text-charcoal"
      }`}
      role="menuitem"
    >
      <Icon name={icon} className="w-4 h-4" />
      {label}
    </Link>
  );
}
