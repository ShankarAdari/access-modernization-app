# Deployment & Role Onboarding Guide — AI-Enhanced Microsoft Access Modernization

---

## 1. Front-End / Back-End Relinking Guide

When deploying the updated Front-End (`Database_fe.accdb`) to client workstations or connecting to a moved Back-End (`Database_be.accdb`), use the built-in Linked Table Manager or run the following automated VBA relinking subroutine:

```vba
Public Sub RelinkBackEnd(ByVal NewBackEndPath As String)
    Dim db As DAO.Database
    Dim tdf As DAO.TableDef
    
    Set db = CurrentDb
    For Each tdf In db.TableDefs
        If Len(tdf.Connect) > 0 Then
            ' Update linked database path
            tdf.Connect = ";DATABASE=" & NewBackEndPath
            tdf.RefreshLink
        End If
    Next tdf
    MsgBox "All linked tables successfully reconnected to: " & NewBackEndPath, vbInformation, "Relink Complete"
End Sub
```

---

## 2. Python FastAPI Microservice Packaging (Single `.exe` Deployment)

To deploy the local AI microservice on client workstations without requiring a Python installation:

1. **Install PyInstaller**:
   ```bash
   py -m pip install pyinstaller
   ```
2. **Compile to Single Standalone Executable**:
   ```bash
   pyinstaller --onefile --name="MSAccess_AIService" main.py
   ```
3. **Configure as Windows Background Service or Startup Shortcut**:
   Place `MSAccess_AIService.exe` in `C:\ProgramData\EnterpriseApp\bin\` and create a shortcut in the Windows Startup folder (`shell:startup`) so it runs quietly on `http://127.0.0.1:8000`.

---

## 3. Required VBA References Checklist

Confirm the following object references are checked under **Tools -> References** in Microsoft Access VBA Editor (`Alt + F11`):

- [x] **Visual Basic For Applications**
- [x] **Microsoft Access 16.0 Object Library**
- [x] **Microsoft DAO 3.6 Object Library** (or **Microsoft ActiveX Data Objects 6.1 Library**)
- [x] **Microsoft WinHTTP Services, version 5.1** (`WinHttp.WinHttpRequest.5.1`)
- [x] **Microsoft Scripting Runtime** (`scrrun.dll` - for JSON string parsing)

*Note: All HTTP calls use late-binding fallback (`CreateObject("WinHttp.WinHttpRequest.5.1")`), guaranteeing compile stability even if reference bindings shift between Office versions.*

---

## 4. Typography & Font Deployment Instructions

- **Primary Headers**: `Fraunces` (Google Font, Serif) — Fallback: `Georgia`
- **Body & Controls**: `Inter` (Sans-Serif) — Fallback: `Segoe UI Semilight`

**IT Deployment Steps**:
1. Copy `Fraunces-SemiBold.ttf` and `Inter-Regular.ttf` to `C:\Windows\Fonts\` on client machines.
2. In the Access form design properties, set `Font Name = Fraunces` on main banner labels, and `Font Name = Inter` on textboxes and grid headers.

---

## 5. 1-Page Quick-Start Role Onboarding Cards

### 🛡️ System Administrator Card
1. **Security Switchboard**: Select **"System Administrator"** from the top-left clearance dropdown to activate administrative tabs.
2. **VBA & Deployment Specs**: Open **VBA & Deployment Specs** tab to review endpoint connection strings and HTTP timeouts.
3. **Database Health**: Verify the bottom indicator displays `FastAPI Microservice: Online`.

### 📊 Operations Manager Card
1. **Executive Dashboard**: Review total portfolio revenue, active executions, and the **3-Month AI Trend Forecast** chart.
2. **Plain-English Query Bar**: Click **Plain-English NL Query**, type any question in plain language (e.g. *"Show top active projects in Healthcare"*), and view auto-generated SQL results.
3. **Executive Summary**: On the **Reports** tab, click **"Generate AI Summary"** for a 3-sentence plain-English analysis of portfolio health.

### 📝 Front-Line Staff Card
1. **Data Entry Intake**: Navigate to **Custom Data Intake**.
2. **Inline Validation & AI Alerts**: Enter quantities and prices. If an entry deviates significantly from normal batch sizes, the **AI Anomaly Banner** will appear in terracotta with a plain-English explanation (*e.g., "Quantity is 3.5x higher than average"*).
3. **Exporting Data**: Open **Drill-Down Reports** and click **Export Excel (.csv)** to download a spreadsheet instantly.
