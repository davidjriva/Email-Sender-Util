import styles from "../page.module.css";
import EmailInputForm from "../../components/EmailInputForm";

const EmailPage = () => {
  return (
    <div className={styles.emailPage}>
      <main className={styles.main}>
        <h1> Create an Email </h1>
        <EmailInputForm />
      </main>
    </div>
  );
};

export default EmailPage;
