"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "../layout/header";
import { cn } from "@/lib/utils";

interface ExtendedThemeProps {
  children: React.ReactNode;
  containerClassName?: string;
}

const ThemeProvider = ({
  children,
  containerClassName,
  ...props
}: ExtendedThemeProps) => {
  return (
    <NextThemesProvider {...props}>
      <Header />
      <main className={cn("container mx-auto px-4", containerClassName)}>
        {children}
      </main>
    </NextThemesProvider>
  );
};

export default ThemeProvider;
