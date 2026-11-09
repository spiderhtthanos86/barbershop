import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Download, Calendar, Clock, CalendarDays } from 'lucide-react';

export default function ExportPanel({ allTimeHistory }) {
  const [exporting, setExporting] = useState(false);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDayName = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', { weekday: 'long' });
  };

  // ─── Filter data based on period ────────────────────────────────────────────

  const filterByPeriod = (period) => {
    const now = new Date();
    return allTimeHistory.filter(item => {
      const itemDate = new Date(item.completedAt);
      if (period === 'today') {
        return itemDate.toDateString() === now.toDateString();
      }
      if (period === 'month') {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      return true; // 'all'
    });
  };

  // ─── Build Excel and trigger download ───────────────────────────────────────

  const generateExcel = (period) => {
    setExporting(true);
    try {
      const data = filterByPeriod(period);

      if (data.length === 0) {
        alert('No records found for the selected period.');
        setExporting(false);
        return;
      }

      // ── Sheet 1: Full History (one row per cut) ──────────────────────────────
      const historyRows = data.map((item, index) => ({
        'Sr. No.': index + 1,
        'Customer Name': item.customerName || '—',
        'Barber / Chair': item.barberName || '—',
        'Price (₹)': Number(item.cost) || 0,
        'Date': formatDate(item.completedAt),
        'Time': formatTime(item.completedAt),
        'Day': getDayName(item.completedAt)
      }));

      const sheet1 = XLSX.utils.json_to_sheet(historyRows);

      // Set column widths
      sheet1['!cols'] = [
        { wch: 8 },   // Sr. No.
        { wch: 20 },  // Customer Name
        { wch: 18 },  // Barber / Chair
        { wch: 12 },  // Price
        { wch: 14 },  // Date
        { wch: 12 },  // Time
        { wch: 12 }   // Day
      ];

      // ── Sheet 2: Daily Summary (grouped by date) ─────────────────────────────
      const dayMap = {};
      data.forEach(item => {
        const dateKey = formatDate(item.completedAt);
        const dayName = getDayName(item.completedAt);
        if (!dayMap[dateKey]) {
          dayMap[dateKey] = { date: dateKey, day: dayName, cuts: 0, revenue: 0 };
        }
        dayMap[dateKey].cuts += 1;
        dayMap[dateKey].revenue += Number(item.cost) || 0;
      });

      const summaryRows = Object.values(dayMap)
        .sort((a, b) => {
          // Sort by date descending (most recent first)
          const [da, ma, ya] = a.date.split('/').map(Number);
          const [db2, mb, yb] = b.date.split('/').map(Number);
          return new Date(yb, mb - 1, db2) - new Date(ya, ma - 1, da);
        })
        .map((row, index) => ({
          'Sr. No.': index + 1,
          'Date': row.date,
          'Day': row.day,
          'Total Cuts': row.cuts,
          'Total Revenue (₹)': row.revenue
        }));

      const sheet2 = XLSX.utils.json_to_sheet(summaryRows);
      sheet2['!cols'] = [
        { wch: 8 },   // Sr. No.
        { wch: 14 },  // Date
        { wch: 12 },  // Day
        { wch: 12 },  // Total Cuts
        { wch: 20 }   // Total Revenue
      ];

      // ── Build workbook with both sheets ─────────────────────────────────────
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet1, 'Full History');
      XLSX.utils.book_append_sheet(workbook, sheet2, 'Daily Summary');

      // ── Build filename based on period ───────────────────────────────────────
      const now = new Date();
      const monthName = now.toLocaleString('en-IN', { month: 'long' });
      const year = now.getFullYear();
      const today = formatDate(now.toISOString()).replace(/\//g, '-');

      const filenameMap = {
        today: `TrimTime_Today_${today}.xlsx`,
        month: `TrimTime_${monthName}_${year}.xlsx`,
        all: `TrimTime_AllTime_${year}.xlsx`
      };

      XLSX.writeFile(workbook, filenameMap[period]);
    } catch (err) {
      console.error('Excel export failed:', err);
      alert('Export failed. Please try again.');
    }
    setExporting(false);
  };

  // ─── Stats preview ──────────────────────────────────────────────────────────

  const totalRevenue = allTimeHistory.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const today = new Date().toDateString();
  const todayCuts = allTimeHistory.filter(item => new Date(item.completedAt).toDateString() === today).length;

  return (
    <div className="admin-action-card export-panel-card">
      <h3 className="admin-card-title">
        <FileSpreadsheet size={16} className="text-gold" />
        Export &amp; Reports
      </h3>

      {/* Quick Stats */}
      <div className="export-stats-row">
        <div className="export-stat-box">
          <span className="export-stat-value">{allTimeHistory.length}</span>
          <span className="export-stat-label">All-Time Cuts</span>
        </div>
        <div className="export-stat-box">
          <span className="export-stat-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
          <span className="export-stat-label">All-Time Revenue</span>
        </div>
        <div className="export-stat-box">
          <span className="export-stat-value">{todayCuts}</span>
          <span className="export-stat-label">Today's Cuts</span>
        </div>
      </div>

      <p className="export-info-text">
        Downloads a <strong>.xlsx</strong> file with 2 sheets: Full History + Daily Summary
      </p>

      {/* Export Buttons */}
      <div className="export-buttons-list">
        <button
          className="btn-export"
          onClick={() => generateExcel('today')}
          disabled={exporting}
        >
          <Clock size={14} />
          <span>Export Today</span>
        </button>

        <button
          className="btn-export"
          onClick={() => generateExcel('month')}
          disabled={exporting}
        >
          <Calendar size={14} />
          <span>Export This Month</span>
        </button>

        <button
          className="btn-export btn-export-primary"
          onClick={() => generateExcel('all')}
          disabled={exporting}
        >
          <Download size={14} />
          <span>{exporting ? 'Generating...' : 'Export All Time'}</span>
        </button>
      </div>

      <p className="export-note-text">
        📌 This data is <strong>permanently stored</strong> and never deleted by "Reset Completed Log".
      </p>
    </div>
  );
}
