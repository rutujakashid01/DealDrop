import { Toaster } from "@/components/ui/sonner";
import "./globals.css";


export const metadata = {
  title: "Deal Drop",
  description: "Best deals curated for you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
