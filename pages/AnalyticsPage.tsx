
import React, { useState, useContext, useCallback } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Ensure this import style is compatible with esm.sh
import AnalyticsChart from '../components/AnalyticsChart';
import { MOCK_REPORTS_DATA, ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { EmailContext, ThemeContext } from '../contexts';
import { Email, EmailCategory, EmailPriority, Sentiment, AppTheme } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

interface ReportData {
  dateRange: { start: string; end: string };
  totalEmails: number;
  byCategory: { category: EmailCategory; count: number }[];
  byPriority: { priority: EmailPriority; count: number }[];
  bySentiment: { sentiment: Sentiment; count: number }[];
}

const AnalyticsPage: React.FC = () => {
  const emailContext = useContext(EmailContext);
  if (!emailContext) throw new Error("EmailContext not found");
  const { originalEmails } = emailContext;

  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(() => {
    if (!startDate || !endDate) {
      setGenerationError("Please select both a start and end date.");
      setReportData(null);
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Ensure end date includes the whole day

    if (start > end) {
      setGenerationError("Start date cannot be after end date.");
      setReportData(null);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setReportData(null);

    // Simulate async generation
    setTimeout(() => {
      const filtered = originalEmails.filter(email => {
        const emailDate = new Date(email.timestamp);
        return emailDate >= start && emailDate <= end;
      });

      const byCategory = Object.values(EmailCategory).map(cat => ({
        category: cat,
        count: filtered.filter(e => e.category === cat).length,
      })).filter(item => item.count > 0);

      const byPriority = Object.values(EmailPriority).map(pri => ({
        priority: pri,
        count: filtered.filter(e => e.priority === pri).length,
      })).filter(item => item.count > 0);
      
      const bySentiment = Object.values(Sentiment).map(sen => ({
        sentiment: sen,
        count: filtered.filter(e => e.sentiment === sen).length,
      })).filter(item => item.count > 0);

      setReportData({
        dateRange: { start: startDate, end: endDate },
        totalEmails: filtered.length,
        byCategory,
        byPriority,
        bySentiment,
      });
      setIsGenerating(false);
    }, 1000);

  }, [startDate, endDate, originalEmails]);

  const handleDownloadPdf = () => {
    if (!reportData) return;

    const doc: any = new jsPDF(); // Use 'any' type for simplicity
    const tableStartY = 40;
    const pageTitle = "Email Analytics Report";
    const dateRangeText = `Date Range: ${new Date(reportData.dateRange.start).toLocaleDateString()} - ${new Date(reportData.dateRange.end).toLocaleDateString()}`;
    const totalEmailsText = `Total Emails in Range: ${reportData.totalEmails}`;

    doc.setFontSize(18);
    doc.text(pageTitle, 14, 20);
    doc.setFontSize(11);
    doc.text(dateRangeText, 14, 30);
    doc.text(totalEmailsText, 14, 35);
    
    let currentY = tableStartY;
    
    const advanceYPosition = (jsPdfDoc: any, fallbackIncrement: number = 50) => { // jsPdfDoc as 'any'
      const lastTable = jsPdfDoc.lastAutoTable;
      if (lastTable && typeof lastTable.finalY === 'number') {
        return lastTable.finalY + 10;
      }
      return currentY + fallbackIncrement; 
    };

    if (reportData.byCategory.length > 0) {
      doc.setFontSize(14);
      doc.text("Emails by Category", 14, currentY + 5);
      currentY += 10;
      doc.autoTable({
        startY: currentY,
        head: [['Category', 'Count']],
        body: reportData.byCategory.map(item => [item.category, item.count]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, 
      });
      currentY = advanceYPosition(doc);
    }
    
    if (reportData.byPriority.length > 0) {
       doc.setFontSize(14);
       doc.text("Emails by Priority", 14, currentY + 5);
       currentY += 10;
       doc.autoTable({
        startY: currentY,
        head: [['Priority', 'Count']],
        body: reportData.byPriority.map(item => [item.priority, item.count]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
      });
      currentY = advanceYPosition(doc);
    }

    if (reportData.bySentiment.length > 0) {
      doc.setFontSize(14);
      doc.text("Emails by Sentiment", 14, currentY + 5);
      currentY += 10;
      doc.autoTable({
        startY: currentY,
        head: [['Sentiment', 'Count']],
        body: reportData.bySentiment.map(item => [item.sentiment, item.count]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    doc.save(`email_report_${reportData.dateRange.start}_to_${reportData.dateRange.end}.pdf`);
  };
  
  const reportButtonBg = theme === AppTheme.Dark ? accentDetails.darkButtonBg || accentDetails.buttonBg : accentDetails.buttonBg;
  const reportButtonHoverBg = theme === AppTheme.Dark ? accentDetails.darkButtonHoverBg || accentDetails.buttonHoverBg : accentDetails.buttonHoverBg;
  const focusRingClass = theme === AppTheme.Dark ? accentDetails.darkFocusRing : accentDetails.focusRing;

  const tableHeaderClass = "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider";
  const tableCellClass = "px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200";

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Email Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsChart
          title="Email Volume Trend (Last 7 Days)"
          type="bar"
          data={MOCK_REPORTS_DATA.volumeTrend}
        />
        <AnalyticsChart
          title="Sentiment Distribution"
          type="pie"
          data={MOCK_REPORTS_DATA.sentimentDistribution}
          colors={['#10B981', '#EF4444', '#F59E0B', '#6366F1']} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Filter Performance</h3>
            <p className="text-3xl font-bold text-green-500">95%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall Accuracy</p>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Correctly Filtered:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{MOCK_REPORTS_DATA.filterAccuracy.find(d => d.name === 'Correctly Filtered')?.value}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-red-500">False Positives:</span>
                    <span className="font-medium text-red-500">{MOCK_REPORTS_DATA.filterAccuracy.find(d => d.name === 'False Positives')?.value}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-yellow-500">False Negatives:</span>
                    <span className="font-medium text-yellow-500">{MOCK_REPORTS_DATA.filterAccuracy.find(d => d.name === 'False Negatives')?.value}</span>
                </div>
            </div>
        </div>

         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Response Time</h3>
            <p className="text-3xl font-bold text-blue-500">2.5 hrs</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average First Response</p>
            <p className="mt-4 text-xs text-green-500 flex items-center">{ICONS.checkCircle("w-4 h-4 mr-1")} 15% faster than last week</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Most Active Filters</h3>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Urgent Client Requests:</span> <span className="font-medium text-gray-800 dark:text-gray-100">125 hits</span></li>
                <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Newsletter Cleanup:</span> <span className="font-medium text-gray-800 dark:text-gray-100">88 hits</span></li>
                <li className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Project Phoenix Updates:</span> <span className="font-medium text-gray-800 dark:text-gray-100">62 hits</span></li>
            </ul>
        </div>
      </div>

       <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Custom Report</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-1 ${focusRingClass} flex-grow`}
              aria-label="Start date for report"
            />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-1 ${focusRingClass} flex-grow`}
              aria-label="End date for report"
            />
            <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className={`px-4 py-2 ${reportButtonBg} ${reportButtonHoverBg} text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === AppTheme.Dark ? accentDetails.darkFocusRing + ' dark:focus:ring-offset-gray-800' : accentDetails.focusRing + ' focus:ring-offset-white'} flex items-center justify-center disabled:opacity-50`}
            >
              {isGenerating ? <LoadingSpinner size="sm" /> : ICONS.analytics("w-5 h-5 mr-2")}
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </button>
        </div>
        {generationError && <p className="text-sm text-red-500 dark:text-red-400 mb-4">{generationError}</p>}
        
        {isGenerating && !reportData && (
          <div className="text-center py-4">
            <LoadingSpinner text="Crunching the numbers..." />
          </div>
        )}

        {reportData && !isGenerating && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Report for: {new Date(reportData.dateRange.start).toLocaleDateString()} - {new Date(reportData.dateRange.end).toLocaleDateString()}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Emails: {reportData.totalEmails}</p>
                </div>
                <button
                    onClick={handleDownloadPdf}
                    className={`px-4 py-2 ${reportButtonBg} ${reportButtonHoverBg} text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === AppTheme.Dark ? accentDetails.darkFocusRing + ' dark:focus:ring-offset-gray-800' : accentDetails.focusRing + ' focus:ring-offset-white'} flex items-center justify-center`}
                >
                    {ICONS.archive("w-5 h-5 mr-2")} 
                    Download PDF
                </button>
            </div>

            {reportData.totalEmails === 0 ? (
                 <p className="text-gray-500 dark:text-gray-400">No emails found for the selected date range.</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportData.byCategory.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner">
                  <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-100">By Category</h5>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead><tr><th className={tableHeaderClass}>Category</th><th className={tableHeaderClass}>Count</th></tr></thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {reportData.byCategory.map(item => <tr key={item.category}>
                        <td className={tableCellClass}>{item.category}</td>
                        <td className={tableCellClass}>{item.count}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}
              {reportData.byPriority.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner">
                  <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-100">By Priority</h5>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead><tr><th className={tableHeaderClass}>Priority</th><th className={tableHeaderClass}>Count</th></tr></thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {reportData.byPriority.map(item => <tr key={item.priority}>
                        <td className={tableCellClass}>{item.priority}</td>
                        <td className={tableCellClass}>{item.count}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}
              {reportData.bySentiment.length > 0 && (
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner">
                  <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-100">By Sentiment</h5>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead><tr><th className={tableHeaderClass}>Sentiment</th><th className={tableHeaderClass}>Count</th></tr></thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {reportData.bySentiment.map(item => <tr key={item.sentiment}>
                        <td className={tableCellClass}>{item.sentiment}</td>
                        <td className={tableCellClass}>{item.count}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default AnalyticsPage;
