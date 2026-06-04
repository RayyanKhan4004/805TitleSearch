"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/context/auth-context";
import { changePasswordSchema, type ChangePasswordFormData } from "@/app/schema/forgot-password-schema";
import { useGetProfileQuery } from "@/app/store/api/authApi";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Separator, Avatar, Alert, Spinner, Input, cn } from "@/components/ui";
import Icon from "@/components/common/icon";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, logout, user: contextUser } = useAuth();
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  const {
    register: registerChange,
    handleSubmit: handleSubmitChange,
    formState: { errors: changeErrors },
    reset: resetChangeForm,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setChangePasswordError(null);
    setChangePasswordSuccess(false);
    setIsChangingPassword(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsChangingPassword(false);
    setChangePasswordSuccess(true);
    resetChangeForm();
    setTimeout(() => {
      setShowChangePassword(false);
      setChangePasswordSuccess(false);
    }, 3000);
  };

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (isLoading) {
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
          <Alert variant="error" title="Error">Failed to load profile</Alert>
          <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={() => router.push("/table")}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const displayUser = (profile || contextUser) as {
    id: number; email: string; firstName: string; lastName: string;
    isActive: boolean; createdAt?: string; updatedAt?: string;
  };
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
        <CardContent className="flex flex-col gap-3 pt-3.5 pb-4">
          <button
            type="button"
            onClick={() => { setShowChangePassword(!showChangePassword); setChangePasswordError(null); setChangePasswordSuccess(false); }}
            className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer text-[12px] font-semibold text-text"
          >
            <span className="flex items-center gap-1.5">
              <Icon name="shield" size={11} />
              Change Password
            </span>
            <Icon name={showChangePassword ? "chevDown" : "chevRight"} size={11} className="text-text-muted" />
          </button>

          {showChangePassword && (
            <form onSubmit={handleSubmitChange(handleChangePassword)} className="flex flex-col gap-3 pl-1">
              {changePasswordSuccess && (
                <Alert variant="success" title="Success">Password changed successfully.</Alert>
              )}
              {changePasswordError && (
                <Alert variant="error" title="Error">{changePasswordError}</Alert>
              )}
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                error={changeErrors.currentPassword?.message}
                state={changeErrors.currentPassword ? "error" : "default"}
                size="md"
                {...registerChange("currentPassword")}
                disabled={isChangingPassword}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={changeErrors.newPassword?.message}
                state={changeErrors.newPassword ? "error" : "default"}
                size="md"
                {...registerChange("newPassword")}
                disabled={isChangingPassword}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                error={changeErrors.confirmNewPassword?.message}
                state={changeErrors.confirmNewPassword ? "error" : "default"}
                size="md"
                {...registerChange("confirmNewPassword")}
                disabled={isChangingPassword}
              />
              <Button type="submit" variant="primary" size="sm" className="self-start mt-1" disabled={isChangingPassword}>
                {isChangingPassword ? <><Spinner size="sm" variant="white" /> Updating...</> : "Update Password"}
              </Button>
            </form>
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


