import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#FFFFFF]">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-2xl">
          <div className="text-center mb-2">
            <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary" style={{
            fontFamily:"Arial, Helvetica, sans-serif"
          }}>
              Mind Miracles
            </h1>
            </div>
           
            <p className="text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center bg-[#FFFFFF] dark:bg-slate-800">
        <Image
          src="/mind_miracles_logo.png"
          alt="Sign in illustration"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>
    </div>
  );
}