"use client";

import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const RSVP_SUBMIT_FLAG = "beauty-raha-rsvp-submitted";
const RSVP_SUBMITTED_BRAND_KEY = "beauty-raha-rsvp-submitted-brand";
const EVENT_DATE = "2026-04-10T09:30:00+08:00";

type StatusType = "success" | "error" | "info" | "";

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function clampGuestCount(value: number) {
  return Math.max(1, Math.min(10, value || 1));
}

function formatCountdown() {
  const target = new Date(EVENT_DATE).getTime();
  const diff = Math.max(target - Date.now(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days} hari ${hours} jam ${minutes} menit lagi`;
}

export default function ContentPage() {
  const [countdownText, setCountdownText] = useState(formatCountdown);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<StatusType>("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<Exclude<StatusType, "">>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBrandName, setSubmittedBrandName] = useState("");
  const brandInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setCountdownText(formatCountdown());
    const intervalId = window.setInterval(() => {
      setCountdownText(formatCountdown());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setGuestNames((current: string[]) => {
      const next = current.slice(0, guestCount);

      while (next.length < guestCount) {
        next.push("");
      }

      return next;
    });
  }, [guestCount]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.localStorage.getItem(RSVP_SUBMIT_FLAG) === "true") {
      setIsSubmitted(true);
      setSubmittedBrandName(window.localStorage.getItem(RSVP_SUBMITTED_BRAND_KEY)?.trim() || "");
      setStatusMessage("Perangkat ini sudah pernah mengirim konfirmasi kehadiran.");
      setStatusType("success");
    }
  }, []);

  useEffect(() => {
    if (isPanelOpen) {
      brandInputRef.current?.focus();
    }
  }, [isPanelOpen]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }

    };
  }, []);

  const showToast = (message: string, type: Exclude<StatusType, ""> = "info") => {
    setToastMessage(message);
    setToastType(type);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 2600);
  };

  const setFormStatus = (message: string, type: StatusType) => {
    setStatusMessage(message);
    setStatusType(type);
  };

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

  const handleGuestCountChange = (value: string) => {
    setGuestCount(clampGuestCount(Number(value)));
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setGuestNames((current: string[]) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitted) {
      setFormStatus("Konfirmasi ganda diblokir untuk perangkat ini.", "error");
      showToast("Perangkat ini sudah pernah mengirim RSVP.", "error");
      return;
    }

    const cleanedBrandName = brandName.trim();
    const cleanedGuestNames = guestNames.map((item: string) => item.trim());

    if (cleanedBrandName.length < 2) {
      setFormStatus("Nama brand atau instansi minimal 2 karakter.", "error");
      brandInputRef.current?.focus();
      return;
    }

    if (cleanedGuestNames.length !== guestCount || cleanedGuestNames.some((item: string) => item.length < 2)) {
      setFormStatus("Semua nama tamu wajib diisi dengan benar.", "error");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("Sedang menyimpan konfirmasi kehadiran...", "info");

    // Biarkan state loading ter-render dulu sebelum request ke server dimulai.
    await waitForNextPaint();

    try {
      const response = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: cleanedBrandName,
          guestCount,
          guestNames: cleanedGuestNames,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Gagal mengirim konfirmasi. Silakan coba lagi.");
      }

      window.localStorage.setItem(RSVP_SUBMIT_FLAG, "true");
      window.localStorage.setItem(RSVP_SUBMITTED_BRAND_KEY, cleanedBrandName);
      setIsSubmitted(true);
      setSubmittedBrandName(cleanedBrandName);
      setFormStatus(`Terima kasih, ${cleanedBrandName}. Kehadiran Anda sudah tercatat.`, "success");
      setBrandName("");
      setGuestCount(1);
      setGuestNames([""]);
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("Failed to fetch")
          ? "Koneksi ke server sedang bermasalah. Coba kirim ulang beberapa saat lagi."
          : error instanceof Error
            ? error.message
            : "Terjadi kesalahan. Silakan coba lagi.";

      setFormStatus(message, "error");
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusClassName = [
    styles.statusMessage,
    statusType === "success" ? styles.statusSuccess : "",
    statusType === "error" ? styles.statusError : "",
    statusType === "info" ? styles.statusInfo : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className={styles.page}>
      <div className={`${styles.glow} ${styles.glowOne}`} />
      <div className={`${styles.glow} ${styles.glowTwo}`} />

      <section className={styles.card}>
        <div className={`${styles.tagline} ${styles.reveal} ${styles.delay1}`}>Undangan</div>

        <h1 className={`${styles.title} ${styles.reveal} ${styles.delay2}`}>
          Grand Opening Beauty Raha
        </h1>

        <p className={`${styles.subtitle} ${styles.reveal} ${styles.delay3}`}>
          Mari rayakan momen spesial pembukaan ruang cantik baru kami 
        </p>

        <div className={`${styles.divider} ${styles.reveal} ${styles.delay3}`} />

        <p className={`${styles.content} ${styles.reveal} ${styles.delay4}`}>
          Kami mengundang Bapak/Ibu untuk hadir dalam acara <b>Grand Opening Beauty Raha</b>.
          Kehadiran Bapak/Ibu sebagai mitra, sahabat brand, dan tamu undangan merupakan
          dukungan yang sangat berarti bagi langkah awal kami dalam menghadirkan pengalaman
          kecantikan yang hangat dan elegan di Raha.
        </p>

        <div className={`${styles.detailsBox} ${styles.reveal} ${styles.delay5}`}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Tanggal</div>
            <div className={styles.detailValue}>Jumat, 10 April 2026</div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Waktu</div>
            <div className={styles.detailValue}>Pukul 09.30 WITA - selesai</div>
          </div>
        </div>

        <div className={`${styles.locationTitle} ${styles.reveal} ${styles.delay5}`}>Lokasi Acara</div>
        <div className={`${styles.locationText} ${styles.reveal} ${styles.delay6}`}>
          Beauty Raha
          <br />
          Jl. Sukowati, Raha I, Kec. Katobu, Kabupaten Muna, Sulawesi Tenggara 93611
        </div>

        <div className={`${styles.countdown} ${styles.reveal} ${styles.delay6}`}>
          Menuju acara: <strong>{countdownText}</strong>
        </div>

        <div className={`${styles.buttonGroup} ${styles.reveal} ${styles.delay7}`}>
          <a
            href="https://maps.app.goo.gl/w8fharKwpTqkxunV7"
            target="_blank"
            rel="noreferrer"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={handleRipple}
          >
            Lihat Lokasi
          </a>

          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={(event) => {
              handleRipple(event);
              setIsPanelOpen(true);
            }}
          >
            Konfirmasi Kehadiran
          </button>
        </div>

        <div className={`${styles.panelShell} ${isPanelOpen ? styles.panelShellOpen : ""}`}>
          <div className={styles.panelInner}>
            <div className={styles.rsvpBox}>
              <div className={styles.rsvpTitle}>Form Konfirmasi Kehadiran</div>
              <div className={styles.rsvpCopy}>
                Isi nama brand atau instansi, jumlah tamu yang hadir, lalu lengkapi nama
                masing-masing tamu.
              </div>

              {isSubmitted ? (
                <div className={styles.successCard} role="status" aria-live="polite">
                  <div className={styles.successIcon}>✓</div>
                  <div className={styles.successTitle}>Konfirmasi berhasil dikirim</div>
                  <div className={styles.successText}>
                    {submittedBrandName ? (
                      <>
                        Terima kasih, <strong>{submittedBrandName}</strong>. Kehadiran Anda sudah
                        tercatat di sistem kami.
                      </>
                    ) : (
                      <>Konfirmasi kehadiran dari perangkat ini sudah tercatat di sistem kami.</>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className={styles.field}>
                    <label htmlFor="brandName">Dari Brand Apa?</label>
                    <input
                      ref={brandInputRef}
                      id="brandName"
                      name="brandName"
                      type="text"
                      minLength={2}
                      required
                      value={brandName}
                      onChange={(event) => setBrandName(event.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="guestCount">Jumlah Tamu yang Hadir</label>
                    <input
                      id="guestCount"
                      name="guestCount"
                      type="number"
                      min={1}
                      max={10}
                      required
                      value={guestCount}
                      onChange={(event) => handleGuestCountChange(event.target.value)}
                    />
                    <span className={styles.helperText}>{guestCount} nama tamu wajib diisi.</span>
                  </div>

                  <div className={styles.field}>
                    <label>Nama-nama yang Hadir</label>
                    <div className={styles.guestFields}>
                      {guestNames.map((guestName, index) => (
                        <div key={index} className={styles.guestItem}>
                          <label htmlFor={`guest-${index + 1}`}>Nama {index + 1}</label>
                          <input
                            id={`guest-${index + 1}`}
                            name={`guest-${index + 1}`}
                            type="text"
                            required
                            value={guestName}
                            onChange={(event) => handleGuestNameChange(index, event.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.buttonGroup} ${styles.formButtonGroup}`}>
                    <button
                      type="submit"
                      className={`${styles.button} ${styles.buttonPrimary}`}
                      disabled={isSubmitting}
                      onClick={handleRipple}
                    >
                      {isSubmitting ? (
                        <span className={styles.buttonLoadingContent}>
                          <span className={styles.buttonSpinner} aria-hidden="true" />
                          Menyimpan...
                        </span>
                      ) : (
                        "Kirim Konfirmasi"
                      )}
                    </button>
                  </div>

                  <div className={statusClassName} role="status" aria-live="polite">
                    {statusMessage}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <p className={`${styles.footerText} ${styles.reveal} ${styles.delay7}`}>
          Sampai jumpa di Beauty Raha, kami tunggu kehadirannya 💗
        </p>

        <div className={`${styles.copyright} ${styles.reveal} ${styles.delay7}`}>
          &copy; 2026 Beauty Raha - Marketing Communication. All rights reserved.
        </div>
      </section>

      <div
        className={`${styles.toast} ${styles[`toast${toastType.charAt(0).toUpperCase()}${toastType.slice(1)}`]} ${toastMessage ? styles.toastVisible : ""}`}
        role="status"
        aria-live="polite"
      >
        <span className={styles.toastIcon} aria-hidden="true">
          {toastType === "success" ? "✓" : toastType === "error" ? "!" : "i"}
        </span>
        <span>{toastMessage}</span>
      </div>
    </main>
  );
}
