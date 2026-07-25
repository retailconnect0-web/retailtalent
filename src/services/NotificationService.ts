/**
 * Mock Notification Service
 * In a real-world scenario, this would call a server-side endpoint or Firebase Function 
 * which securely integrates with Twilio, Gupshup, or Meta WhatsApp Business API.
 */

class NotificationService {
  private adminWhatsAppNumber = "+919876543210"; // Placeholder for Admin Number

  async sendWhatsAppNotification(message: string): Promise<boolean> {
    console.log(`[WhatsApp API Mock] Sending to ${this.adminWhatsAppNumber}:`);
    console.log(message);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In reality, you'd do:
    // await fetch('/api/send-whatsapp', { method: 'POST', body: JSON.stringify({ message }) });
    
    return true;
  }

  async notifyBookingConfirmed(bookingDetails: { companyName: string, brand: string, industry: string, website: string, candidateName: string }) {
    const message = `🔔 *New Staff Booking Confirmed!*
    
*Company:* ${bookingDetails.companyName}
*Brand:* ${bookingDetails.brand}
*Industry:* ${bookingDetails.industry}
*Website:* ${bookingDetails.website}

*Candidate Booked:* ${bookingDetails.candidateName}

Please review the booking in the admin dashboard.`;

    await this.sendWhatsAppNotification(message);
  }

  async notifyCandidateHired(details: { companyName: string, candidateName: string, role: string }) {
    const message = `🎉 *Candidate Hired!*
    
*Company:* ${details.companyName}
has just hired
*Candidate:* ${details.candidateName}
*Role:* ${details.role}

Awesome work!`;

    await this.sendWhatsAppNotification(message);
  }
}

export const notificationService = new NotificationService();
