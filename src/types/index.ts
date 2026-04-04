// TypeScript types for RSVP system

export interface RsvpSubmission {
  brandName: string;
  guestCount: number;
  guestNames: string[];
}

export interface RsvpEntry {
  id: number;
  brandName: string;
  guestCount: number;
  guestNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RsvpStats {
  totalBrands: number;
  totalGuests: number;
  totalResponses: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AdminAuthRequest {
  password: string;
}

export interface ExportData {
  entries: RsvpEntry[];
  generatedAt: string;
}
