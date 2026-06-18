import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { format } from 'date-fns';
import { getDateLocale } from './dateLocale';

/**
 * Generate and download a valid PDF event ticket (client-side, no backend).
 */
export async function downloadTicketPdf(booking, user, language = 'en') {
  const event = booking.event;
  if (!event) throw new Error('Event data missing');

  const locale = getDateLocale(language);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Header band — brand slate-blue
  doc.setFillColor(94, 190, 196);
  doc.rect(0, 0, 210, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('EVENT TICKET', 105, 22, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('EventOrganizer', 105, 32, { align: 'center' });

  // Event title
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(event.title, 170);
  doc.text(titleLines, 20, 58);

  let y = 58 + titleLines.length * 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);

  const rows = [
    ['Date', format(new Date(event.date), 'PPPP p', { locale })],
    ['Venue', `${event.venue?.name || ''}, ${event.venue?.address || ''}`],
    ['City', event.venue?.city || ''],
    ['Reference', booking.bookingReference],
    ['Attendee', user?.name || 'Guest'],
    ['Email', user?.email || ''],
    ['Tickets', String(booking.ticketCount)],
    ['Amount', `₹${booking.totalAmount?.toLocaleString('en-IN')}`],
  ];

  if (booking.seats?.length) {
    rows.push(['Seats', booking.seats.map((s) => `${s.row}${s.number}`).join(', ')]);
  }

  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(String(value), 120);
    doc.text(lines, 55, y);
    y += Math.max(7, lines.length * 6);
  });

  // QR code
  const qrPayload = JSON.stringify({
    ref: booking.bookingReference,
    event: event._id,
    user: user?.id || user?._id,
  });

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 200,
    margin: 1,
    color: { dark: '#f92c85', light: '#ffffff' },
  });

  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(130, 55, 60, 75, 3, 3);
  doc.addImage(qrDataUrl, 'PNG', 135, 60, 50, 50);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Scan at venue', 155, 118, { align: 'center' });

  // Footer
  doc.setFillColor(253, 245, 223);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Please present this ticket (printed or on mobile) at the venue entrance.', 105, 282, { align: 'center' });
  doc.text('This ticket is non-transferable. © EventOrganizer', 105, 290, { align: 'center' });

  doc.save(`ticket-${booking.bookingReference}.pdf`);
}
