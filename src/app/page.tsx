"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import styles from "./page.module.css";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  );
}

function BotanicalFlourish({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`${styles.botanical} ${
        side === "right" ? styles.botanicalRight : styles.botanicalLeft
      }`}
      viewBox="0 0 150 250"
      aria-hidden="true"
    >
      <path d="M22 230C31 174 48 120 102 32" />
      <path d="M42 163c-25-2-34-14-35-30 22-1 35 8 35 30Z" />
      <path d="M61 121c-7-22-1-38 15-47 9 21 4 36-15 47Z" />
      <path d="M75 94c21-7 37-2 46 13-19 10-35 5-46-13Z" />
      <path d="M94 50c-3-18 4-31 18-38 5 17-1 30-18 38Z" />
      <circle cx="34" cy="188" r="3" />
      <circle cx="83" cy="73" r="2.5" />
    </svg>
  );
}

export default function HomePage() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const springConfig = { stiffness: 150, damping: 24, mass: 0.7 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2.4, -2.4]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);
  const cardTransform = useMotionTemplate`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      shouldReduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <div className={`${styles.ambientGlow} ${styles.glowTop}`} aria-hidden="true" />
        <div className={`${styles.ambientGlow} ${styles.glowBottom}`} aria-hidden="true" />
        <div className={styles.backgroundRing} aria-hidden="true" />

        <BotanicalFlourish side="left" />
        <BotanicalFlourish side="right" />

        <motion.div
          className={styles.cardEntrance}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(18px) scale(0.985)" }
          }
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.article
            className={styles.invitation}
            style={shouldReduceMotion ? undefined : { transform: cardTransform }}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetPointer}
            aria-labelledby="invitation-title"
          >
            <span className={`${styles.corner} ${styles.cornerTopLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerTopRight}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBottomLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerBottomRight}`} aria-hidden="true" />

            <div className={styles.innerFrame}>
              <div className={`${styles.reveal} ${styles.delayOne}`}>
                <p className={styles.eyebrow}>
                  <span />
                  Undangan Grand Opening
                  <span />
                </p>

                <Image
                  src="/beauty-logo.png"
                  alt="Beauty Katamso"
                  width={420}
                  height={105}
                  priority
                  className={styles.logo}
                />
              </div>

              <div className={`${styles.reveal} ${styles.delayTwo}`}>
                <p className={styles.kicker}>A new chapter begins</p>
                <h1 id="invitation-title" className={styles.title}>
                  Grand Opening
                </h1>
                <p className={styles.storeName}>Beauty Katamso</p>
              </div>

              <div className={`${styles.eventDetails} ${styles.reveal} ${styles.delayThree}`}>
                <div className={styles.eventItem}>
                  <CalendarIcon />
                  <span>
                    <small>Jumat</small>
                    07 Agustus 2026
                  </span>
                </div>
                <span className={styles.detailDivider} aria-hidden="true" />
                <div className={styles.eventItem}>
                  <ClockIcon />
                  <span>
                    <small>Waktu</small>
                    09.00 WITA
                  </span>
                </div>
              </div>

              <p className={`${styles.message} ${styles.reveal} ${styles.delayFour}`}>
                Dengan penuh sukacita, kami mengundang Bapak/Ibu untuk hadir dan
                merayakan awal perjalanan baru bersama kami.
              </p>

              <div className={`${styles.location} ${styles.reveal} ${styles.delayFive}`}>
                <span className={styles.locationIcon}>
                  <PinIcon />
                </span>
                <span>
                  <small>Lokasi Acara</small>
                  Jl. Poros Kendari–Motaha, Mowila
                </span>
              </div>

              <div className={`${styles.action} ${styles.reveal} ${styles.delaySix}`}>
                <Link
                  href="/content"
                  className={styles.button}
                  aria-label="Buka detail undangan Grand Opening Beauty Katamso"
                >
                  <span>Lihat Undangan</span>
                  <span className={styles.buttonIcon}>
                    <ArrowIcon />
                  </span>
                </Link>
                <p className={styles.actionHint}>Detail acara dan konfirmasi kehadiran</p>
              </div>
            </div>
          </motion.article>
        </motion.div>

        <p className={styles.copyright}>
          Beauty Katamso <span aria-hidden="true">•</span> Grand Opening 2026
        </p>
      </main>
    </MotionConfig>
  );
}
