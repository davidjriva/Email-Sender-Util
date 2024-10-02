import styles from "../page.module.css";

const AboutPage = () => {
  return (
    <div className={styles.page}>
        <main className={styles.main}>
            <h1>About Us</h1>
            <p>
                This is the about page of our Next.js application using the App Router.
            </p>
        </main>
    </div>
  );
};

export default AboutPage;
