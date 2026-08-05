import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function CoverPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logos}>
          <Image
            src="/beauty-logo.png"
            alt="Beauty Katamso"
            width={150}
            height={65}
            priority
            className={styles.logoImage}
            style={{ width: "auto" }}
          />
        </div>

        <h1 className={styles.title}>Grand Opening Beauty Katamso</h1>
        <p className={styles.subtitle}>Undangan • 07 Agustus 2026 • 09.00 WITA</p>

        <Link href="/content" className={styles.button}>
          Buka Undangan
        </Link>
      </div>
    </main>
  );
}
