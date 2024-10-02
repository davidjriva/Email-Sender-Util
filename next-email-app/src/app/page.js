import styles from "./page.module.css";
import EmailContainer from "../components/EmailContainer";

const EmailPage = () => {
  return (
    <div>
      <main className={styles.main}>
        <EmailContainer />
      </main>
    </div>
  );
};

export default EmailPage;
