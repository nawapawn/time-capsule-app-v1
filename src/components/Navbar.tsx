"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Search,
  PlusCircle,
  Bookmark,
  User,
  Menu,
  LogOut,
  Bell,
  X,
} from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";

interface NavbarProps {
  onOpenCreateCapsule?: () => void;
  currentUser?: { name: string; avatar?: string };
}

const Logo = () => (
  <Link href="/home" aria-label="Home">
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

interface Notification {
  id: number;
  title: string;
  description: string;
  href?: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationModal = ({
  isOpen,
  onClose,
  notifications,
}: NotificationModalProps) => (
  <>
    <div
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-hidden="true"
    ></div>

    <div
      className={`fixed top-1/2 left-1/2 z-50 w-11/12 max-w-md h-[80vh] bg-white rounded-xl shadow-2xl p-4 flex flex-col transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        isOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 transition"
          aria-label="Close Notifications Modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No notifications</p>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="notification-item bg-white p-3 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:scale-105 hover:shadow-md"
            >
              {n.href ? (
                <Link href={n.href} className="block">
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  <p className="text-gray-600 text-sm">{n.description}</p>
                </Link>
              ) : (
                <>
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  <p className="text-gray-600 text-sm">{n.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);

const Navbar = ({ onOpenCreateCapsule, currentUser }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePath, setActivePath] = useState("/home");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) setNotifications(JSON.parse(stored));
    else {
      const initial: Notification[] = [
        {
          id: Date.now(),
          title: "Upcoming Capsule",
          description:
            "A capsule will open in a few days! Don't forget to open it together.",
        },
        {
          id: Date.now() + 1,
          title: "Friend's Capsule",
          description:
            "Your friend has scheduled a capsule opening. Join in soon!",
        },
        {
          id: Date.now() + 2,
          title: "New Comment",
          description: "Someone commented on your capsule! Check it out.",
        },
      ];
      setNotifications(initial);
      localStorage.setItem("notifications", JSON.stringify(initial));
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleModal = () => setModalOpen(!modalOpen);

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", icon: Home, href: "/home" },
    { name: "Search", icon: Search, href: "/search" },
    { name: "Create", icon: PlusCircle },
    { name: "Saved", icon: Bookmark, href: "/saved" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  const dropdownMenuItems = [
    { name: "Log Out", icon: LogOut, isDestructive: true },
  ];

  const navLinkClass = (href?: string) =>
    `flex flex-col items-center justify-center p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-black ${
      activePath === href ? "text-black" : ""
    } transition-all duration-150 ease-in-out`;

  const iconClass = (href?: string) =>
    `w-7 h-7 md:w-8 md:h-8 ${
      activePath === href ? "scale-105" : "hover:scale-105"
    }`;

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.name === "Create" && onOpenCreateCapsule) onOpenCreateCapsule();
    else if (item.href) setActivePath(item.href);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-14 z-40 flex items-center justify-between px-4 md:px-6 bg-white/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
        <div className="md:hidden flex items-center gap-2">
          <button
            className="p-2 rounded-full relative"
            aria-label="Notifications"
            onClick={toggleModal}
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          {currentUser && <ProfileAvatar src={currentUser.avatar} size={28} />}
        </div>

        <div className="md:hidden flex-1 flex justify-center absolute left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <button
            className="p-2 rounded-full relative"
            aria-label="Notifications"
            onClick={toggleModal}
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          {currentUser && <ProfileAvatar src={currentUser.avatar} size={32} />}
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Menu"
            className="p-2 rounded-full"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
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
                aria-label={item.name}
              >
                <IconComponent className={iconClass(item.href)} />
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-2 rounded-full text-red-500 hover:bg-red-100 transition-all duration-150"
          aria-label="Log Out"
          title="Log Out"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      {/* Dropdown */}
      <div
        className={`fixed top-14 right-4 md:top-auto md:bottom-6 md:left-20 z-50 w-64 md:w-80 transform transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
        }`}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="bg-white text-gray-800 p-4 rounded-xl shadow-2xl flex flex-col gap-1 border border-gray-200">
          {dropdownMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 text-left text-red-500 hover:bg-red-100`}
              role="menuitem"
              aria-label={item.name}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        notifications={notifications}
      />
    </>
  );
};

export default Navbar;
