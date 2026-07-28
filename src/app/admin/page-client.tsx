"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import type { ApiResponse, RsvpEntry, RsvpStats } from "@/types";

type SortField = "id" | "brandName" | "guestCount" | "createdAt";
type SortDirection = "asc" | "desc";
type StatKind = "brands" | "guests" | "responses";

const EXPORT_FILE_PREFIX = "rsvp-invitations";
const TABLE_PAGE_SIZE = 8;

const defaultStats: RsvpStats = {
  totalBrands: 0,
  totalGuests: 0,
  totalResponses: 0,
};

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatIcon({ kind }: { kind: StatKind }) {
  if (kind === "brands") {
    return (
      <svg viewBox="0 0 48 48" className={styles.statIconSvg} aria-hidden="true">
        <rect x="10" y="10" width="28" height="30" rx="8" className={styles.statSvgPrimary} />
        <path d="M16 18h16M16 24h16M16 30h7" className={styles.statSvgLine} />
        <path d="M28 30h4v4h-4zM28 22h4v4h-4z" className={styles.statSvgAccent} />
      </svg>
    );
  }

  if (kind === "guests") {
    return (
      <svg viewBox="0 0 48 48" className={styles.statIconSvg} aria-hidden="true">
        <circle cx="18" cy="18" r="6" className={styles.statSvgPrimary} />
        <circle cx="31" cy="16" r="5" className={styles.statSvgAccent} />
        <path d="M10 34c1.6-5.2 5.8-7.8 11.8-7.8S32 28.8 33.7 34" className={styles.statSvgLine} />
        <path d="M24.5 34c1.2-3.9 4.2-5.9 8.3-5.9 3.2 0 5.4 1.3 7 4.1" className={styles.statSvgSoft} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className={styles.statIconSvg} aria-hidden="true">
      <rect x="12" y="8" width="24" height="32" rx="7" className={styles.statSvgPrimary} />
      <path d="M18 18h12M18 24h12M18 30h8" className={styles.statSvgLine} />
      <circle cx="32" cy="14" r="4.5" className={styles.statSvgAccent} />
      <path d="M30.5 14h3" className={styles.statSvgTick} />
      <path d="M32 12.5v3" className={styles.statSvgTick} />
    </svg>
  );
}

function UiIcon({
  name,
  className,
}: {
  name: "arrow" | "download" | "eye" | "eyeOff" | "lock" | "logout" | "refresh" | "search" | "shield";
  className?: string;
}) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...commonProps}>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...commonProps}>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" />
      </svg>
    );
  }

  if (name === "eye" || name === "eyeOff") {
    return (
      <svg {...commonProps}>
        <path d="M2.5 12s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.5" />
        {name === "eyeOff" ? <path d="m4 4 16 16" /> : null}
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg {...commonProps}>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14.5v2" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg {...commonProps}>
        <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 8l4 4-4 4M9 12h9" />
      </svg>
    );
  }

  if (name === "refresh") {
    return (
      <svg {...commonProps}>
        <path d="M20 6v5h-5M4 18v-5h5" />
        <path d="M18.2 9A7 7 0 0 0 6.4 6.4L4 9m16 6-2.4 2.6A7 7 0 0 1 5.8 15" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 3 5 6v5c0 4.5 2.9 8.3 7 10 4.1-1.7 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function EmptyInboxIcon() {
  return (
    <svg viewBox="0 0 64 64" className={styles.emptyIconSvg} aria-hidden="true">
      <path d="M15 17.5h34l7 28H8l7-28Z" className={styles.emptyIconSurface} />
      <path d="m9 41 11-1 4 6h16l4-6 11 1M22 27h20M25 33h14" className={styles.emptyIconLine} />
    </svg>
  );
}

export default function AdminPageClient() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [entries, setEntries] = useState<RsvpEntry[]>([]);
  const [stats, setStats] = useState<RsvpStats>(defaultStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    void checkSession();

    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isCheckingSession) {
      passwordInputRef.current?.focus();
    }
  }, [isAuthenticated, isCheckingSession]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

  const showToast = (message: string) => {
    setToastMessage(message);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "same-origin",
        cache: "no-store",
      });

      const result = (await response.json()) as { authenticated?: boolean };

      if (response.ok && result.authenticated) {
        setIsAuthenticated(true);
        await loadData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const loadData = async () => {
    setIsLoadingData(true);

    try {
      const [statsResponse, listResponse] = await Promise.all([
        fetch("/api/admin/stats", { cache: "no-store", credentials: "same-origin" }),
        fetch("/api/admin/list", { cache: "no-store", credentials: "same-origin" }),
      ]);

      if (statsResponse.status === 401 || listResponse.status === 401) {
        setIsAuthenticated(false);
        setEntries([]);
        setStats(defaultStats);
        showToast("Sesi admin berakhir. Silakan login kembali.");
        return;
      }

      const statsResult = (await statsResponse.json()) as ApiResponse<RsvpStats>;
      const listResult = (await listResponse.json()) as ApiResponse<RsvpEntry[]>;

      if (!statsResponse.ok || !statsResult.success || !statsResult.data) {
        throw new Error(statsResult.error || "Gagal memuat statistik");
      }

      if (!listResponse.ok || !listResult.success || !listResult.data) {
        throw new Error(listResult.error || "Gagal memuat data");
      }

      setStats(statsResult.data);
      setEntries(listResult.data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setIsSubmittingLogin(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setLoginError(result.error || "Password salah. Silakan coba lagi.");
        return;
      }

      setPassword("");
      setIsAuthenticated(true);
      showToast("Login berhasil.");
      await loadData();
    } catch {
      setLoginError("Terjadi kesalahan saat login.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => null);

    setIsAuthenticated(false);
    setEntries([]);
    setStats(defaultStats);
    setPassword("");
    setLoginError("");
    showToast("Anda telah logout.");
  };

  const handleExport = async () => {
    setIsLoadingData(true);

    try {
      const response = await fetch("/api/admin/export", {
        credentials: "same-origin",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        showToast("Sesi admin berakhir. Silakan login kembali.");
        return;
      }

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as ApiResponse | null;
        throw new Error(result?.error || "Gagal mengeksport data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${EXPORT_FILE_PREFIX}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast("File CSV berhasil diunduh.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Gagal mengeksport data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery) {
      return true;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    return (
      entry.brandName.toLowerCase().includes(normalizedQuery) ||
      entry.guestNames.some((name) => name.toLowerCase().includes(normalizedQuery))
    );
  });

  const sortedEntries = [...filteredEntries].sort((left, right) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortField === "createdAt") {
      return (new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()) * direction;
    }

    if (sortField === "brandName") {
      return left.brandName.localeCompare(right.brandName, "id") * direction;
    }

    return (left[sortField] - right[sortField]) * direction;
  });

  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / TABLE_PAGE_SIZE));
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * TABLE_PAGE_SIZE,
    currentPage * TABLE_PAGE_SIZE,
  );
  const pageStart = sortedEntries.length === 0 ? 0 : (currentPage - 1) * TABLE_PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * TABLE_PAGE_SIZE, sortedEntries.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const sortClassName = (field: SortField) => {
    if (sortField !== field) {
      return styles.sortButton;
    }

    return `${styles.sortButton} ${sortDirection === "asc" ? styles.sortAsc : styles.sortDesc}`;
  };

  const statItems: Array<{ kind: StatKind; label: string; value: number; description: string }> = [
    {
      kind: "brands",
      label: "Brand terdaftar",
      value: stats.totalBrands,
      description: "Instansi yang mengirim konfirmasi",
    },
    {
      kind: "guests",
      label: "Tamu akan hadir",
      value: stats.totalGuests,
      description: "Total tamu dari seluruh undangan",
    },
    {
      kind: "responses",
      label: "Konfirmasi masuk",
      value: stats.totalResponses,
      description: "Respons yang sudah diterima",
    },
  ];

  return (
    <main className={styles.page}>
      {!isAuthenticated ? (
        <div className={styles.loginStage}>
          <section className={styles.loginShell} aria-labelledby="login-title">
            <aside className={styles.loginBrandPanel}>
              <div className={styles.loginBrandTop}>
                <span className={styles.brandMark}>
                  <Image src="/favicon.png" alt="" width={46} height={46} priority />
                </span>
                <span>
                  <strong>Beauty Katamso</strong>
                  <small>Grand Opening</small>
                </span>
              </div>

              <div className={styles.loginBrandCopy}>
                <div className={styles.brandEyebrow}>
                  <span className={styles.liveDot} />
                  Akses khusus tim internal
                </div>
                <h2>Satu ruang untuk setiap konfirmasi.</h2>
                <p>Pantau daftar tamu, perbarui data, dan siapkan laporan acara dari satu dashboard.</p>
              </div>

              <div className={styles.loginBrandFooter}>
                <span>Invitation Console</span>
                <span>Mowila, Konawe Selatan</span>
              </div>
            </aside>

            <div className={styles.loginFormPanel}>
              <div className={styles.loginFormInner}>
                <div className={styles.loginEyebrow}>Admin portal</div>
                <h1 id="login-title" className={styles.loginTitle}>Selamat datang kembali</h1>
                <p className={styles.loginDescription}>
                  Masukkan password admin untuk membuka dashboard konfirmasi tamu.
                </p>

                <form className={styles.loginForm} onSubmit={handleLogin}>
                  <div className={styles.field}>
                    <label htmlFor="passwordInput">Password admin</label>
                    <div className={`${styles.inputWrap} ${loginError ? styles.inputWrapError : ""}`}>
                      <UiIcon name="lock" className={styles.inputIcon} />
                      <input
                        ref={passwordInputRef}
                        id="passwordInput"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        autoComplete="current-password"
                        required
                        value={password}
                        aria-invalid={Boolean(loginError)}
                        aria-describedby={loginError ? "login-error" : undefined}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        <UiIcon name={showPassword ? "eyeOff" : "eye"} />
                      </button>
                    </div>
                  </div>

                  <div id="login-error" className={styles.errorMessage} role="alert">
                    {loginError}
                  </div>

                  <button
                    type="submit"
                    className={`${styles.button} ${styles.buttonPrimary} ${styles.loginButton}`}
                    disabled={isSubmittingLogin || isCheckingSession}
                  >
                    <span>{isCheckingSession ? "Memeriksa sesi..." : isSubmittingLogin ? "Membuka dashboard..." : "Masuk ke dashboard"}</span>
                    {!isCheckingSession && !isSubmittingLogin ? <UiIcon name="arrow" /> : <span className={styles.buttonLoader} />}
                  </button>
                </form>

                <div className={styles.securityNote}>
                  <UiIcon name="shield" />
                  <span>Sesi admin dilindungi dan akan berakhir secara otomatis.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className={styles.dashboard}>
          <header className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerIdentity}>
                <span className={styles.headerMark}>
                  <Image src="/favicon.png" alt="" width={38} height={38} />
                </span>
                <span className={styles.headerName}>
                  <strong>Beauty Katamso</strong>
                  <small>Invitation Console</small>
                </span>
              </div>

              <div className={styles.headerActions}>
                <button
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={() => void loadData()}
                  disabled={isLoadingData}
                >
                  <UiIcon name="refresh" />
                  <span>Perbarui</span>
                </button>
                <button
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={() => void handleExport()}
                  disabled={isLoadingData}
                >
                  <UiIcon name="download" />
                  <span>Unduh CSV</span>
                </button>
                <span className={styles.actionDivider} />
                <button className={`${styles.button} ${styles.buttonGhost}`} onClick={() => void handleLogout()}>
                  <UiIcon name="logout" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </header>

          <section className={styles.dashboardContent}>
            <div className={styles.dashboardIntro}>
              <div>
                <div className={styles.sectionEyebrow}>Pusat administrasi</div>
                <h1>Ringkasan kehadiran</h1>
                <p>Kelola seluruh konfirmasi tamu Grand Opening Beauty Katamso.</p>
              </div>
              <div className={styles.syncStatus}>
                <span className={styles.liveDot} />
                Data tersinkron
              </div>
            </div>

            <div className={styles.statsGrid}>
              {statItems.map((item) => (
                <article
                  key={item.kind}
                  className={`${styles.statCard} ${item.kind === "guests" ? styles.statCardPrimary : ""}`}
                >
                  <div className={styles.statCardTop}>
                    <div className={styles.statIconBadge}>
                      <StatIcon kind={item.kind} />
                    </div>
                    <span className={styles.statIndex}>0{statItems.findIndex((stat) => stat.kind === item.kind) + 1}</span>
                  </div>
                  <div className={styles.statValue}>{item.value}</div>
                  <div className={styles.statLabel}>{item.label}</div>
                  <div className={styles.statDescription}>{item.description}</div>
                </article>
              ))}
            </div>

            <section className={styles.tableSection} aria-labelledby="guest-list-title">
              <div className={styles.tableHeader}>
                <div className={styles.tableHeadingGroup}>
                  <div className={styles.tableTitleLine}>
                    <h2 id="guest-list-title" className={styles.tableTitle}>Daftar konfirmasi</h2>
                    <span className={styles.entryCount}>{sortedEntries.length} entri</span>
                  </div>
                  <div className={styles.tableMeta}>
                    Menampilkan {pageStart}–{pageEnd} dari seluruh respons kehadiran
                  </div>
                </div>
                <div className={styles.searchWrap}>
                  <UiIcon name="search" className={styles.searchIcon} />
                  <input
                    className={styles.searchInput}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari brand atau nama tamu"
                    aria-label="Cari brand atau nama tamu"
                  />
                  {searchQuery ? (
                    <button type="button" className={styles.clearSearch} onClick={() => setSearchQuery("")} aria-label="Hapus pencarian">
                      ×
                    </button>
                  ) : null}
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeading}>
                        <button className={sortClassName("id")} onClick={() => toggleSort("id")}>
                          ID
                        </button>
                      </th>
                      <th className={styles.tableHeading}>
                        <button className={sortClassName("brandName")} onClick={() => toggleSort("brandName")}>
                          Brand / Instansi
                        </button>
                      </th>
                      <th className={`${styles.tableHeading} ${styles.hideMobile}`}>
                        <button className={sortClassName("guestCount")} onClick={() => toggleSort("guestCount")}>
                          Tamu
                        </button>
                      </th>
                      <th className={styles.tableHeading}>Daftar Tamu</th>
                      <th className={styles.tableHeading}>
                        <button className={sortClassName("createdAt")} onClick={() => toggleSort("createdAt")}>
                          Waktu masuk
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedEntries.map((entry) => (
                      <tr key={entry.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{entry.id}</td>
                        <td className={styles.tableCell}>
                          <strong>{entry.brandName}</strong>
                        </td>
                        <td className={`${styles.tableCell} ${styles.hideMobile}`}>{entry.guestCount}</td>
                        <td className={styles.tableCell}>
                          <div className={styles.guestNamesList}>
                            {entry.guestNames.map((guestName, index) => (
                              <span key={`${entry.id}-${index}`} className={styles.guestBadge}>
                                {guestName}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className={`${styles.tableCell} ${styles.timestamp}`}>{formatTimestamp(entry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {sortedEntries.length === 0 ? (
                  <div className={styles.emptyState}>
                    <EmptyInboxIcon />
                    <div className={styles.emptyTitle}>{searchQuery ? "Tidak ada hasil yang cocok" : "Belum ada konfirmasi"}</div>
                    <div className={styles.emptyText}>
                      {searchQuery ? "Coba gunakan kata kunci yang lebih singkat." : "Respons tamu akan muncul di sini setelah dikirim."}
                    </div>
                  </div>
                ) : (
                  <div className={styles.paginationBar}>
                    <div className={styles.paginationInfo}>
                      Halaman {currentPage} dari {totalPages}
                    </div>

                    <div className={styles.paginationControls}>
                      <button
                        type="button"
                        className={`${styles.pageButton} ${styles.pageNavButton}`}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                      >
                        <span aria-hidden="true">←</span>
                        Sebelumnya
                      </button>

                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        className={`${styles.pageButton} ${styles.pageNavButton}`}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Berikutnya
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </section>
        </div>
      )}

      <div className={`${styles.loadingNotice} ${isLoadingData ? styles.loadingNoticeActive : ""}`} role="status">
        <span className={styles.loadingPulse} />
        Memperbarui data
      </div>

      <div className={`${styles.toast} ${toastMessage ? styles.toastVisible : ""}`} role="status">
        <span className={styles.toastCheck}>✓</span>
        {toastMessage}
      </div>
    </main>
  );
}
