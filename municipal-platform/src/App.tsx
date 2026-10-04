import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Landing Role Selector
import { RoleSelectPage } from './pages/RoleSelectPage';

// Citizen Pages
import { CitizenHomePage } from './pages/citizen/CitizenHomePage';
import { ServicesPage } from './pages/citizen/ServicesPage';
import { BirthRegistrationPage } from './pages/citizen/services/BirthRegistrationPage';
import { DeathCertificatePage } from './pages/citizen/services/DeathCertificatePage';
import { VerifyCertificatePage } from './pages/citizen/services/VerifyCertificatePage';
import { TradeLicensePage } from './pages/citizen/services/TradeLicensePage';
import { TradeLicenseRenewalPage } from './pages/citizen/services/TradeLicenseRenewalPage';
import { TradeLicenseModificationPage } from './pages/citizen/services/TradeLicenseModificationPage';
import { PropertyRegistrationPage } from './pages/citizen/services/PropertyRegistrationPage';
import { PropertyTaxPage } from './pages/citizen/services/PropertyTaxPage';
import { TaxClearancePage } from './pages/citizen/services/TaxClearancePage';
import { WasteSchedulePage } from './pages/citizen/services/WasteSchedulePage';
import { WasteRequestPage } from './pages/citizen/services/WasteRequestPage';
import { UnifiedReportPage } from './pages/citizen/UnifiedReportPage';
import { MyReportsPage } from './pages/citizen/MyReportsPage';
import { ReportDetailPage } from './pages/citizen/ReportDetailPage';
import { MyApplicationsPage } from './pages/citizen/MyApplicationsPage';
import { ApplicationDetailPage } from './pages/citizen/ApplicationDetailPage';
import { PaymentsPage } from './pages/citizen/PaymentsPage';
import { CityMapPage } from './pages/citizen/CityMapPage';
import { FacilitiesPage } from './pages/citizen/FacilitiesPage';
import { EventsPage } from './pages/citizen/EventsPage';
import { NoticesPage } from './pages/citizen/NoticesPage';
import { NotificationsPage } from './pages/citizen/NotificationsPage';
import { ProfilePage } from './pages/citizen/ProfilePage';

// Municipal Staff Pages
import { StaffDashboardPage } from './pages/staff/StaffDashboardPage';
import { StaffApplicationsPage } from './pages/staff/StaffApplicationsPage';
import { StaffApplicationDetailPage } from './pages/staff/StaffApplicationDetailPage';
import { StaffReportsPage } from './pages/staff/StaffReportsPage';
import { StaffReportDetailPage } from './pages/staff/StaffReportDetailPage';
import { StaffFacilitiesPage } from './pages/staff/StaffFacilitiesPage';
import { StaffEventsPage } from './pages/staff/StaffEventsPage';
import { StaffProfilePage } from './pages/staff/StaffProfilePage';

// Administrator Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminMapPage } from './pages/admin/AdminMapPage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminFacilitiesPage } from './pages/admin/AdminFacilitiesPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Persona & Role Switcher */}
          <Route path="/" element={<RoleSelectPage />} />

          {/* Citizen Portal */}
          <Route path="/citizen" element={<AppShell />}>
            <Route index element={<CitizenHomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/birth-registration" element={<BirthRegistrationPage />} />
            <Route path="services/death-certificate" element={<DeathCertificatePage />} />
            <Route path="services/verify-certificate" element={<VerifyCertificatePage />} />
            <Route path="services/trade-license" element={<TradeLicensePage />} />
            <Route path="services/trade-license-renewal" element={<TradeLicenseRenewalPage />} />
            <Route path="services/trade-license-modification" element={<TradeLicenseModificationPage />} />
            <Route path="services/property-registration" element={<PropertyRegistrationPage />} />
            <Route path="services/property-tax" element={<PropertyTaxPage />} />
            <Route path="services/tax-clearance" element={<TaxClearancePage />} />
            <Route path="services/waste-schedule" element={<WasteSchedulePage />} />
            <Route path="services/waste-request" element={<WasteRequestPage />} />
            <Route path="report" element={<UnifiedReportPage />} />
            <Route path="reports" element={<MyReportsPage />} />
            <Route path="reports/:id" element={<ReportDetailPage />} />
            <Route path="applications" element={<MyApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationDetailPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="map" element={<CityMapPage />} />
            <Route path="facilities" element={<FacilitiesPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Municipal Staff Portal */}
          <Route path="/staff" element={<AppShell />}>
            <Route index element={<StaffDashboardPage />} />
            <Route path="applications" element={<StaffApplicationsPage />} />
            <Route path="applications/:id" element={<StaffApplicationDetailPage />} />
            <Route path="reports" element={<StaffReportsPage />} />
            <Route path="reports/:id" element={<StaffReportDetailPage />} />
            <Route path="facilities" element={<StaffFacilitiesPage />} />
            <Route path="events" element={<StaffEventsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<StaffProfilePage />} />
          </Route>

          {/* Administrator Portal */}
          <Route path="/admin" element={<AppShell />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route path="map" element={<AdminMapPage />} />
            <Route path="notices" element={<AdminNoticesPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="facilities" element={<AdminFacilitiesPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
