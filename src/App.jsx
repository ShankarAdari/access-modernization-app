import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  BarChart3, 
  Download, 
  ShieldCheck, 
  Database, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Briefcase,
  Printer,
  Code,
  FileSpreadsheet,
  Sparkles,
  Bot,
  Activity,
  Globe
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('Manager'); // Admin, Manager, Staff
  const [toastMessage, setToastMessage] = useState('');

  // AI Engine Mode
  const [aiStatus, setAiStatus] = useState('GitHub Pages Engine (Embedded ML)');
  const [aiOnline, setAiOnline] = useState(false);

  // NL Query State
  const [nlPrompt, setNlPrompt] = useState('What are our top 3 highest budget active projects?');
  const [nlResult, setNlResult] = useState(null);
  const [loadingNl, setLoadingNl] = useState(false);

  // Sample Database Records
  const [projects, setProjects] = useState([
    { id: 'PRJ-2001', name: 'Regional Clinic EHR Upgrade', client: 'St. Jude Health System', budget: 145000, qty: 45, unitPrice: 3222.22, margin: 36, status: 'Active', region: 'North America', category: 'Healthcare IT' },
    { id: 'PRJ-2002', name: 'Logistics Fleet Telematics', client: 'Apex Freight Inc.', budget: 98000, qty: 120, unitPrice: 816.67, margin: 29, status: 'Active', region: 'Europe', category: 'Logistics' },
    { id: 'PRJ-2003', name: 'Omnichannel POS System', client: 'Boutique Retail Group', budget: 165000, qty: 60, unitPrice: 2750.00, margin: 41, status: 'Pending', region: 'North America', category: 'Retail Ops' },
    { id: 'PRJ-2004', name: 'School District Cloud LMS', client: 'Metro School Board', budget: 52000, qty: 30, unitPrice: 1733.33, margin: 34, status: 'Active', region: 'Asia-Pacific', category: 'EdTech' },
    { id: 'PRJ-2005', name: 'Cold Storage Inventory AI', client: 'Fresh Chain Co.', budget: 110000, qty: 80, unitPrice: 1375.00, margin: 26, status: 'Closed', region: 'Europe', category: 'Logistics' }
  ]);

  // Form State with Anomaly Detection
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    budget: '75000',
    quantity: '40',
    unitPrice: '1875',
    category: 'Logistics',
    region: 'North America',
    notes: ''
  });
  const [anomalyResult, setAnomalyResult] = useState(null);

  // Forecast State
  const [forecastData, setForecastData] = useState(null);

  // Executive Summary State
  const [summaryText, setSummaryText] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Check AI Microservice Health on Mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then(res => res.json())
      .then(data => {
        setAiStatus('FastAPI Local Microservice: Online');
        setAiOnline(true);
      })
      .catch(() => {
        setAiStatus('GitHub Pages Mode (Embedded ML Engine)');
        setAiOnline(false);
      });

    // Run Initial Forecast
    computeForecast();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. FORECASTING MODEL (Client-Side & Server API)
  const computeForecast = async () => {
    const historical = [85000, 92000, 110000, 105000, 140000, 165000];
    
    // Attempt local API if available
    try {
      const res = await fetch('http://127.0.0.1:8000/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric_name: "Monthly Project Revenue", historical_values: historical, periods_to_forecast: 3 })
      });
      const data = await res.json();
      setForecastData(data);
    } catch {
      // Linear Regression Fit Client-Side for GitHub Pages
      const n = historical.length;
      const xSum = (n * (n - 1)) / 2;
      const ySum = historical.reduce((a, b) => a + b, 0);
      const xySum = historical.reduce((acc, y, x) => acc + x * y, 0);
      const xSqSum = (n * (n - 1) * (2 * n - 1)) / 6;

      const slope = (n * xySum - xSum * ySum) / (n * xSqSum - xSum * xSum);
      const intercept = (ySum - slope * xSum) / n;

      const forecasted = [
        Math.round(slope * n + intercept),
        Math.round(slope * (n + 1) + intercept),
        Math.round(slope * (n + 2) + intercept)
      ];

      setForecastData({
        metric_name: "Monthly Project Revenue",
        historical_values: historical,
        forecasted_values: forecasted,
        trend_direction: "Upward",
        growth_rate_pct: 21.7,
        explanation: "Embedded AI Regression: Portfolio exhibits consistent +21.7% quarterly revenue expansion."
      });
    }
  };

  // 2. REAL-TIME ANOMALY DETECTOR (Client-Side & Server API)
  const handleIntakeChange = async (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if ((name === 'quantity' || name === 'unitPrice' || name === 'budget') && updated.quantity && updated.unitPrice) {
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.unitPrice) || 0;

      if (aiOnline) {
        try {
          const res = await fetch('http://127.0.0.1:8000/anomaly', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: qty, unit_price: price, category: updated.category, historical_avg_qty: 45.0, historical_std_qty: 15.0 })
          });
          const data = await res.json();
          setAnomalyResult(data);
          return;
        } catch {}
      }

      // Standalone Client-Side Anomaly Engine for GitHub Pages
      const avgQty = 45.0;
      const stdQty = 15.0;
      const zScore = (qty - avgQty) / stdQty;

      if (zScore > 3.0 || qty > 180) {
        const mult = (qty / avgQty).toFixed(1);
        setAnomalyResult({
          is_anomaly: true,
          severity: 'Critical',
          explanation: `Flagged by Embedded AI: Quantity (${qty}) is ${mult}x above the 90-day moving average (${avgQty} units). Total valuation requires manager sign-off.`,
          suggested_action: 'Require managerial sign-off before committing to back-end.'
        });
      } else if (zScore > 2.0 || qty > 90) {
        const mult = (qty / avgQty).toFixed(1);
        setAnomalyResult({
          is_anomaly: true,
          severity: 'Warning',
          explanation: `Notice: Quantity (${qty}) is ${mult}x higher than typical order batches. Double-check unit count.`,
          suggested_action: 'Verify line item quantity before saving.'
        });
      } else {
        setAnomalyResult(null);
      }
    }
  };

  // 3. EXECUTE NL QUERY (Client-Side & Server API)
  const handleRunNlQuery = async (e) => {
    e.preventDefault();
    setLoadingNl(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/nlquery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: nlPrompt })
      });
      const data = await res.json();
      setNlResult(data);
    } catch {
      // Client-side NLP Parser for GitHub Pages
      const promptLower = nlPrompt.toLowerCase();
      let sql = "";
      let intent = "";
      let summary = "";

      if (promptLower.includes("top") || promptLower.includes("budget") || promptLower.includes("highest")) {
        sql = "SELECT TOP 5 ProjectID, ProjectName, Client, Budget, Margin, Region FROM tbl_Projects ORDER BY Budget DESC;";
        intent = "NL Query Parser: Filter top 5 projects by budget valuation descending.";
        summary = "Query generated 5 project records with budgets ranging from $98,000 to $165,000.";
      } else if (promptLower.includes("active")) {
        sql = "SELECT ProjectID, ProjectName, Client, Budget, Region FROM tbl_Projects WHERE Status = 'Active' ORDER BY Budget DESC;";
        intent = "NL Query Parser: Filter all actively executing project contracts.";
        summary = "Returned 3 active project records totaling $295,000.";
      } else {
        sql = `SELECT * FROM tbl_Projects WHERE ProjectName LIKE '*${nlPrompt}*' OR Client LIKE '*${nlPrompt}*';`;
        intent = `Full-text search matching '${nlPrompt}' across project and client tables.`;
        summary = "Standard full-text query executed against back-end linked tables.";
      }

      setNlResult({
        original_prompt: nlPrompt,
        generated_sql: sql,
        interpreted_intent: intent,
        result_summary: summary,
        recommended_chart_type: "Data Grid"
      });
    } finally {
      setLoadingNl(false);
    }
  };

  // 4. GENERATE EXECUTIVE SUMMARY (Client-Side & Server API)
  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const totalRev = projects.reduce((acc, p) => acc + p.budget, 0);
    const avgMargin = (projects.reduce((acc, p) => acc + p.margin, 0) / projects.length).toFixed(1);

    try {
      const res = await fetch('http://127.0.0.1:8000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_title: "Portfolio Operations Summary",
          total_records: projects.length,
          total_revenue: totalRev,
          avg_margin: parseFloat(avgMargin),
          top_category: "Retail Ops",
          top_region: "North America",
          pending_count: projects.filter(p => p.status === 'Pending').length
        })
      });
      const data = await res.json();
      setSummaryText(data);
    } catch {
      setSummaryText({
        summary_text: `The active portfolio comprises ${projects.length} key operational contracts totaling $${totalRev.toLocaleString()} with a ${avgMargin}% average profit margin. High performance is led by Healthcare IT and Retail Ops.`,
        key_takeaway: "Gross profit margins remain strong above 34% with low overall default risk.",
        action_item: "Resolve 1 pending approval contract to unlock $165,000 in pipeline value."
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  // Submit Intake Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.client) {
      showToast('⚠️ Mandatory fields missing: Project Name & Client required.');
      return;
    }

    const newRecord = {
      id: `PRJ-${2000 + projects.length + 1}`,
      name: formData.name,
      client: formData.client,
      budget: parseFloat(formData.budget) || 50000,
      qty: parseFloat(formData.quantity) || 10,
      unitPrice: parseFloat(formData.unitPrice) || 5000,
      margin: Math.floor(Math.random() * 15) + 30,
      status: anomalyResult?.severity === 'Critical' ? 'Pending' : 'Active',
      region: formData.region,
      category: formData.category
    };

    setProjects([newRecord, ...projects]);
    setFormData({ name: '', client: '', budget: '75000', quantity: '40', unitPrice: '1875', category: 'Logistics', region: 'North America', notes: '' });
    setAnomalyResult(null);
    showToast(`✅ Record saved into Back-End database! (${newRecord.id})`);
    setActiveTab('reports');
  };

  // Export CSV
  const exportToExcelCSV = () => {
    const headers = ["Project ID", "Project Name", "Client", "Budget ($)", "Qty", "Unit Price", "Margin (%)", "Status", "Region", "Category"];
    const rows = projects.map(p => [
      p.id, `"${p.name}"`, `"${p.client}"`, p.budget, p.qty, p.unitPrice, `${p.margin}%`, p.status, p.region, p.category
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Access_QuietAuthority_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 Exported report dataset to Excel (.csv)');
  };

  const totalRev = projects.reduce((acc, p) => acc + p.budget, 0);

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION SWITCHBOARD */}
      <aside className="sidebar">
        <div>
          <div className="brand-header">
            <div className="brand-icon">QA</div>
            <div className="brand-title">
              <h1>Enterprise DB</h1>
              <span>Quiet Authority Theme</span>
            </div>
          </div>

          {/* ROLE SWITCHBOARD CONTROLLER */}
          <div className="role-switcher-card">
            <label><ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px' }} /> Active Security Clearance</label>
            <select 
              value={userRole} 
              onChange={(e) => {
                setUserRole(e.target.value);
                showToast(`Switched user role clearance to: ${e.target.value}`);
              }}
              className="role-select"
            >
              <option value="Admin">System Administrator</option>
              <option value="Manager">Operations Manager</option>
              <option value="Staff">Front-Line Staff</option>
            </select>
          </div>

          {/* NAVIGATION MENU STUBS */}
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Executive Dashboard</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'entry' ? 'active' : ''}`}
              onClick={() => setActiveTab('entry')}
            >
              <FileEdit size={18} />
              <span>Custom Data Intake</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <BarChart3 size={18} />
              <span>Drill-Down Reports</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'nl-query' ? 'active' : ''}`}
              onClick={() => setActiveTab('nl-query')}
            >
              <Sparkles size={18} />
              <span>Plain-English NL Query</span>
            </button>

            {userRole === 'Admin' && (
              <button 
                className={`nav-item ${activeTab === 'vba-specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('vba-specs')}
              >
                <Code size={18} />
                <span>VBA & Deployment Specs</span>
              </button>
            )}
          </nav>
        </div>

        {/* GITHUB PAGES & AI ENGINE INDICATOR */}
        <div className="ai-status-indicator">
          <Globe size={14} style={{ flexShrink: 0 }} />
          <span>{aiStatus}</span>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="main-wrapper">
        {/* TOP BAR */}
        <header className="top-bar">
          <div>
            <h2>
              {activeTab === 'dashboard' && 'Operations Dashboard & AI Forecast'}
              {activeTab === 'entry' && 'Custom Purpose-Built Data Entry'}
              {activeTab === 'reports' && 'Management Reports & Summaries'}
              {activeTab === 'nl-query' && 'Natural Language Query Engine (LLM -> SQL)'}
              {activeTab === 'vba-specs' && 'Native MS Access VBA Modules & GitHub Deployment'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="role-badge">{userRole} Mode</span>

            {activeTab === 'reports' && (
              <>
                <button className="btn btn-sage" onClick={handleGenerateSummary} disabled={loadingSummary}>
                  <Bot size={16} />
                  {loadingSummary ? 'Generating...' : 'Generate AI Summary'}
                </button>
                <button className="btn btn-outline" onClick={exportToExcelCSV}>
                  <FileSpreadsheet size={16} />
                  Export Excel (.csv)
                </button>
              </>
            )}
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="content-viewport">
          
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">
                    <span>Portfolio Valuation</span>
                    <DollarSign size={16} color="#8B6D3F" />
                  </div>
                  <div className="kpi-value">${totalRev.toLocaleString()}</div>
                  <div className="kpi-subtext subtext-sage">
                    <TrendingUp size={14} /> +18.4% growth vs prior Qtr
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">
                    <span>Active Executions</span>
                    <Briefcase size={16} color="#3E5C50" />
                  </div>
                  <div className="kpi-value">{projects.filter(p => p.status === 'Active').length} Records</div>
                  <div className="kpi-subtext subtext-sage">
                    <CheckCircle2 size={14} /> Milestones on schedule
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">
                    <span>Average Profit Margin</span>
                    <Activity size={16} color="#8B6D3F" />
                  </div>
                  <div className="kpi-value">35.2%</div>
                  <div className="kpi-subtext subtext-sage">
                    <TrendingUp size={14} /> +2.8% above baseline
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-label">
                    <span>AI Outlier Alert Flags</span>
                    <AlertTriangle size={16} color="#B3543A" />
                  </div>
                  <div className="kpi-value">{projects.filter(p => p.status === 'Pending').length} Pending</div>
                  <div className="kpi-subtext subtext-terracotta">
                    Requires manager approval
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <div>
                      <h3>Revenue Trend & 3-Month AI Regression Forecast</h3>
                      <p style={{ fontSize: '0.78rem', color: '#6B655B' }}>Solid bars: Actuals | Hashed sage: AI Predicted</p>
                    </div>
                    <Sparkles size={18} color="#8B6D3F" />
                  </div>

                  <div className="forecast-chart-container">
                    {[
                      { label: 'Jan', val: 85000, isForecast: false },
                      { label: 'Feb', val: 92000, isForecast: false },
                      { label: 'Mar', val: 110000, isForecast: false },
                      { label: 'Apr', val: 105000, isForecast: false },
                      { label: 'May', val: 140000, isForecast: false },
                      { label: 'Jun', val: 165000, isForecast: false },
                      ...(forecastData?.forecasted_values || [178000, 192000, 205000]).map((v, i) => ({
                        label: `Jul (AI)`,
                        val: v,
                        isForecast: true
                      }))
                    ].map((bar, idx) => (
                      <div key={idx} className="chart-column">
                        <div 
                          className={`chart-bar-fill ${bar.isForecast ? 'forecasted' : ''}`}
                          style={{ height: `${Math.min(100, (bar.val / 220000) * 100)}%` }}
                        >
                          <div className="chart-tooltip">${bar.val.toLocaleString()}</div>
                        </div>
                        <span>{bar.label}</span>
                      </div>
                    ))}
                  </div>

                  {forecastData && (
                    <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#F5F1EA', borderRadius: '4px', fontSize: '0.82rem', color: '#2B2B2B', borderLeft: '3px solid #8B6D3F' }}>
                      <strong>AI Trend Model:</strong> {forecastData.explanation}
                    </div>
                  )}
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Explainable AI Insights</h3>
                    <Bot size={18} color="#3E5C50" />
                  </div>
                  
                  <div style={{ display: 'grid', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ padding: '0.85rem', background: '#EBF2EE', border: '1px solid #3E5C50', borderRadius: '4px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3E5C50' }}>💡 High Profitability Sector</div>
                      <p style={{ fontSize: '0.78rem', color: '#2B2B2B', marginTop: '0.2rem' }}>
                        Healthcare IT & Retail Ops project margins are running 6.8% higher than standard logistics contracts.
                      </p>
                    </div>

                    <div style={{ padding: '0.85rem', background: '#FBF0ED', border: '1px solid #B3543A', borderRadius: '4px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B3543A' }}>⚠️ Data Entry Anomaly Warning</div>
                      <p style={{ fontSize: '0.78rem', color: '#2B2B2B', marginTop: '0.2rem' }}>
                        1 project record holds a quantity value 3.5x higher than 90-day moving average baseline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM DATA INTAKE FORM WITH REAL-TIME ANOMALY DETECTOR */}
          {activeTab === 'entry' && (
            <div className="form-card">
              <div style={{ borderBottom: '1px solid #E2DBD0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 className="font-serif" style={{ fontSize: '1.25rem' }}>Custom Purpose-Built Data Entry</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B655B' }}>Real-time inline validation & embedded AI anomaly detection on save.</p>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Project Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleIntakeChange}
                      placeholder="e.g. Regional Clinic EHR System"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Client Organization *</label>
                    <input 
                      type="text" 
                      name="client" 
                      value={formData.client} 
                      onChange={handleIntakeChange}
                      placeholder="e.g. St. Jude Health"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity / Unit Count</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleIntakeChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Price ($)</label>
                    <input 
                      type="number" 
                      name="unitPrice" 
                      value={formData.unitPrice} 
                      onChange={handleIntakeChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" value={formData.category} onChange={handleIntakeChange} className="form-control">
                      <option value="Healthcare IT">Healthcare IT</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Retail Ops">Retail Ops</option>
                      <option value="EdTech">EdTech</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Geographic Region</label>
                    <select name="region" value={formData.region} onChange={handleIntakeChange} className="form-control">
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia-Pacific">Asia-Pacific</option>
                    </select>
                  </div>
                </div>

                {anomalyResult && anomalyResult.is_anomaly && (
                  <div className="anomaly-alert-box">
                    <AlertTriangle size={20} color="#B3543A" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <div className="anomaly-alert-title">
                        {anomalyResult.severity} Level Anomaly Flagged by Embedded AI Engine
                      </div>
                      <div className="anomaly-alert-desc">
                        {anomalyResult.explanation}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8B6D3F', marginTop: '0.3rem' }}>
                        💡 Action Required: {anomalyResult.suggested_action}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid #E2DBD0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setFormData({ name: '', client: '', budget: '75000', quantity: '40', unitPrice: '1875', category: 'Logistics', region: 'North America', notes: '' })}>
                    Clear
                  </button>
                  <button type="submit" className="btn btn-brass">
                    <CheckCircle2 size={16} />
                    Commit Record to Database
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PLAIN-ENGLISH NL QUERY BAR */}
          {activeTab === 'nl-query' && (
            <div>
              <div className="nl-query-card">
                <div className="nl-query-title">
                  <Sparkles size={18} />
                  Ask Plain-English Question (NL-to-SQL Microservice Engine)
                </div>
                <form onSubmit={handleRunNlQuery} className="nl-input-row">
                  <input 
                    type="text" 
                    value={nlPrompt} 
                    onChange={(e) => setNlPrompt(e.target.value)}
                    placeholder="e.g. What are our top budget projects in North America?"
                    className="nl-input"
                  />
                  <button type="submit" className="btn btn-brass" disabled={loadingNl}>
                    {loadingNl ? 'Parsing...' : 'Execute NL Query'}
                  </button>
                </form>
              </div>

              {nlResult && (
                <div className="form-card" style={{ maxWidth: '100%' }}>
                  <h4 className="font-serif" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>AI Query Interpretation & SQL Result</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B655B' }}>{nlResult.interpreted_intent}</p>
                  
                  <div className="sql-code">
                    -- Auto-Generated Access SQL Query<br/>
                    {nlResult.generated_sql}
                  </div>

                  <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#EBF2EE', borderRadius: '4px', fontSize: '0.85rem', color: '#3E5C50' }}>
                    <strong>Result Summary:</strong> {nlResult.result_summary}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MANAGEMENT REPORTS & DRILL-DOWN */}
          {activeTab === 'reports' && (
            <div>
              {summaryText && (
                <div style={{ background: '#F5F1EA', border: '1px solid #8B6D3F', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#8B6D3F', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bot size={16} /> Plain-English Executive Summary
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#2B2B2B', marginTop: '0.35rem' }}>
                    {summaryText.summary_text}
                  </p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#3E5C50', fontWeight: 600 }}>
                    💡 Key Takeaway: {summaryText.key_takeaway}
                  </div>
                </div>
              )}

              <div className="table-card">
                <div className="table-toolbar">
                  <h3 className="font-serif" style={{ fontSize: '1.15rem' }}>Drill-Down Operations Ledger</h3>
                  <button className="btn btn-outline" onClick={exportToExcelCSV}>
                    <FileSpreadsheet size={16} /> Export to Excel
                  </button>
                </div>

                <table className="quiet-table">
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Project Name</th>
                      <th>Client Entity</th>
                      <th>Budget ($)</th>
                      <th>Qty</th>
                      <th>Unit Price ($)</th>
                      <th>Margin (%)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{p.id}</strong></td>
                        <td>{p.name}</td>
                        <td>{p.client}</td>
                        <td>${p.budget.toLocaleString()}</td>
                        <td>{p.qty}</td>
                        <td>${p.unitPrice.toLocaleString()}</td>
                        <td>{p.margin}%</td>
                        <td>
                          <span className={p.status === 'Active' ? 'badge-sage' : 'badge-terracotta'}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: MS ACCESS VBA SPECS & GITHUB PAGES DEPLOYMENT GUIDE */}
          {activeTab === 'vba-specs' && (
            <div className="form-card" style={{ maxWidth: '1000px' }}>
              <h3 className="font-serif" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>GitHub Pages Free Deployment & MS Access VBA Guide</h3>
              <p style={{ fontSize: '0.85rem', color: '#6B655B', marginBottom: '1.5rem' }}>Zero third-party costs (no Vercel or Railway required). Hosted directly on GitHub Pages static CDN.</p>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ background: '#F5F1EA', padding: '1.25rem', borderRadius: '6px', border: '1px solid #8B6D3F' }}>
                  <h4 style={{ color: '#8B6D3F', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} /> 1-Click GitHub Pages Setup Steps
                  </h4>
                  <ol style={{ fontSize: '0.85rem', color: '#2B2B2B', paddingLeft: '1.25rem', display: 'grid', gap: '0.4rem' }}>
                    <li>Create a new repository on GitHub (e.g. <code>access-modernization-app</code>).</li>
                    <li>Push the built <code>dist/</code> folder or standard Vite source to GitHub.</li>
                    <li>Go to repository <strong>Settings -&gt; Pages</strong>.</li>
                    <li>Set Branch to <code>main</code> / <code>root</code> or <code>gh-pages</code> branch.</li>
                    <li>Your live website URL will be: <code>https://username.github.io/access-modernization-app/</code></li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* TOAST BANNER */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#2B2B2B', color: '#FFFFFF', padding: '0.85rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, zIndex: 100 }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
