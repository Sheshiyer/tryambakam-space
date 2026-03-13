import styles from "./style.module.css";

export function Frame({ hidden }: { hidden?: boolean }) {
  return (
    <header className={`frame ${styles.frame} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.frame__top}>
        <img src="/logo/SVG/Asset 5.svg" className={styles.frame__logoImage} alt="Tryambakam Noesis Logo" />
      </div>

      <div className={styles.frame__center}>
        <p className={styles.frame__super}>The</p>
        <h1 className={styles.frame__title}>
          Tryambakam
          <br />
          Noesis
        </h1>
        <p className={styles.frame__subtitle}>Self-Generating Code Well</p>
        <p className={styles.frame__cta}>Train your inner code through recursive symbolic insight</p>
      </div>

      <nav className={styles.frame__scattered}>
        <span className={`${styles.scatteredTag} ${styles.tag1}`}>#somatic-canticles</span>
        <span className={`${styles.scatteredTag} ${styles.tag2}`}>#sixteen-engines</span>
        <span className={`${styles.scatteredTag} ${styles.tag3}`}>#kha-ba-la</span>
        <span className={`${styles.scatteredTag} ${styles.tag4}`}>#witness</span>
        <span className={`${styles.scatteredTag} ${styles.tag5}`}>#apothecary</span>
      </nav>
    </header>
  );
}
