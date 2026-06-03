"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Separator, Avatar, Alert, Spinner, cn } from "@/components/ui";
import Icon from "@/components/common/icon";

interface ProfileUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, logout, user: contextUser } = useAuth();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${baseUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout();
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router, logout]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>
        <Card variant="elevated" padding="lg" className="w-full max-w-[400px]">
          <Alert variant="error" title="Error">{error}</Alert>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => router.push("/table")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const displayUser = (profile || contextUser) as ProfileUser;
  if (!displayUser) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>
        <Card variant="elevated" padding="lg" className="w-full max-w-[400px]">
          <Alert variant="error" title="No User Data">Unable to load profile information.</Alert>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => router.push("/table")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const initials = `${displayUser.firstName[0]}${displayUser.lastName[0]}`.toUpperCase();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>
      <Card variant="elevated" padding="none" className="w-full max-w-105">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => router.push("/table")}>
            <Icon name="x" size={12} />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pt-6 pb-5">
          <Avatar size="xl" variant="brand" initials={initials} />
          <div className="text-center">
            <div className="text-[16px] font-bold text-text">
              {displayUser.firstName} {displayUser.lastName}
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">{displayUser.email}</div>
          </div>
          <Badge variant={displayUser.isActive ? "success" : "warning"} size="sm" dot>
            {displayUser.isActive ? "Active" : "Inactive"}
          </Badge>
        </CardContent>
        <Separator />
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted">User ID</span>
            <span className="text-text font-semibold">#{displayUser.id}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted">Email</span>
            <span className="text-text font-semibold">{displayUser.email}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted">Name</span>
            <span className="text-text font-semibold">{displayUser.firstName} {displayUser.lastName}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted">Status</span>
            <Badge variant={displayUser.isActive ? "success" : "warning"} size="sm" dot>
              {displayUser.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {profile?.createdAt && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Created</span>
                <span className="text-text font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>
            </>
          )}
        </CardContent>
        <Separator />
        <CardContent className="flex gap-2 pt-3.5 pb-4">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => router.push("/table")}>
            <Icon name="arrowLeft" size={11} />
            Back
          </Button>
          <Button
            size="sm"
            className="flex-1"
            style={{ background: "#dc2626" }}
            onClick={logout}
          >
            <Icon name="arrowRight" size={11} />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


