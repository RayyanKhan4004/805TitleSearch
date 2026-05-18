"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/app/schema/login-schema";
import { Button, Input, Checkbox, Card, Heading, Text, Spinner, Alert } from "@/components/ui";
import Icon from "@/components/common/icon";
import { useAuth } from "@/app/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(data.username, data.password);
      if (!success) {
        setError("Invalid username or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center mx-auto mb-3" style={{ boxShadow: "var(--shadow-card)" }}>
            <Icon name="building" size={24} className="text-white" />
          </div>
          <Heading level="h2" className="mb-1">Title Dashboard</Heading>
          <Text size="sm" muted>ATS Production Workflow</Text>
        </div>

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <Heading level="h4" className="mb-0.5">Sign In</Heading>
              <Text size="sm" muted>Enter your credentials to continue</Text>
            </div>

            {error && (
              <Alert variant="error" title="Authentication Failed">
                {error}
              </Alert>
            )}

            <Input
              label="Username"
              placeholder="Enter your username"
              error={errors.username?.message}
              state={errors.username ? "error" : "default"}
              size="lg"
              icon={<Icon name="user" size={12} />}
              {...register("username")}
              disabled={isLoading}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={errors.password?.message}
                state={errors.password ? "error" : "default"}
                size="lg"
                icon={<Icon name="shield" size={12} />}
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[28px] text-text-muted hover:text-text-secondary cursor-pointer bg-transparent border-none p-0"
                tabIndex={-1}
              >
                <Icon name={showPassword ? "external" : "shield"} size={12} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                {...register("rememberMe")}
                disabled={isLoading}
              />
              <button
                type="button"
                className="text-[10px] text-brand font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" variant="white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <Icon name="arrowRight" size={12} />
                </>
              )}
            </Button>
          </form>
        </Card>

        <Text size="xs" tertiary className="text-center mt-4">
          &copy; 2026 Title Dashboard. All rights reserved.
        </Text>
      </div>
    </div>
  );
}
