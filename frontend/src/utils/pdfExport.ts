import jsPDF from 'jspdf';

export function exportBillToPdf(bill: any) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Hospital Bill', 14, 20);
  doc.setFontSize(12);
  doc.text(`Bill ID: ${bill.id}`, 14, 35);
  doc.text(`Patient ID: ${bill.patientId}`, 14, 45);
  doc.text(`Type: ${bill.billType}`, 14, 55);
  doc.text(`Total Amount: ₹${bill.totalAmount}`, 14, 65);
  doc.text(`Paid Amount: ₹${bill.paidAmount}`, 14, 75);
  doc.text(`Status: ${bill.status}`, 14, 85);
  doc.text('Items:', 14, 95);
  let y = 105;
  bill.items?.forEach((item: any, idx: number) => {
    doc.text(`${idx + 1}. ${item.name} - ₹${item.amount}`, 18, y);
    y += 10;
  });
  doc.save(`bill-${bill.id}.pdf`);
}
