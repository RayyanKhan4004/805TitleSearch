"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requestOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  type RequestOtpFormData,
  type VerifyOtpFormData,
  type ResetPasswordFormData,
} from "@/app/schema/forgot-password-schema";
import { Button, Card, Heading, Text, Spinner, Alert, Input } from "@/components/ui";
import Icon from "@/components/common/icon";

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailForm = useForm<RequestOtpFormData>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: "", otp: "" },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", otp: "", password: "", confirmPassword: "" },
  });

  const handleRequestOtp = async (data: RequestOtpFormData) => {
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setEmail(data.email);
    otpForm.setValue("email", data.email);
    resetForm.setValue("email", data.email);
    setIsSubmitting(false);
    setStep("otp");
  };

  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    resetForm.setValue("otp", data.otp);
    setIsSubmitting(false);
    setStep("reset");
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setError(null);
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    router.push("/login?reset=success");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: "var(--bg-page)" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand rounded-xl flex items-center justify-center mx-auto mb-3" style={{ boxShadow: "var(--shadow-card)" }}>
            <Icon name="building" size={24} className="text-white" />
          </div>
          <Heading level="h2" className="mb-1">805titleIQ</Heading>
          <Text size="sm" muted>Reset your password</Text>
        </div>

        <Card variant="elevated" padding="lg">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "email" ? "bg-brand text-white" : step === "otp" || step === "reset" ? "bg-brand text-white" : "bg-bg-muted text-text-muted"}`}>1</div>
            <div className="w-8 h-0.5" style={{ background: step === "otp" || step === "reset" ? "var(--brand-primary)" : "var(--bg-muted)" }} />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "otp" ? "bg-brand text-white" : step === "reset" ? "bg-brand text-white" : "bg-bg-muted text-text-muted"}`}>2</div>
            <div className="w-8 h-0.5" style={{ background: step === "reset" ? "var(--brand-primary)" : "var(--bg-muted)" }} />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "reset" ? "bg-brand text-white" : "bg-bg-muted text-text-muted"}`}>3</div>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error" title="Error">{error}</Alert>
            </div>
          )}

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={emailForm.handleSubmit(handleRequestOtp)} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <Heading level="h4" className="mb-0.5">Forgot Password</Heading>
                <Text size="sm" muted>Enter your email to receive an OTP</Text>
              </div>

              <Input
                label="Email"
                placeholder="Enter your email"
                error={emailForm.formState.errors.email?.message}
                state={emailForm.formState.errors.email ? "error" : "default"}
                size="lg"
                icon={<Icon name="user" size={12} />}
                {...emailForm.register("email")}
                disabled={isSubmitting}
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner size="sm" variant="white" /> Sending OTP...</> : <><Icon name="arrowRight" size={12} /> Send OTP</>}
              </Button>

              <button type="button" onClick={() => router.push("/login")} className="text-[10px] text-brand font-semibold bg-transparent border-none cursor-pointer hover:underline text-center mt-1">
                Back to Sign In
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <Heading level="h4" className="mb-0.5">Enter OTP</Heading>
                <Text size="sm" muted>A 6-digit code was sent to {email}</Text>
              </div>

              <Input
                label="OTP Code"
                placeholder="000000"
                error={otpForm.formState.errors.otp?.message}
                state={otpForm.formState.errors.otp ? "error" : "default"}
                size="lg"
                maxLength={6}
                icon={<Icon name="shield" size={12} />}
                {...otpForm.register("otp")}
                disabled={isSubmitting}
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner size="sm" variant="white" /> Verifying...</> : <><Icon name="check" size={12} /> Verify OTP</>}
              </Button>

              <div className="flex items-center justify-between mt-1">
                <button type="button" onClick={() => setStep("email")} className="text-[10px] text-brand font-semibold bg-transparent border-none cursor-pointer hover:underline">
                  Change email
                </button>
                <button type="button" onClick={() => emailForm.handleSubmit(handleRequestOtp)()} className="text-[10px] text-text-muted bg-transparent border-none cursor-pointer hover:underline">
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <Heading level="h4" className="mb-0.5">New Password</Heading>
                <Text size="sm" muted>Enter your new password for {email}</Text>
              </div>

              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                error={resetForm.formState.errors.password?.message}
                state={resetForm.formState.errors.password ? "error" : "default"}
                size="lg"
                icon={<Icon name="shield" size={12} />}
                {...resetForm.register("password")}
                disabled={isSubmitting}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                error={resetForm.formState.errors.confirmPassword?.message}
                state={resetForm.formState.errors.confirmPassword ? "error" : "default"}
                size="lg"
                icon={<Icon name="check" size={12} />}
                {...resetForm.register("confirmPassword")}
                disabled={isSubmitting}
              />

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? <><Spinner size="sm" variant="white" /> Resetting...</> : <><Icon name="save" size={12} /> Reset Password</>}
              </Button>
            </form>
          )}
        </Card>

        <Text size="xs" tertiary className="text-center mt-4">
          &copy; 2026 805titleIQ. All rights reserved.
        </Text>
      </div>
    </div>
  );
}
