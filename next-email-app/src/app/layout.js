"use client";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title> Next Email App </title>
      </head>

      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
