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
        {/* ใช้ไฟล์เดียวกับ favicon และ shortcut icon */}
        <link rel="icon" href="/export-removebg-preview.png" type="image/png" />
        <link rel="shortcut icon" href="/export-removebg-preview.png" type="image/png" />

        {/* แนะนำเพิ่ม meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Time Capsule App</title>
      </head>
      <body>
        {shouldShowNavbar && (
          <Navbar onOpenCreateCapsule={() => setShowCreateCapsule(true)} />
        )}

        {children}

        {showCreateCapsule && (
          <CreateCapsuleForm onClose={() => setShowCreateCapsule(false)} />
        )}
      </body>
    </html>
  );
}
