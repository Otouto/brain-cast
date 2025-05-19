"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp 
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined
        }}
      />
    </div>
  );
} 