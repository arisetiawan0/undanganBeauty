"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import type { ApiResponse, RsvpEntry, RsvpStats } from "@/types";

type SortField = "id" | "brandName" | "guestCount" | "createdAt";
type SortDirection = "asc" | "desc";
type StatKind = "brands" | "guests" | "responses";

const ADMIN_PANEL_NAME = "Invitation Admin";
const ADMIN_PANEL_TAGLINE = "Kelola daftar tamu untuk acara Anda";
const ADMIN_LOGIN_TITLE = "Dashboard Daftar Tamu";
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

export default function AdminPageClient() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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
      return `${styles.tableHeading} ${styles.sortable}`;
    }

    return `${styles.tableHeading} ${styles.sortable} ${sortDirection === "asc" ? styles.sortAsc : styles.sortDesc}`;
  };

  const statItems: Array<{ kind: StatKind; label: string; value: number; accentClassName: string }> = [
    {
      kind: "brands",
      label: "Total Brand",
      value: stats.totalBrands,
      accentClassName: styles.statAccentBrands,
    },
    {
      kind: "guests",
      label: "Total Tamu",
      value: stats.totalGuests,
      accentClassName: styles.statAccentGuests,
    },
    {
      kind: "responses",
      label: "Total Responden",
      value: stats.totalResponses,
      accentClassName: styles.statAccentResponses,
    },
  ];

  return (
    <main className={styles.page}>
      {!isAuthenticated ? (
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <div className={styles.loginLogo}>{ADMIN_PANEL_NAME}</div>
            <div className={styles.loginTitle}>{ADMIN_LOGIN_TITLE}</div>
            <p className={styles.loginDescription}>{ADMIN_PANEL_TAGLINE}</p>

            <form className={styles.loginForm} onSubmit={handleLogin}>
              <div className={styles.field}>
                <label htmlFor="passwordInput">Password Admin</label>
                <input
                  ref={passwordInputRef}
                  id="passwordInput"
                  name="password"
                  type="password"
                  placeholder="Masukkan password admin"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmittingLogin || isCheckingSession}>
                {isCheckingSession ? "Memeriksa..." : isSubmittingLogin ? "Masuk..." : "Masuk"}
              </button>

              <div className={styles.errorMessage}>{loginError}</div>
            </form>
          </div>
        </div>
      ) : (
        <div className={styles.dashboard}>
          <header className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
              <div>
                <div className={styles.headerBrand}>{ADMIN_PANEL_NAME}</div>
                <div className={styles.headerSubtitle}>{ADMIN_PANEL_TAGLINE}</div>
              </div>

              <div className={styles.headerActions}>
                <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => void loadData()}>
                  Refresh Data
                </button>
                <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => void handleExport()}>
                  Export CSV
                </button>
                <button className={`${styles.button} ${styles.buttonDanger}`} onClick={() => void handleLogout()}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          <section className={styles.dashboardContent}>
            <div className={styles.statsGrid}>
              {statItems.map((item) => (
                <article key={item.kind} className={`${styles.statCard} ${item.accentClassName}`}>
                  <div className={styles.statIconWrap}>
                    <div className={styles.statIconGlow} />
                    <div className={styles.statIconBadge}>
                      <StatIcon kind={item.kind} />
                    </div>
                  </div>
                  <div className={styles.statValue}>{item.value}</div>
                  <div className={styles.statLabel}>{item.label}</div>
                </article>
              ))}
            </div>

            <div className={styles.tableSection}>
              <div className={styles.tableHeader}>
                <div>
                  <div className={styles.tableTitle}>Daftar Konfirmasi Kehadiran</div>
                  <div className={styles.tableMeta}>
                    Menampilkan {pageStart}-{pageEnd} dari {sortedEntries.length} entri
                  </div>
                </div>
                <div className={styles.tableActions}>
                  <input
                    className={styles.searchInput}
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari brand, instansi, atau nama tamu..."
                  />
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={sortClassName("id")} onClick={() => toggleSort("id")}>
                        ID
                      </th>
                      <th className={sortClassName("brandName")} onClick={() => toggleSort("brandName")}>
                        Brand / Instansi
                      </th>
                      <th className={`${sortClassName("guestCount")} ${styles.hideMobile}`} onClick={() => toggleSort("guestCount")}>
                        Tamu Hadir
                      </th>
                      <th className={styles.tableHeading}>Daftar Tamu</th>
                      <th className={sortClassName("createdAt")} onClick={() => toggleSort("createdAt")}>
                        Waktu Masuk
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
                    <div className={styles.emptyIcon}>📭</div>
                    <div className={styles.emptyText}>Belum ada konfirmasi kehadiran</div>
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
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      <div className={`${styles.loadingOverlay} ${isLoadingData ? styles.loadingOverlayActive : ""}`}>
        <div className={styles.spinner} />
      </div>

      <div className={`${styles.toast} ${toastMessage ? styles.toastVisible : ""}`}>{toastMessage}</div>
    </main>
  );
}
