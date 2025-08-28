"use client";
import Link from "next/link";
import LoginModal from "../components/loginModal";
import { useAuthStore } from "../app/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      setShowLogin(true);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user]);
  
  return (
    <>
      <nav className="space-x-3 mb-6">
        <Link
          className="btn"
          href="/events"
          onClick={(e) => handleProtectedClick(e, "/events")}
        >
          Events
        </Link>
        <Link
          className="btn btn-primary"
          href="/events/new"
          onClick={(e) => handleProtectedClick(e, "/events/new")}
        >
          Create Event
        </Link>
        {user && (
          <Link
            className="btn"
            href="/"
            onClick={(e) => {
              handleProtectedClick(e, "/");
              logout();
            }}
          >
            LogOut
          </Link>
        )}
      </nav>
    
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
