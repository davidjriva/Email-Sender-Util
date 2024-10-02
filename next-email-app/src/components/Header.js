// src/components/Header.tsx
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Container } from "@mui/material";
import styles from "./Header.module.css"; // Import the CSS module

const Header = () => {
  const additionalPages = ["Page 2", "Page 3"];

  return (
    <header className={styles.header}>
      <Container>
        <Toolbar className={styles.nav}>
          <Typography variant="h6">
            <Link href="/" className={styles.nav}>
              Home
            </Link>
          </Typography>

          {additionalPages.map((page) => (
            <Typography key={page} variant="h6">
              <Link href={`/${page.toLowerCase()}`} className={styles.nav}>
                {page}
              </Link>
            </Typography>
          ))}

        </Toolbar>
      </Container>
    </header>
  );
};

export default Header;
