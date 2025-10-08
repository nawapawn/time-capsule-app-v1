// src/app/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreateCapsuleForm from "@/components/CreateCapsuleForm";
import { useState } from "react";
import { CapsuleProvider } from "@/context/CapsuleContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showCreateCapsule, setShowCreateCapsule] = useState(false);

  const NO_NAVBAR_PATHS = ["/login", "/signup"];
  const shouldShowNavbar = !NO_NAVBAR_PATHS.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/export-removebg-preview.png" type="image/png" />
        <link rel="shortcut icon" href="/export-removebg-preview.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>memory capsule</title>
      </head>
      <body>
        <CapsuleProvider>
          {shouldShowNavbar && (
            <Navbar onOpenCreateCapsule={() => setShowCreateCapsule(true)} />
          )}

          {children}

          {showCreateCapsule && (
            <CreateCapsuleForm onClose={() => setShowCreateCapsule(false)} />
          )}
        </CapsuleProvider>
      </body>
    </html>
  );
}
