// src/app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateCapsuleForm from "@/components/CreateCapsuleForm";
import { useState } from "react";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showCreateCapsule, setShowCreateCapsule] = useState(false);

  const NO_NAVBAR_PATHS = ["/login", "/signup"];
  const shouldShowNavbar = !NO_NAVBAR_PATHS.includes(pathname);


  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/public/export-removebg-preview.png" sizes="64x64" type="image/x-icon " />
      </head>
      <body>
        {/* Navbar */}
        {shouldShowNavbar && (
          <Navbar onOpenCreateCapsule={() => setShowCreateCapsule(true)} />
        )}

        {/* Page Content */}
        {children}

        {/* Create Capsule Modal */}
        {showCreateCapsule && (
          <CreateCapsuleForm
            onClose={() => setShowCreateCapsule(false)}
          />
        )}
      </body>
    </html>
  );
}
