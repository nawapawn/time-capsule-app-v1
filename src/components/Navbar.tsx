"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Search,
  PlusCircle,
  Bookmark,
  User,
  Menu,
  Settings,
  AlertCircle,
  LogOut,
  Bell,
} from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";

interface NavbarProps {
  onOpenCreateCapsule?: () => void;
  currentUser?: { name: string; avatar?: string };
}

const Logo = () => (
  <Link href="/home" className="cursor-pointer">
    <div className="flex items-center justify-center">
      <Image
        src="/export-removebg-preview.png"
        alt="Custom App Logo"
        width={40}
        height={40}
        className="w-full h-full object-contain"
      />
    </div>
  </Link>
);

export const Navbar = ({ onOpenCreateCapsule, currentUser }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/home");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { name: "Home", icon: Home, href: "/home" },
    { name: "Search", icon: Search, href: "/search" },
    { name: "Create", icon: PlusCircle }, // ไม่มี href เพราะเป็น modal
    { name: "Saved", icon: Bookmark, href: "/saved" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  const dropdownMenuItems = [
    { name: "Settings", icon: Settings, href: "/settings", isSeparator: true },
    { name: "Report Issue", icon: AlertCircle, href: "/report", isSeparator: true },
    { name: "Log Out", icon: LogOut, href: "/logout", isDestructive: true, isSeparator: false },
  ];

  const navLinkClass = (href?: string) => `
    flex flex-col items-center justify-center p-2 rounded-full
    text-gray-500 hover:bg-gray-100 hover:text-black
    ${activePath === href ? "text-black" : ""}
    transition-all duration-150 ease-in-out
  `;

  const iconClass = (href?: string) => `
    w-7 h-7 md:w-8 md:h-8
    ${activePath === href ? "scale-105" : "hover:scale-105"}
  `;

  const headerButtonClass =
    "p-2 rounded-full transition-colors duration-150 text-gray-500 hover:bg-gray-100 hover:text-black";

  const handleNavClick = (item: typeof navItems[number]) => {
    if (item.name === "Create" && onOpenCreateCapsule) {
      onOpenCreateCapsule(); // เปิด modal
    } else if (item.href) {
      setActivePath(item.href);
    }
  };

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 w-full h-14 z-40 flex items-center justify-between px-4 md:px-6 bg-white/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <div className="md:hidden flex items-center gap-2">
          <button className={headerButtonClass} title="Notifications">
            <Bell className="w-6 h-6" />
          </button>
          {currentUser && <ProfileAvatar src={currentUser.avatar} size={28} />}
        </div>

        <div className="md:hidden flex-1 flex justify-center absolute left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <button className={headerButtonClass} title="Notifications">
            <Bell className="w-6 h-6" />
          </button>
          {currentUser && <ProfileAvatar src={currentUser.avatar} size={32} />}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className={headerButtonClass} title="Menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-[70px] z-30 transition-transform duration-300">
        <div className="pt-4 pb-10 flex justify-center items-center">
          <Logo />
        </div>

        <div className="flex flex-col gap-10 items-center justify-center flex-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return item.name === "Create" && onOpenCreateCapsule ? (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={navLinkClass()}
                title={item.name}
                aria-label={item.name}
              >
                <IconComponent className={iconClass()} />
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href || "#"}
                onClick={() => handleNavClick(item)}
                className={navLinkClass(item.href)}
                title={item.name}
                aria-label={item.name}
              >
                <IconComponent className={iconClass(item.href)} />
              </Link>
            );
          })}
        </div>

        <div className="mb-6 mx-auto text-gray-500">
          <button onClick={toggleMenu} className={navLinkClass()} title="Menu">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full h-14 z-40 md:hidden bg-white/50 backdrop-blur-sm">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return item.name === "Create" && onOpenCreateCapsule ? (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={navLinkClass()}
                title={item.name}
                aria-label={item.name}
              >
                <IconComponent className={iconClass()} />
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href || "#"}
                onClick={() => handleNavClick(item)}
                className={navLinkClass(item.href)}
                title={item.name}
                aria-label={item.name}
              >
                <IconComponent className={iconClass(item.href)} />
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Dropdown Menu Overlay */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}></div>
          <div
            className="fixed top-14 right-4 md:top-auto md:bottom-6 md:left-20 
                          bg-white text-gray-800 p-4 rounded-xl shadow-2xl 
                          flex flex-col gap-1 z-50 w-64 md:w-80 border border-gray-200"
          >
            {dropdownMenuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded ${
                  item.isDestructive ? "text-red-500 hover:bg-red-100" : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <Link href={item.href}>{item.name}</Link>
                {item.isSeparator && <hr className="my-1 border-gray-200" />}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
