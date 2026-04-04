"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function HomePage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const card = cardRef.current;
    const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      blobs.forEach((blob, index) => {
        const depth = (index + 1) * 8;
        const moveX = (event.clientX / window.innerWidth - 0.5) * depth;
        const moveY = (event.clientY / window.innerHeight - 0.5) * depth;
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      blobs.forEach((blob) => {
        blob.style.transform = "translate(0, 0)";
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleRipple = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.className = styles.ripple;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    target.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  };

  return (
    <main className={styles.page}>
      <div
        ref={(node: HTMLDivElement | null) => {
          blobRefs.current[0] = node;
        }}
        className={`${styles.blob} ${styles.blobOne}`}
      />
      <div
        ref={(node: HTMLDivElement | null) => {
          blobRefs.current[1] = node;
        }}
        className={`${styles.blob} ${styles.blobTwo}`}
      />

      <div className={styles.petals} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className={styles.petal} />
        ))}
      </div>

      <div ref={cardRef} className={styles.coverCard}>
        <div className={`${styles.logos} ${styles.fadeItem} ${styles.delay1}`}>
          <Image
            src="/beauty-logo.png"
            alt="Beauty Raha"
            width={360}
            height={120}
            priority
            className={styles.logoImage}
            style={{ height: "auto" }}
          />
        </div>

        <div className={`${styles.microBadge} ${styles.fadeItem} ${styles.delay2}`}>
          Grand Opening - 10 April 2026 - 09.30 WITA
        </div>

        <h1 className={`${styles.title} ${styles.fadeItem} ${styles.delay3}`}>
          Grand Opening Beauty Raha
        </h1>

        <p className={`${styles.subtitle} ${styles.fadeItem} ${styles.delay3}`}>
          Undangan resmi - Jl. Sukowati, Raha I, Kec. Katobu
        </p>

        <div className={`${styles.divider} ${styles.fadeItem} ${styles.delay4}`} />

        <p className={`${styles.info} ${styles.fadeItem} ${styles.delay4}`}>
          Kami mengundang Bapak/Ibu untuk hadir dalam peresmian <b>Beauty Raha</b> dan
          merayakan momen pembukaan bersama para mitra, rekan bisnis, dan sahabat brand
          kami.
        </p>

        <Link
          href="/content"
          className={`${styles.button} ${styles.fadeItem} ${styles.delay5}`}
          onClick={handleRipple}
        >
          Buka Undangan
        </Link>
      </div>

      <div className={styles.copyright}>
        &copy; 2026 Beauty Raha - Marketing Communication. All rights reserved.
      </div>
    </main>
  );
}
