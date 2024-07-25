// assets
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  BadgeOutlinedIcon: BadgeOutlinedIcon,
  GroupIcon:GroupIcon,
  LocalShippingOutlinedIcon:LocalShippingOutlinedIcon,
  WebAssetIcon:WebAssetIcon,
  DomainVerificationIcon:DomainVerificationIcon,
  CalendarTodayIcon:CalendarTodayIcon,
  AccessTimeIcon:AccessTimeIcon,
  RemoveRedEyeIcon:RemoveRedEyeIcon,
  FolderIcon:FolderIcon,
  PersonIcon:PersonIcon,
  SettingsSuggestIcon:SettingsSuggestIcon,
  CheckBoxIcon:CheckBoxIcon




};

// eslint-disable-next-line
export default {
  items: [

    // making single nnavigation for entire app

    {
      id : 'app',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children:[
          {
              id: 'dashboard',
              title: 'Dashboard',
              type: 'item',
              icon: icons['HomeOutlinedIcon'],
              url: '/dashboard/default'
          },

    
          {
            id: 'Assets',
            title: 'Assets',
            type: 'collapse',
            icon: icons['WebAssetIcon'],
            children: [
              {
                id: 'Participant-Assets',
                title: 'Participant Assets',
                type: 'item',
                url: '/assets/participant-assets',
                // target: true
                
              },
              {
                id: 'Company-Assets',
                title: 'Company Assets',
                type: 'item',
                url: '/assets/company-assets',
                
              },
              {
                id: 'Maintenance',
                title: 'Maintenance',
                type: 'item',
                url: '/assets/maintenance',
                
              },
              {
                id: 'Lease-and-Utility',
                title: 'Lease and Utility',
                type: 'item',
                url: '/assets/lease-and-utility',
                
              },
              {
                id: 'Repair-Requests',
                title: 'Repair Requests',
                type: 'item',
                url: '/assets/Repair-Requests',
                
              },
            ]
          },
          {
            id: 'Participant',
            title: 'Participant',
            type: 'collapse',
            icon: icons['GroupIcon'],
            children: [
              {
                id: 'Communication-Logs',
                title: 'Communication Logs',
                type: 'item',
                url: '/participant/communication-logs',
                
              },
              {
                id: 'Documents',
                title: 'Documents',
                type: 'item',
                url: '/participant/documents',
                
              },
              {
                id: 'Goals',
                title: 'Goals',
                type: 'item',
                url: '/participant/goals',
                
              },
              {
                id: 'Medication-Charts',
                title: 'Medication Charts',
                type: 'item',
                url: '/participant/medication-charts',
                
              },
              {
                id: 'Profiles',
                title: 'Profiles',
                type: 'item',
                url: '/participant/profiles',
                
              },
              {
                id: 'RP-Register',
                title: 'RP Register',
                type: 'item',
                url: '/participant/rp-register',
                
              },
              {
                id: 'Risk-Assessments',
                title: 'Risk Assessments',
                type: 'item',
                url: '/participant/risk-assessments',
                
              },
              {
                id: 'Medication-Register',
                title: 'Medication Register',
                type: 'item',
                url: '/participant/medication-register',
                
              },
            ]
          },
          {
            id: 'Service-Delivery',
            title: 'Service Delivery',
            type: 'item',
            url: '/service-deliveries',
            icon: icons['LocalShippingOutlinedIcon']
          },
          {
            id: 'auth',
            title: 'Authentication',
            type: 'collapse',
            icon: icons['SecurityOutlinedIcon'],
            children: [
              {
                id: 'login-1',
                title: 'Login',
                type: 'item',
                url: '/application/login',
                
              },
              {
                id: 'register',
                title: 'Register',
                type: 'item',
                url: '/application/register',
                
              }
            ]
          },
          {
            id: 'Company',
            title: 'Company',
            type: 'collapse',
            icon: icons['DomainVerificationIcon'],
            children: [
              {
                id: 'On-Call-Logs',
                title: 'On Call Logs',
                type: 'item',
                url: '/company/on-call-logs',
                
              },
              {
                id: 'Expenses',
                title: 'Expenses',
                type: 'item',
                url: '/company/expenses',
                
              },
              {
                id: 'Policies',
                title: 'Policies',
                type: 'item',
                url: '/company/policies',
                
              },
              {
                id: 'Practice-Guides',
                title: 'Practice Guides',
                type: 'item',
                url: '/company/practice-guides',
                
              },
              {
                id: 'Processes',
                title: 'Processes',
                type: 'item',
                url: '/company/processes',
                
              },
              {
                id: 'RP-DHS-Resources',
                title: 'RP DHS Resources',
                type: 'item',
                url: '/company/rp-dhs-resources',
                
              },
              {
                id: 'Forms',
                title: 'Forms',
                type: 'item',
                url: '/company/Forms',
                
              },
             
            ]
          },
          {
            id: 'Compliance',
            title: 'Compliance',
            type: 'collapse',
            icon: icons['CheckBoxIcon'],
            children: [
              {
                id: 'Conflict-of-Interest',
                title: 'Conflict of Interest',
                type: 'item',
                url: '/compliance/conflict-of-interest',
                
              },
              {
                id: 'Continuous-Improvement',
                title: 'Continuous Improvement',
                type: 'item',
                url: '/compliance/continuous-improvement',
                
              },
              {
                id: 'Corporate-Risks',
                title: 'Corporate Risks',
                type: 'item',
                url: '/compliance/corporate-risks',
                
              },
              {
                id: 'Internal-Registers',
                title: 'Internal Registers',
                type: 'item',
                url: '/compliance/internal-registers',
                
              },
              {
                id: 'Key-Decisions',
                title: 'Key Decisions',
                type: 'item',
                url: '/compliance/key-decisions',
                
              },
              {
                id: 'Legislation-Registers',
                title: 'Legislation Registers',
                type: 'item',
                url: '/compliance/legislation-registers',
                
              },
              {
                id: 'Regulatory-Compliances',
                title: 'Regulatory Compliances',
                type: 'item',
                url: '/compliance/regulatory-compliances',
                
              },
              {
                id: 'WHS-Logs',
                title: 'WHS Logs',
                type: 'item',
                url: '/compliance/whs-logs',
                
              },
            ]
          },
          {
            id: 'Meetings',
            title: 'Meetings',
            type: 'item',
            url: '/meetings',
            icon: icons['CalendarTodayIcon'],
          },
          {
            id: 'Roster',
            title: 'Roster',
            type: 'item',
            url: '/roster',
            icon: icons['AccessTimeIcon'],
          },
          {
            id: 'Observations',
            title: 'Observations',
            type: 'collapse',
            icon: icons['RemoveRedEyeIcon'],
            children: [
              {
                id: 'Blood-Glucose',
                title: 'Blood Glucose',
                type: 'item',
                url: '/observations/blood-glucose',
                
              },
              {
                id: 'Blood-Pressure',
                title: 'Blood Pressure',
                type: 'item',
                url: '/observations/blood-pressure',
                
              },
              {
                id: 'Bowel',
                title: 'Bowel',
                type: 'item',
                url: '/observations/bowel',
                
              },
              {
                id: 'Seizure',
                title: 'Seizure',
                type: 'item',
                url: '/observations/seizure',
                
              },
              {
                id: 'Sleep-Logs',
                title: 'Sleep Logs',
                type: 'item',
                url: '/observations/sleep-logs',
                
              },
              {
                id: 'Temperature',
                title: 'Temperature',
                type: 'item',
                url: '/observations/temperature',
                
              },
              {
                id: 'Weight',
                title: 'Weight',
                type: 'item',
                url: '/observations/weight',
                
              },
             
            ]
          },
          {
            id: 'Reporting',
            title: 'Reporting',
            type: 'collapse',
            icon: icons['FolderIcon'],
            children: [
              {
                id: 'ABC-Logs',
                title: 'ABC Logs',
                type: 'item',
                url: '/reporting/abc-logs',
                
              },
              {
                id: 'Doctor-Visits',
                title: 'Doctor Visits',
                type: 'item',
                url: '/reporting/doctor-visits',
                
              },
              {
                id: 'Feedback',
                title: 'Feedback',
                type: 'item',
                url: '/reporting/feedback',
                
              },
              {
                id: 'Incident',
                title: 'Incident',
                type: 'item',
                url: '/reporting/incident',
                
              },
              {
                id: 'Injury-Reports',
                title: 'Injury Reports',
                type: 'item',
                url: '/reporting/injury-reports',
                
              },
              {
                id: 'Progress-Notes',
                title: 'Shift Progress Notes',
                type: 'item',
                url: '/reporting/progress-notes',
                
              },
              {
                id: 'Progress-Reports',
                title: 'Progress Reports',
                type: 'item',
                url: '/reporting/progress-reports',
                
              },
              {
                id: 'PRN-Administrations',
                title: 'PRN Administrations',
                type: 'item',
                url: '/reporting/prn-administrations',
                
              },
              {
                id: 'PRN-Balances',
                title: 'PRN Balances',
                type: 'item',
                url: '/reporting/prn-balances',
                
              },
              {
                id: 'Restrictive-Practice',
                title: 'Restrictive Practice',
                type: 'item',
                url: '/reporting/restrictive-practice',
                
              },
              {
                id: 'Vehicle-Logs',
                title: 'Vehicle Logs',
                type: 'item',
                url: '/reporting/vehicle-logs',
                
              }
            ]
          },
          // adding profiling routes
          {
            id: 'Staff',
            title: 'Staff',
            type: 'collapse',
            icon: icons['PersonIcon'],
            children: [
              {
                id: 'Documents',
                title: 'Documents',
                type: 'item',
                url: '/staff/documents'
              },
              {
                id: 'Profiles',
                title: 'Profiles',
                type: 'item',
                url: '/staff/profiles'
              },
              {
                id: 'Sleep-Disturbances',
                title: 'Sleep Disturbances',
                type: 'item',
                url: '/staff/sleep-disturbances'
              },
              {
                id: 'Supervision-Logs',
                title: 'Supervision Logs',
                type: 'item',
                url: '/staff/supervision-logs'
              },
              {
                id: 'Teams',
                title: 'Teams',
                type: 'item',
                url: '/staff/teams'
              },
              {
                id: 'Time-sheets',
                title: 'Timesheets',
                type: 'item',
                url: '/staff/timesheets'
              },
              
            ]
          },
          {
            id: 'Settings',
            title: 'Settings',
            type: 'collapse',
            icon: icons['SettingsSuggestIcon'],
            children: [
              {
                id: 'Resource',
                title: 'Resource',
                type: 'item',
                url: '/settings/resource'
              },
              {
                id: 'Sites',
                title: 'Sites',
                type: 'item',
                url: '/settings/sites'
              },
              {
                id: 'Comapny',
                title: 'Company',
                type: 'item',
                url: '/settings/company'
              },
              {
                id: 'Comapny',
                title: 'Company List',
                type: 'item',
                url: '/settings/companyList'
              },
            ]
          },
          // 
          {
            id: 'user-group',
            title: 'User group',
            type: 'item',
            icon: icons['GroupIcon'],
            url: '/user-group'
        },
      ]
    },
    /* {
      id: 'navigation',
      //title: 'Materially',
      //caption: 'Dashboard',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      //id: 'navigation',
      //title: 'Materially',
      //caption: 'Dashboard',
      type: 'group',
      //icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard/default'
        }
      ]
    },
    {
      //id: 'pages',
      //title: 'Pages',
      //caption: 'Prebuild Pages',
      type: 'group',
      //icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          icon: icons['ChromeReaderModeOutlinedIcon']
        },
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: icons['SecurityOutlinedIcon'],
          children: [
            {
              id: 'login-1',
              title: 'Login',
              type: 'item',
              url: '/application/login',
              
            },
            {
              id: 'register',
              title: 'Register',
              type: 'item',
              url: '/application/register',
              
            }
          ]
        } 
      ]
    }, */



    // {
    //   id: 'utils',
    //   title: 'Utils',
    //   type: 'group',
    //   icon: icons['AccountTreeOutlinedIcon'],
    //   children: [
    //     {
    //       id: 'util-icons',
    //       title: 'Icons',
    //       type: 'item',
    //       url: 'https://mui.com/material-ui/material-icons/',
    //       icon: icons['AppsOutlinedIcon'],
    //       external: true,
          
    //     },
    //     {
    //       id: 'util-typography',
    //       title: 'Typography',
    //       type: 'item',
    //       url: '/utils/util-typography',
    //       icon: icons['FormatColorTextOutlinedIcon']
    //     }
    //   ]
    // },
  ]
};
