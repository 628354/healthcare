import React, { lazy } from 'react';
// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';
import ProtectedRoute from '../views/Login/ProtectedRoute'
// import FeedBackMain from 'views/Reportings/FeedBack/FeedBackMain';
// import PrnBalanceMain from 'views/Reportings/PrnBalance/PrnBalanceMain';
const DashboardDefault = Loadable(lazy(() => import('../views/Dashboard')));

// const UtilsTypography = Loadable(lazy(() => import('../views/Utils/Typography')));

const SamplePage = Loadable(lazy(() => import('../views/SamplePage')));

// const Dashboard = Loadable(lazy(() => import('../views/staff/profile')));

const AssetsParticipant = Loadable(lazy(() => import('../views/Assets/ParticipantAssets/MainPartiass')));
const CompanyAssest = Loadable(lazy(() => import('../views/Assets/CompanyAssets/CompanyMain')));
const LeaseUtility = Loadable(lazy(() => import('../views/Assets/LeaseAndUtility/Leasemain')));
const Maintenance = Loadable(lazy(() => import('../views/Assets/Maintenance/MaintenanceMain')));
const RepairRequest = Loadable(lazy(() => import('../views/Assets/RepairRequest/RepairRequestMain')));







const UserGroup = Loadable(lazy(() => import('../views/UserGroup')));

// const Documents = Loadable(lazy(() => import('../views/staff/documents')));
const Documents = Loadable(lazy(() => import('../views/staff/Document/DocumentMain')));


const Sleep = Loadable(lazy(() => import('../views/staff/Sleep-Disturbances')));

const Supervision = Loadable(lazy(() => import('../views/staff/supervision-logs/SupervisionMain')));

const Teams  = Loadable(lazy(() => import('../views/staff/Teams')));

const Timesheets  = Loadable(lazy(() => import('../views/staff/Timesheets')));


// participant 
const ParticipantProfile =Loadable(lazy(()=>import('../views/Participant/Profiles/ParticipantMainPage')))
const RpRegister =Loadable(lazy(()=>import('../views/Participant/RPRegister/RpRegisterMain')))

const ParticipantGoal=Loadable(lazy(()=>import('../views/Participant/ParticipantGoal/ParticipantGoalMain')))
const MadicationChart=Loadable(lazy(()=>import('../views/Participant/Medication Charts/MadicationMain')))

const RiskAssessments=Loadable(lazy(()=>import('../views/Participant/Risk Assessments/RiskAssessments')))
const ParticipantDocument=Loadable(lazy(()=>import('../views/Participant/Document')))
const ParticipantDocumentSetting=Loadable(lazy(()=>import('../views/Participant/Document/DocumentSetting')))
const CommunicationLog=Loadable(lazy(()=>import('../views/Participant/CommunicationLog')))

const MadicationRegister=Loadable(lazy(()=>import('../views/Participant/MedicationRegister/MadicationRegister')))

const StaffProfile =Loadable(lazy(()=>import('../views/staff/Profiles/ParticipantMainPage')))
// const StaffProfileAdd =Loadable(lazy(()=>import('../views/staff/Profiles/Edit')))

const StaffDocumentSetting=Loadable(lazy(()=>import('../views/staff/Document/DocumentSetting')))


const Meetings  = Loadable(lazy(() => import('../views/Meetings/MeetingsMain')));


//company 
const OnCallLogs  = Loadable(lazy(() => import('../views/Company/OnCallLogs/CallLogMain')));

const Expense  = Loadable(lazy(() => import('../views/Company/Expense/ExpenseMain')));
const Policies  = Loadable(lazy(() => import('../views/Company/Policies/PoliciesMain')));
const PracticeGuide  = Loadable(lazy(() => import('../views/Company/PracticeGuides/PracticeMain')));
const Processes  = Loadable(lazy(() => import('../views/Company/Processes/ProcessesMain')));
const RpDhsResources  = Loadable(lazy(() => import('../views/Company/RpDhsResources/RpDhsResourcesMain')));
const Forms  = Loadable(lazy(() => import('../views/Company/Forms/FormsMain')));

//Compliance

const Conflict  = Loadable(lazy(() => import('../views/Compliance/Conflict of Interest/ConflictMain')));
const Continuous  = Loadable(lazy(() => import('../views/Compliance/Continuous Improvement/ContinuousMain')));
const CorporateRisks  = Loadable(lazy(() => import('../views/Compliance/CorporateRisks/CorporateRisksMain')));
const InternalRegisters  = Loadable(lazy(() => import('../views/Compliance/InternalRegisters/InternalRegistersMain')));
const KeyDecision  = Loadable(lazy(() => import('../views/Compliance/KeyDecision/KeyDecisionMain')));
const LegislationRegister  = Loadable(lazy(() => import('../views/Compliance/LegislationRegister/LegislationMain')));
const RegulatoryCompliances  = Loadable(lazy(() => import('../views/Compliance/RegulatoryCompliances/RegulatoryMain')));
const WhsLog  = Loadable(lazy(() => import('../views/Compliance/WhsLog/WhsLogMain')));

//  observation 
const BloodGlucose  = Loadable(lazy(() => import('../views/Observations/BloodGlucose/BloodGlucoseMain')));
const BloodPressure  = Loadable(lazy(() => import('../views/Observations/BloodPressure/BloodPressureMain')));
const BowelLogs  = Loadable(lazy(() => import('../views/Observations/BowelLogs/BowelLogsMain')));
const Seizure  = Loadable(lazy(() => import('../views/Observations/Seizure/SeizureMain')));
const SleepLog  = Loadable(lazy(() => import('../views/Observations/SleepLog/SleepLogMain')));
const Temperature  = Loadable(lazy(() => import('../views/Observations/Temperature/TemperatureMain')));
const WeightLogs  = Loadable(lazy(() => import('../views/Observations/WeightLogs/WeightLogsMain')));

// reporting 
const AbcLogs  = Loadable(lazy(() => import('../views/Reportings/ABCLog/ABCLogMain')));
const DoctorVisits  = Loadable(lazy(() => import('../views/Reportings/DoctorVisits/DoctorVisitsMain')));
const FeedBack  = Loadable(lazy(() => import('../views/Reportings/FeedBack/FeedBackMain')));
const Incident  = Loadable(lazy(() => import('../views/Reportings/Incident/IncidentMain')));
const InjuryReport= Loadable(lazy(() => import('../views/Reportings/InjuryReport/InjuryReportMain')));
const ProgressNotes= Loadable(lazy(() => import('../views/Reportings/ProgressNotes/ProgressNotesMain')));

const ProgressReport= Loadable(lazy(() => import('../views/Reportings/ProgressReport/ProgressReportMain')));
const PrnAdministration= Loadable(lazy(() => import('../views/Reportings/PrnAdministration/PrnAdministrationMain')));
const PrnBalance= Loadable(lazy(() => import('../views/Reportings/PrnBalance/PrnBalanceMain')));
const RestrictivePractice= Loadable(lazy(() => import('../views/Reportings/RestrictivePractice/RestrictivePracticeMain')));
const VehicleLog= Loadable(lazy(() => import('../views/Reportings/VehicleLog/VehicleLogMain')));
const ProgressNotesSetting= Loadable(lazy(() => import('../views/Reportings/ProgressNotes/ProgressSetting')));

// settings
const Settings= Loadable(lazy(() => import('../views/Settings/Resource')));
const Sites= Loadable(lazy(() => import('../views/Settings/Sites')));

const Company= Loadable(lazy(() => import('../views/Settings/Company/CompanyMain')));

// service delivery 
const ServiceDelivery= Loadable(lazy(() => import('../views/ServiceDelivery')));



const Roster= Loadable(lazy(() => import('../views/Roster/index')));
const RosterAllTabs= Loadable(lazy(() => import('../views/Roster/Component/index')));
// const General= Loadable(lazy(() => import('../views/Roster/Component/General')));
// const Services= Loadable(lazy(() => import('../views/Roster/Component/')));


// ==============================|| MAIN ROUTES ||============================== //


const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute><DashboardDefault /></ProtectedRoute>
    },
    {
      path: '/dashboard/default',
      element:<ProtectedRoute><DashboardDefault /></ProtectedRoute>
    },
    // { path: '/utils/util-typography', element:<ProtectedRoute> <UtilsTypography /></ProtectedRoute> },
    { path: '/sample-page', element:<ProtectedRoute> <SamplePage /></ProtectedRoute>  },
    { path: '/assets/participant-assets', element:<ProtectedRoute><AssetsParticipant/></ProtectedRoute> },
    { path: '/assets/company-assets', element:<ProtectedRoute><CompanyAssest/></ProtectedRoute> },
    { path: '/assets/lease-and-utility', element:<ProtectedRoute><LeaseUtility/></ProtectedRoute> },
    { path: '/assets/maintenance', element:<ProtectedRoute><Maintenance/></ProtectedRoute> },
    { path: '/assets/Repair-Requests', element:<ProtectedRoute><RepairRequest/></ProtectedRoute> },

    { path: '/user-group', element:<ProtectedRoute><UserGroup/></ProtectedRoute> },

//staff
    { path: '/staff/profiles', element:<ProtectedRoute><StaffProfile/></ProtectedRoute> },   
    { path: '/staff/documents', element:<ProtectedRoute><Documents /></ProtectedRoute>},
    { path: '/staff/sleep-disturbances', element:<ProtectedRoute><Sleep /></ProtectedRoute>},
    { path: '/staff/supervision-logs', element:<ProtectedRoute><Supervision /></ProtectedRoute>},
    { path: '/staff/teams', element:<ProtectedRoute><Teams /></ProtectedRoute>},
    { path: '/staff/timesheets', element:<ProtectedRoute><Timesheets /></ProtectedRoute>},   

    // participent pages link 

   { path: '/participant/profiles', element:<ProtectedRoute><ParticipantProfile /></ProtectedRoute>},
    { path: '/participant/rp-register', element:<ProtectedRoute><RpRegister /></ProtectedRoute>},      
    { path: '/participant/goals', element:<ProtectedRoute><ParticipantGoal /></ProtectedRoute>},
    { path: '/participant/medication-charts', element:<ProtectedRoute><MadicationChart /></ProtectedRoute>},
    { path: '/participant/risk-assessments', element:<ProtectedRoute><RiskAssessments /></ProtectedRoute>},
    // { path: '/participant/risk-assessments', element:<ProtectedRoute><RiskAssessments /></ProtectedRoute>},
    { path: '/participant/documents', element:<ProtectedRoute><ParticipantDocument /></ProtectedRoute>},
    { path: '/documents/settings', element:<ProtectedRoute><ParticipantDocumentSetting /></ProtectedRoute>},
    { path: '/participant/communication-logs', element:<ProtectedRoute><CommunicationLog /></ProtectedRoute>},    
    { path: '/participant/medication-register', element:<ProtectedRoute><MadicationRegister /></ProtectedRoute>},
    { path: '/staff-documents/settings', element:<ProtectedRoute><StaffDocumentSetting /></ProtectedRoute>},
    { path: '/meetings', element:<ProtectedRoute><Meetings /></ProtectedRoute>},

    // company
    { path: '/company/on-call-logs', element:<ProtectedRoute><OnCallLogs /></ProtectedRoute>},
    { path: '/company/expenses', element:<ProtectedRoute><Expense /></ProtectedRoute>},
    { path: '/company/policies', element:<ProtectedRoute><Policies /></ProtectedRoute>},
    { path: '/company/practice-guides', element:<ProtectedRoute><PracticeGuide /></ProtectedRoute>},
    { path: '/company/processes', element:<ProtectedRoute><Processes /></ProtectedRoute>},
    { path: '/company/rp-dhs-resources', element:<ProtectedRoute><RpDhsResources /></ProtectedRoute>},
    { path: '/company/Forms', element:<ProtectedRoute><Forms /></ProtectedRoute>},

//Compliance


{ path: '/compliance/conflict-of-interest', element:<ProtectedRoute><Conflict /></ProtectedRoute>},
{ path: '/compliance/continuous-improvement', element:<ProtectedRoute><Continuous /></ProtectedRoute>},
{ path: '/compliance/corporate-risks', element:<ProtectedRoute><CorporateRisks /></ProtectedRoute>},
{ path: '/compliance/internal-registers', element:<ProtectedRoute><InternalRegisters /></ProtectedRoute>},
{ path: '/compliance/key-decisions', element:<ProtectedRoute><KeyDecision /></ProtectedRoute>},
{ path: '/compliance/legislation-registers', element:<ProtectedRoute><LegislationRegister /></ProtectedRoute>},
{ path: '/compliance/regulatory-compliances', element:<ProtectedRoute><RegulatoryCompliances /></ProtectedRoute>},
{ path: '/compliance/whs-logs', element:<ProtectedRoute><WhsLog /></ProtectedRoute>},

// observation 
{ path: '/observations/blood-glucose', element:<ProtectedRoute><BloodGlucose /></ProtectedRoute>},
{ path: '/observations/blood-pressure', element:<ProtectedRoute><BloodPressure /></ProtectedRoute>},
{ path: '/observations/bowel', element:<ProtectedRoute><BowelLogs /></ProtectedRoute>},
{ path: '/observations/seizure', element:<ProtectedRoute><Seizure /></ProtectedRoute>},
{ path: '/observations/sleep-logs', element:<ProtectedRoute><SleepLog /></ProtectedRoute>},
{ path: 'observations/temperature', element:<ProtectedRoute><Temperature /></ProtectedRoute>},
{ path: '/observations/weight', element:<ProtectedRoute><WeightLogs /></ProtectedRoute>},


// reporting 

{ path: '/reporting/abc-logs', element:<ProtectedRoute><AbcLogs /></ProtectedRoute>},
{ path: '/reporting/doctor-visits', element:<ProtectedRoute><DoctorVisits /></ProtectedRoute>},
{ path: '/reporting/feedback', element:<ProtectedRoute><FeedBack /></ProtectedRoute>},
{ path: '/reporting/incident', element:<ProtectedRoute><Incident /></ProtectedRoute>},
{ path: '/reporting/injury-reports', element:<ProtectedRoute><InjuryReport /></ProtectedRoute>},
{ path: '/reporting/progress-notes', element:<ProtectedRoute><ProgressNotes /></ProtectedRoute>},
{ path: '/reporting/progress-reports', element:<ProtectedRoute><ProgressReport /></ProtectedRoute>},
{ path: '/reporting/prn-administrations', element:<ProtectedRoute><PrnAdministration /></ProtectedRoute>},
{ path: '/reporting/prn-balances', element:<ProtectedRoute><PrnBalance /></ProtectedRoute>},
{ path: '/reporting/restrictive-practice', element:<ProtectedRoute><RestrictivePractice /></ProtectedRoute>},
{ path: '/reporting/vehicle-logs', element:<ProtectedRoute><VehicleLog /></ProtectedRoute>},

{ path: '/progress-notes/settings', element:<ProtectedRoute><ProgressNotesSetting /></ProtectedRoute>},


// settings

{ path: '/settings/resource', element:<ProtectedRoute><Settings /></ProtectedRoute>},
{ path: '/settings/sites', element:<ProtectedRoute><Sites /></ProtectedRoute>},
{ path: '/settings/company', element:<ProtectedRoute><Company /></ProtectedRoute>},

// service delivery 
{ path: '/service-deliveries', element:<ProtectedRoute><ServiceDelivery /></ProtectedRoute>},

{ path: '/roster', element:<ProtectedRoute><Roster /></ProtectedRoute>},
// { path: '/roster', element:<ProtectedRoute><Roster /></ProtectedRoute>},

// { path: '/staff/profiles/edit/:id', element:<ProtectedRoute><StaffProfileAdd /></ProtectedRoute>},


{ path: '/roster/setting/tab/general', element:<ProtectedRoute><RosterAllTabs /></ProtectedRoute>},












  ]
};

export default MainRoutes;
