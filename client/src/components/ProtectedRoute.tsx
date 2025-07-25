"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken, refreshToken, getRefreshToken } from "../lib/auth";
import axios from "axios";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setIsAuthenticated(false);
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        await axios.get("http://localhost:3001/employees", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.status === 401) {
          const refreshTokenValue = getRefreshToken();
          if (refreshTokenValue) {
            try {
              const { accessToken: newAccessToken } =
                await refreshToken(refreshTokenValue);
              localStorage.setItem("accessToken", newAccessToken);
              setIsAuthenticated(true);
            } catch {
              setIsAuthenticated(false);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              router.push("/login");
            }
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            router.push("/login");
          }
        } else {
          setIsAuthenticated(false);
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading || isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
}
