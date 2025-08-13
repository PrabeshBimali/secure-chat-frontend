import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout(props: AuthLayoutProps){

  const { children } = props
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary p-4">
      <div className="w-full max-w-sm bg-bg-secondary shadow-lg rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};