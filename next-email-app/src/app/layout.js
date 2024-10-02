import localFont from "next/font/local";
import "./globals.css";
import StyledDivider from "../components/StyledDivider";
import Header from "../components/Header";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title> Next Email App </title>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <StyledDivider />
        <main>{children}</main>
      </body>
    </html>
  );
}
