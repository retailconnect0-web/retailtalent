import { getFirebaseDb } from "@/lib/firebase/config";

export interface StaffBooking {
  id?: string;
  recruiterId: string;
  candidateId: string;
  companyName: string;
  brand: string;
  industry: string;
  companyWebsite: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

class BookingService {
  async createBooking(booking: Omit<StaffBooking, "id" | "createdAt" | "status">): Promise<StaffBooking> {
    const { collection, addDoc } = await import("firebase/firestore");
    const db = await getFirebaseDb();
    
    const newBooking: Omit<StaffBooking, "id"> = {
      ...booking,
      status: "Confirmed", // Auto-confirm for this prototype
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "bookings"), newBooking);
    
    return {
      id: docRef.id,
      ...newBooking
    } as StaffBooking;
  }
}

export const bookingService = new BookingService();
