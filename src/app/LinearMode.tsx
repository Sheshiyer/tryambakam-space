import { WINGS } from "~/src/wing-page/data";
import styles from "./linear-mode.module.css";

export function LinearMode() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>TRYAMBAKAM NOESIS {"//"} WING SYSTEM</h1>
        <p>
          You are viewing the linear fallback interface. <a href="/">Return to Canvas</a>
        </p>
      </header>

      <main className={styles.grid}>
        {WINGS.map((wing) => (
          <article key={wing.slug} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.number}>{wing.number}</span>
              <h2>{wing.title}</h2>
            </div>
            <p className={styles.subtitle}>{wing.subtitle}</p>
            <p className={styles.description}>{wing.description}</p>

            <a href={`/#${wing.slug}`} className={styles.link}>
              {wing.cta} &rarr;
            </a>

            <div className={styles.details}>
              <h4>Required Parameters:</h4>
              <ul>
                {wing.specs.map((spec) => (
                  <li key={spec.label}>
                    <strong>{spec.label}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
