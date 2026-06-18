import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique booking reference
 */
export const generateBookingReference = () => {
  return `EVT-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 6).toUpperCase()}`;
};

/**
 * Generate QR code as data URL
 */
export const generateQRCode = async (data) => {
  return await QRCode.toDataURL(JSON.stringify(data), {
    width: 300,
    margin: 2,
    color: { dark: '#10b981', light: '#ffffff' },
  });
};

/**
 * Generate PDF ticket
 */
export const generateTicketPDF = (booking, event, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fillColor('#10b981').fontSize(24).text('EVENT TICKET', { align: 'center' });
    doc.moveDown();

    // Event details
    doc.fillColor('#1f2937').fontSize(18).text(event.title);
    doc.fontSize(12).fillColor('#6b7280');
    doc.text(`Date: ${new Date(event.date).toLocaleString()}`);
    doc.text(`Venue: ${event.venue.name}`);
    doc.text(`Address: ${event.venue.address}`);
    doc.moveDown();

    // Booking details
    doc.fillColor('#1f2937').fontSize(14).text('Booking Details');
    doc.fontSize(12).fillColor('#6b7280');
    doc.text(`Reference: ${booking.bookingReference}`);
    doc.text(`Attendee: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Tickets: ${booking.ticketCount}`);
    doc.text(`Amount: ₹${booking.totalAmount}`);
    doc.moveDown();

    // Seats
    if (booking.seats?.length) {
      doc.text('Seats: ' + booking.seats.map((s) => `${s.row}${s.number}`).join(', '));
    }

    // Footer
    doc.moveDown(2);
    doc.fillColor('#9ca3af').fontSize(10).text('Please present this ticket at the venue entrance.', { align: 'center' });

    doc.end();
  });
};

/**
 * Generate seat layout for an event
 */
export const generateSeats = (totalSeats, pricing) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let seatCount = 0;
  let rowIndex = 0;

  while (seatCount < totalSeats && rowIndex < rows.length) {
    const seatsPerRow = Math.min(10, totalSeats - seatCount);
    for (let i = 1; i <= seatsPerRow; i++) {
      let type = 'regular';
      let price = pricing.regular;
      if (rowIndex < 2) {
        type = 'premium';
        price = pricing.premium || pricing.regular * 1.5;
      } else if (rowIndex < 4) {
        type = 'vip';
        price = pricing.vip || pricing.regular * 1.2;
      }

      seats.push({
        row: rows[rowIndex],
        number: i,
        type,
        price: Math.round(price),
        isBooked: false,
      });
      seatCount++;
    }
    rowIndex++;
  }

  return seats;
};
