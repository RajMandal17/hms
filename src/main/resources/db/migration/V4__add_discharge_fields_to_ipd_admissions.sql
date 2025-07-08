-- Add dischargeSummary, dischargeTime, and totalBill columns to ipd_admissions
ALTER TABLE ipd_admissions ADD COLUMN discharge_summary VARCHAR(1024);
ALTER TABLE ipd_admissions ADD COLUMN discharge_time VARCHAR(16);
ALTER TABLE ipd_admissions ADD COLUMN total_bill DOUBLE;
