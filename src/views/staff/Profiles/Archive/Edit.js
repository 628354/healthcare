import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
//inner pages
import Checkbox from '@mui/material/Checkbox';
import ContactPage from '../ContactComponent/ContactD'
import DocumentPage from '../Documents/index'
import '../../../../style/document.css'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DataGrid/* GridToolbar */,GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  } from '@mui/x-data-grid';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
//select field
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
// Tab Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
// radio buttons
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
// Switch Imports
import FormGroup from '@mui/material/FormGroup'
//import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
//grid imports
//import { styled } from '@mui/material/styles';
//import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'
// Dialog imports
import { Modal } from 'antd'
// chip imports
import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import Chip from '@mui/material/Chip'
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
// gid imports
import { Col, Row } from 'antd'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'
import { width } from '@mui/system'
//import { bgcolor } from '@mui/system';

//grid item
/* const Item = styled(Paper)(({ theme }) => ({
  
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
})); */

//dialog box function
/* const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
 */
//multiselect code
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
]

function getStyles (name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}

// multiselect code end
const style = {
  padding: '8px 0'
}

const Edit = ({ selectedEmployee, setIsEditing, allowPre }) => {
  /* Model Styling in css start */

  /* Model Styling css ends */
  const [value, setValue] = React.useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  //dialog box state code start
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  // dialog box state code end

  //multiselect state code start

  const theme = useTheme()
  //const [personName, setPersonName] = React.useState([]);

  const handleChangeSelect = event => {
    const {
      target: { value }
    } = event
    setRole(typeof value === 'string' ? value.split(',') : value)
  }
  // multiselect state code end

  const id = selectedEmployee.stf_id
  const selectedEmployeeName = `${selectedEmployee.stf_firstname} ${selectedEmployee.stf_lastname}`
  // console.log(selectedEmployee);
  const [firstName, setFirstName] = useState(selectedEmployee.stf_firstname)
  const [profileImage, setProfileImage] = useState(selectedEmployee.prtcpnt_profileimage)
  const [lastName, setLastName] = useState(selectedEmployee.stf_lastname)
  const [email, setEmail] = useState(selectedEmployee.stf_email)
  const [userName, setUserName] = useState(selectedEmployee.stf_prfrdname)
  const [dob, setDob] = useState(selectedEmployee.stf_dob ? dayjs(selectedEmployee.stf_dob) : null)
  const [gender, setGender] = useState(selectedEmployee.stf_gender)
  //const [password, setPassword] = useState(selectedEmployee.stf_pswrd);

  const [profileImage2, setProfileImage2] = useState(selectedEmployee.prtcpnt_profileimage)

  const archive = selectedEmployee.stf_archive
  
  const [EmploymentType, setEmploymentType] = useState(selectedEmployee.stf_empltype)
  const [jobTitle, setJobTitle] = useState(selectedEmployee.stf_empljobtitle)
  const [startDate, setStartDate] = useState(selectedEmployee.stf_strtdate ? dayjs(selectedEmployee.stf_strtdate) : null)
  const [endDate, setEndDate] = useState(selectedEmployee.stf_enddate ? dayjs(selectedEmployee.stf_enddate) : null)
  const [primaryManager, setPrimaryManager] = useState(selectedEmployee.stf_pmrymngr)
  const [accountingCode, setAccountingCode] = useState(selectedEmployee.stf_acccode)
  const [payLevel, setPayLevel] = useState(selectedEmployee.stf_paylvl)
  const [profileState, setProfileState] = useState(selectedEmployee.stf_prfilstats)

  const [primaryManagerList,setPrimaryManagerList]=useState([]);
  const [payLevelList, setPayLevelList] = useState([])
  const [role, setRole] = useState([])
  //const [accountStatus, setAccountStatus] = useState(selectedEmployee.stf_accstatus);
  //const [archive, setArchive] = useState(selectedEmployee.stf_archive);
  //const [status, setStatus] = useState(selectedEmployee.stf_status);

  // Handling Unavailability form State

  const [unavailabilityDate, setUnavailabilityDate] = useState('')
  const [unavailabilityStartTime, setUnavailabilityStartTime] = useState('')
  const [unavailabilityEndTime, setUnavailabilityEndTime] = useState('')
  const [unavailabilityRepeat, setUnavailabilityRepeat] = useState(false)
 
  const [unavailabilityData,setUnavailabilityData]=useState([])
 console.log(unavailabilityRepeat);
const [forEvery,setForEvery]=useState('')
const [forEveryWD,setForEveryWD]=useState([]) 
const[endsOnDate,setEndsOnDate]=useState('')
const [occurrences,setOccurrences]=useState('')
const [availableType,setAvailableType]=useState('')
const[staff,setStaff]=useState(selectedEmployeeName)
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

console.log(availableType);
  const currentDate = new Date();


  const handleAddRow = () => {
    
    setUnavailabilityRepeat(prevValue => !prevValue)
  }
  const minSelectableDate = dayjs(startDate).add(1, 'day');
  const navigate = useNavigate()
  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImage(reader.result)
        const imageName = file.name
        setProfileImage2(imageName)
        e.target.value = null
      }
      reader.readAsDataURL(file)
    }
  }


console.log(startDate);
console.log(endDate);
const handleCheckboxChange = (event) => {
  const { name } = event.target;


  setForEveryWD(prevSelected => {
    if (prevSelected.includes(name)) {
      return prevSelected.filter(item => item !== name);
    } else {
      return [...prevSelected, name];
    }
  });
};
const columns = [
  
 
  // { field: 'stf_lastname', headerName: 'Last name', width: 130 },
  {
    field: 'avl_stfid',
    headerName: 'Staff',
    width: 250,
  },
      
  {
    field: 'action',
    headerName: 'Action',
    width:250,
    renderCell: (params) => (
      <strong >
         {
          allowPre?.edit? <IconButton aria-label="edit" color="primary" >
        <EditNoteOutlinedIcon /> 
        </IconButton>:(allowPre?.read? <IconButton aria-label="edit" color="primary" >
           <VisibilityIcon />
        </IconButton>:"")
        }
        {
allowPre?.delete?<IconButton aria-label="delete" color="error" sx={{ m: 2 }} >
<DeleteOutlineOutlinedIcon />
</IconButton>:""
}
        
      </strong>
    ),
  },
];



  
  const handleOkModelFirst = () => {
    if (!unavailabilityDate || !unavailabilityStartTime || !unavailabilityEndTime) {
      setIsModalOpen(false)
      return Swal.fire({  
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      })
    }

    const formattedstartDate = dayjs(unavailabilityDate).format('YYYY-MM-DD'); 
   
    const data = {  
      avl_date:formattedstartDate,
      avl_strttime:unavailabilityStartTime,
      avl_endtime:unavailabilityEndTime,
      // unavailabilityRepeat:unavailabilityRepeat,
      avl_stfid: selectedEmployee.stf_id,
      avl_type:availableType,
      avl_endson:endsOnDate,
      avl_occrnce:occurrences,
      avl_foreryweeksorday:forEveryWD
      
         
    }
   
    let url = 'https://tactytechnology.com/mycarepoint/api/'
    let endpoint = `insertData?table=fms_stf_unavailability`
    let response = add(url, endpoint, data)
    // console.log(formData)
    response.then(data => {
      console.log(data);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        //setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }

    })




  }

  const getUnavailabilityData=async()=>{
    
    try {
      const url = `https://tactytechnology.com/mycarepoint/api/getAll?table=fms_stf_unavailability&select=avl_id,avl_strttime,avl_strttime,avl_endtime,avl_type,avl_endson,avl_occrnce,avl_stfid`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        // console.log(data.messages);
       
        setUnavailabilityData(data.messages);
        console.log("check",data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  useEffect(()=>{
    getUnavailabilityData()
  },[])
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  // console.log(profileImage)

  const handleImageDelete = () => {
    alert('Are you sure you what to delete this attachment?')
    setProfileImage('')
    setProfileImage2('')
  }
  const handleUpdate = e => {
    // console.log(dob);
    //alert('working');
    e.preventDefault()

    if (!firstName || !lastName || !email || !userName || !gender || !dob) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      })
    }

    const newDob = dob ? dob.format('YYYY-MM-DD') : null

    const formData = new FormData()
    formData.append('stf_firstname', firstName)
    // formData.append('stf_lastname', profileImage2)
    formData.append('stf_lastname', lastName)
    formData.append('stf_prfrdname', userName)
    formData.append('stf_email', email)
    formData.append('stf_dob', newDob)
    formData.append('stf_gender', gender)

    // /* const data = {
    //   stf_firstname:firstName,
    //   stf_lastname:lastName,
    //   stf_prfrdname:userName,
    //   stf_email:email,
    //   stf_pswrd:password,
    //   stf_dob:dob,
    //   stf_gender:gender,
    //   stf_prsnlcntctno:personalContact,
    //   stf_workcntctno:workContact,
    //   stf_address:address,
    //   stf_emgname:guardianName,
    //   stf_emgctcno:guardianNumber,
    //   stf_empljobtitle:jobTitle,
    //   stf_strtdate:startDate,
    //   stf_enddate:endDate,
    //   stf_pmrymngr:primaryManager,
    //   stf_acccode:accessCode,
    //   stf_paylvl:payLevel,
    //   stf_prfilstats:profileState,
    //   stf_role:role,
    //   stf_accstatus:accountStatus,
    //   stf_archive:archive,
    //   stf_status:status,
    // };  */
    // console.log(formData);
    
    let url = 'https://tactytechnology.com/mycarepoint/api/'
    let endpoint = `updateAll?table=fms_staff_detail&field=stf_id&id=${id}`
    let response = update(url, endpoint, formData)
    console.log(formData)
    response.then(data => {
      // console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${firstName} ${lastName}'s data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        //setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }

    })
  }
  

  //   const handleUpdateTwo = e => {

  //   // alert('working from two');
  //   e.preventDefault();

  //   if ( !personalContact ||!workContact || !address || !guardianName || !guardianNumber || !guardianRelation) {
  //     return Swal.fire({
  //       icon: 'error',
  //       title: 'Error!',
  //       text: 'All fields are required.',
  //       showConfirmButton: true,
  //     });
  //   }

  //   const formData = new FormData();
  //   formData.append('prtcpnt_cntctno',personalContact);
  //   formData.append('prtcpnt_workcno',workContact);
  //   formData.append('prtcpnt_address',address);
  //   formData.append('prtcpnt_emgname',guardianName);
  //   formData.append('prtcpnt_emgno',guardianNumber);
  //   formData.append('prtcpnt_emgrelatn',guardianRelation);

  //   let url = "https://tactytechnology.com/mycarepoint/api/";
  //   let endpoint = `updateAll?table=fms_prtcpnt_details&field=prtcpnt_id&id=${id}`;
  //   let response = update(url,endpoint,formData);
  //     response.then((data)=>{
  //         // console.log(data.status);
  //         //return data;
  //         if(data.status){
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Updated!',
  //             text: `Data has been Updated.`,
  //             showConfirmButton: false,
  //             timer: 1500,
  //           });
  //           //setIsEditing(false);
  //         }else{
  //           Swal.fire({
  //           icon: 'error',
  //           title: 'Error!',
  //           text: 'Something Went Wrong.',
  //           showConfirmButton: true,
  //     });
  //         }
  //     });

  // };

// get pay level 
const getPayLevel= async()=>{
  let url = "https://tactytechnology.com/mycarepoint/api/";
  let endpoint = 'getAll?table=fms_staff_pay_levels&select=pay_level_id,pay_level_name';

  let response =await fetch(`${url}${endpoint}`,{
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      //'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  if(response.ok){
    const res = await response.json()
    setPayLevelList(res.messages)
// console.log(res);
  }

}
console.log(archive)
  ///get staf 
  const getStaff= async()=>{
    let url = "https://tactytechnology.com/mycarepoint/api/";
  let endpoint = 'getWhereAll?table=fms_staff_detail&field=stf_archive&value=1';
  
    let response =await fetch(`${url}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setPrimaryManagerList(res.messages)
  // console.log(res);
    }
  
  }
  
  useEffect(()=>{
    getStaff();
    getPayLevel();
  },[])

  const handleUpdateThree = e => {
    // alert('working from three');
    e.preventDefault();

    if ( !EmploymentType ||!jobTitle || !startDate) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }
    const sdateFormat = startDate ? startDate.format('YYYY-MM-DD') : null
    const edateFormat = endDate ? endDate.format('YYYY-MM-DD') : null

    const formData = new FormData();
    formData.append('stf_empltype',EmploymentType);
    formData.append('stf_empljobtitle',jobTitle);
    formData.append('stf_strtdate',sdateFormat);
    formData.append('stf_enddate',edateFormat);
    formData.append('stf_pmrymngr',primaryManager);
    formData.append('stf_acccode',accountingCode);
    formData.append('stf_paylvl',payLevel);
    formData.append('stf_prfilstats',profileState);

    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id='+id;
    let response = update(url,endpoint,formData);
      response.then((data)=>{
          // console.log(data.status);
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `Data has been Updated.`,
              showConfirmButton: false,
              timer: 1500,
            });
            //setIsEditing(false);
          }else{
            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something Went Wrong.',
            showConfirmButton: true,
      });
          }
      });

  };
 
  const handleUpdateArchive = e => {
    e.preventDefault()

    const archiveValue = determineArchiveValue()
    console.log(archiveValue)
    const formData = new FormData()
    formData.append('stf_archive',archiveValue)

    const url = 'https://tactytechnology.com/mycarepoint/api/'
    const endpoint = `updateAll?table=fms_staff_detail&field=stf_id&id=${id}`

    const response = update(url, endpoint, formData)

    response.then(data => {
      console.log(data)
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Account Has Been Archived`,
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(() => {
          navigate('/staff/profiles')
        }, 1500)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    })
  }

  const determineArchiveValue = () => {
    return archive == 1 ? 0 : 1
  }

  async function update (url, endpoint, formData) {
    //console.log(data);
    // console.log('console from function');
    const response = await fetch(url + endpoint, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      /* headers: {
                                  "Content-Type": "application/json",
                                  //'Content-Type': 'application/x-www-form-urlencoded',
                                }, */
      body: formData // body data type must match "Content-Type" header
    })
    return response.json()
  }
  async function add (url, endpoint, data) {
    const response = await fetch(url + endpoint, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return response.json()
  }

  return (
    <div className='small-container'>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label='Personal Details' value='1' />
              <Tab label='Contact Details' value='2' />
              <Tab label='Documents' value='3' />
              <Tab label='Employment Details' value='4' />
              <Tab label='Unavailability' value='5' />
              
              <Tab label='Account Settings' value='6' />
              <Tab label='Archive/Unarchive' value='7' />
            </TabList>
          </Box>
          <TabPanel value='1'>
            <Box
              component='form'
              sx={{
                '& .MuiTextField-root': { m: 1, width: '50ch' }
                //bgcolor:'#FFFFFF'
              }}
              noValidate
              autoComplete='off'
              onSubmit={handleUpdate}
            >
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor='profile-picture' style={{ display: 'block' }}>
                  Profile picture
                </label>
                <label
                  htmlFor='profile-picture'
                  style={{
                    display: 'block',
                    width: '100px',
                    height: '100px',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {profileImage ? (
                    <>
                      <img src={profileImage} alt='Profile' value style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)', color: '#fff', padding: '4px' }}
                      >
                        <DeleteIcon onClick={handleImageDelete} />
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', lineHeight: '100px' }}>upload</div>
                  )}
                </label>
                <input id='profile-picture' type='file' onChange={handleFileChange} style={{ display: 'none' }} />
              </div>

              <TextField
                required
                value={firstName}
                label='First Name'
                onChange={e => {
                  setFirstName(e.target.value)
                }}
              />

              <TextField
                required
                value={lastName}
                label='Last Name'
                onChange={e => {
                  setLastName(e.target.value)
                }}
              />

              <TextField
                required
               value={userName}
                label='Preferred name'
                onChange={e => {
                  setUserName(e.target.value)
                }}
              />

              <TextField
                required
                value={email}
                label='Email'
                onChange={e => {
                  setEmail(e.target.value)
                }}
              />

              {/* date picker field */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date Of Birth'
                  format='DD/MM/YYYY'
                 value={dayjs(dob)}
                  onChange={newValue => {
                    setDob(newValue)
                  }}
                />
              </LocalizationProvider>

              {/* <Switch label="Date Of Birth" defaultChecked onChange={(e)=>{setDob(e.target.value)}}/> 
			
          {/* date picker field */}
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date Of Birth"
        value={dob}
        onChange={(newValue) => setDob(newValue)}
        renderInput={(params) => <TextField {...params} />}
        format="DD/MM/YY" // Specify the desired date format
      />
    </LocalizationProvider> */}

              <FormControl style={{ padding: '6px 0px 0px 10px' }}>
                <FormLabel id='demo-row-radio-buttons-group-label'>Gender</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={gender}
                  onChange={e => {
                    setGender(e.target.value)
                  }}
                >
                  <FormControlLabel value='1' control={<Radio />} label='Female' />
                  <FormControlLabel value='2' control={<Radio />} label='Male' />
                  <FormControlLabel value='3' control={<Radio />} label='Other' />
                </RadioGroup>
              </FormControl>

              <Box sx={{ width: '100ch', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                  <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
                    Cancel
                  </Button>
                  <Button variant='outlined' type='submit'>
                    Update
                  </Button>
                </Stack>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value='2'>
            <ContactPage participantId={id} selectedEmployee={selectedEmployee} setIsEditing={setIsEditing}/>
          </TabPanel>
          <TabPanel value='3'>
            <DocumentPage selectedEmployee={selectedEmployee} participantId={id} />
          </TabPanel>
          <TabPanel value='4'>
            <Box sx={{ flexGrow: 1 }} component='form' onSubmit={handleUpdateThree}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <h3>Employment Details</h3>
                </Grid>
                <Grid xs={6}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='select-one-label'>Employment type</InputLabel>
                    <Select
                      labelId='select-one-label'
                      id='select-one-label'
                      value={EmploymentType}
                      label='Employment type'
                      onChange={e => {
                        setEmploymentType(e.target.value)
                      }}
                    >
                      <MenuItem value={'Full Time'}>Full Time</MenuItem>
                      <MenuItem value={'Part Time'}>Part Time</MenuItem>
                      <MenuItem value={'Casual'}>Casual</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <TextField
                    style={{ width: '100%' }}
                    required
                    label='Job Title'
                   value={jobTitle}
                    onChange={e => {
                      setJobTitle(e.target.value)
                    }}
                  />
                </Grid>
                <Grid xs={6}>
                  {/* date picker field */}
                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                    <DatePicker
                    format="DD/MM/YYYY"
                      label='Start Date'
                      sx={{ width: '100%' }}
                      value={dayjs(startDate)}
                      minDate={dayjs(currentDate)}
                      onChange={newValue => {
                        setStartDate(newValue)
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={6}>
                  {/* date picker field */}
                  <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                    <DatePicker
                    format="DD/MM/YYYY"
                      label='End Date'
                      sx={{ width: '100%' }}
                      value={dayjs(endDate)}
                      minDate={dayjs(minSelectableDate)} 

                      onChange={newValue => {
                        setEndDate(newValue)
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={6}>
                <FormControl sx={{ width: '100%' }} required>
        <InputLabel id='PrimaryManager'>Primary Manager</InputLabel>
        <Select
        labelId='PrimaryManager'
        id='PrimaryManager'
        value={primaryManager}
        label='Primary Manager'
        onChange={e => {
          setPrimaryManager(e.target.value)
        }}
        >
          {
            primaryManagerList?.map((item)=>{
           
              return(
                <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

              )

            })
          }
        </Select>
      </FormControl>
                </Grid>
             
                <Grid xs={6}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='select-one-label'>Accounting code</InputLabel>
                    <Select
                      labelId='select-one-label'
                      id='select-one-label'
                      value={accountingCode}
                      label='Accounting code'
                      onChange={e => {
                        setAccountingCode(e.target.value)
                      }}
                    >
                      <MenuItem value={1}>Test1</MenuItem>
                      <MenuItem value={2}>Test2</MenuItem>
                      <MenuItem value={3}>Test3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='select-one-label'>Pay Levels</InputLabel>
                    <Select
                      labelId='select-one-label'
                      id='select-one-label'
                      value={payLevel}
                      label='Pay Levels'
                      onChange={e => {
                        setPayLevel(e.target.value)
                      }}
                    >
                    {
            payLevelList?.map((item)=>{
           
              return(
                <MenuItem key={item?.pay_level_id} value={item?.pay_level_id}>{item?.pay_level_name}</MenuItem>

              )

            })
          }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id='select-one-label'>Profile status</InputLabel>
                    <Select
                      labelId='select-one-label'
                      id='select-one-label'
                      value={profileState}
                      label='Profile status'
                      onChange={e => {
                        setProfileState(e.target.value)
                      }}
                    >
                      <MenuItem value={1}>Compliant</MenuItem>
                      <MenuItem value={2}>Non Compliant</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                  <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
                    Cancel
                  </Button>
                  <Button variant='outlined' type='submit'>
                    Update
                  </Button>
                </Stack>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value='5'>
            <>
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32
                }}
              >
                <Col className='gutter-row' span={6}>
                  <div style={style}>
                    <h3>Unavailability</h3>
                  </div>
                </Col>
                <Col className='gutter-row' span={6}>
                  <div style={style}></div>
                </Col>
                <Col className='gutter-row' span={6}>
                  <div style={style}></div>
                </Col>
                <Col className='gutter-row' span={6}>
                  <div style={style}>
                    <Button variant='outlined' color='success' onClick={showModal}>
                      <AddOutlinedIcon />
                      Add
                    </Button>
                  </div>
                </Col>
              </Row>
              {/* {unavailabilityData.length > 0 && (
          <DataGrid
className={employees.length<1?"hide_tableData":""}




    style={{ padding: 20 }}
    columns={columns}
    rows={unavailabilityData}
    getRowId={(row) => row?.avl_id}
    sx={{
      m: 2,
      boxShadow: 2,
      border: 0,
      borderColor: 'primary.light',
      '& .MuiDataGrid-cell:hover': {
        color: 'primary.main',
      },
    }}
    initialState={{
      pagination: {
        paginationModel: { page: 0, pageSize: 10 },
      },
    }}
    pageSizeOptions={[10, 25, 50, 100]}
    //checkboxSelection
  />
)} */}





              <Modal title='Add Unavailability'style={{ width: '800px' }}  className='staff_formModal'open={isModalOpen} onSubmit={handleOkModelFirst}
                footer={[
                  <Button key="cancel" onClick={handleCancel}>
                    Cancel
                  </Button>,
                  <Button key="ok" type="primary" onClick={handleOkModelFirst}>
                    Ok
                  </Button>,
                ]} >
                <Row style={{ margin: '20px 0px 10px 0px' }}>
                  <Col span={24}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                      <DatePicker
                        label='Start Date'
                        sx={{ width: '100%' }}
                        format='DD/MM/YYYY'
                        minDate={dayjs(minSelectableDate)} 
                        value={dayjs(unavailabilityDate)}
                        onChange={newValue => {
                          setUnavailabilityDate(newValue)
                        }}
                      />
                    </LocalizationProvider>
                  </Col>
                </Row>
                <Row style={{ margin: '10px 0px 10px 0px' }}>
                  <Col span={11}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                      <TimePicker
                        label='Start Time'
                        sx={{ width: '100%' }}
                        value={dayjs(unavailabilityStartTime)}
                        onChange={newValue => {
                          setUnavailabilityStartTime(newValue)
                        }}
                      />
                    </LocalizationProvider>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
                      <TimePicker
                        label='End Time'
                        sx={{ width: '100%' }}
                        value={dayjs(unavailabilityEndTime)}
                        onChange={newValue => {
                          setUnavailabilityEndTime(newValue)
                        }}
                      />
                    </LocalizationProvider>
                  </Col>
                </Row>

                <Row style={{ margin: '10px 0px 10px 0px' }}>
                  <Col span={24}>
                  <FormControl sx={{ width: '100%' }}>
<InputLabel id='forEveryWD'>Staff</InputLabel>
      <Select
      
        labelId='Staff'
        id='select-one-label'
        value={staff}
        label='Staff'
        onChange={e => {
          setStaff(e.target.value)
        }}
      >
       <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
      </Select>
    </FormControl>
                  </Col>
                </Row>
                

                <Row style={{ margin: '10px 0px 10px 0px' }}>
                  <Col span={24}>
                    <FormGroup>
                      <FormControlLabel
                        required
                        control={unavailabilityDate === 1? <Switch defaultChecked/>:<Switch/>}
                        label='Repeat unavailability'
                        value={unavailabilityRepeat}
                        
                        onClick={handleAddRow}
                        
                      />
                    </FormGroup>
                  </Col>
                </Row>
{
  unavailabilityRepeat? (<>
  <div  className='custom_Radio'style={{ display: 'flex',justifyContent: 'end' }}>
   <FormControl component="fieldset">
        <RadioGroup
          aria-label="relation-type"
          name="relationType"
          style={{ display: 'flex', flexDirection: 'row' }}  
          onChange={e => {
            setAvailableType(e.target.value)
          }}
        >
          <FormControlLabel value="Ends on" control={<Radio />} label="Ends on" />
          <FormControlLabel value="Occurrences" control={<Radio />} label="Occurrences" />
        </RadioGroup>
      </FormControl></div>
  <div style={{ display: 'flex', gap: '27px',marginLeft:"7px",marginTop:"14px",marginBottom:"20px" }}>
   
  <TextField
        style={{ width: '100%' }}
        type='number'
        required
        label='For every '
      value={forEvery}
        onChange={e => {
          setForEvery(e.target.value)
        }}
      />
<FormControl sx={{ width: '100%' }}>
<InputLabel id='forEveryWD'>Select Day/Week</InputLabel>
      <Select
      
        labelId='forEveryWD'
        id='select-one-label'
        value={forEveryWD}
        label='Select Day/Week'
        onChange={e => {
          setForEveryWD(e.target.value)
        }}
      >
        <MenuItem value={"Day"}>Day</MenuItem>
        <MenuItem value={"Week"}>Week</MenuItem>
      </Select>
    </FormControl>
    {availableType ==="Ends on"?
     <LocalizationProvider dateAdapter={AdapterDayjs}  className="endsON">
     <DatePicker
     style={{ width: '100%' }}
       className="endsON"
       label='Ends On'
       minDate={dayjs(endsOnDate)} 
       format='DD/MM/YYYY'
       value={dayjs(endsOnDate)}
       onChange={newValue => {
         setEndsOnDate(newValue)
       }}
     />
   </LocalizationProvider>
    :<TextField
    style={{ width: '100%' }}
    type='number'
    required
    
    defaultValue={occurrences}
    onChange={e => {
      setOccurrences(e.target.value)
    }}
  />}




</div></>):null
}
{
  forEveryWD ==="Week"?
  <Grid container direction="row" justifyContent="start" alignItems="center" >

   
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Mon')} 
          onChange={handleCheckboxChange}
        name='Mon'/>}
        label='Mon'
        labelPlacement="top"
      />
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Tus')} 
          onChange={handleCheckboxChange}
        name='Tus'/>}
        label='Tus'
        labelPlacement="top"
      />
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Wed')} 
          onChange={handleCheckboxChange}
        name='Wed'/>}
        label='Wed'
        labelPlacement="top"
      />
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Thu')} 
          onChange={handleCheckboxChange}
        name='Thu'/>}
        label='Thu'
        labelPlacement="top"
      />
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Fri')} 
          onChange={handleCheckboxChange}
        name='Fri'/>}
        label='Fri'
        labelPlacement="top"
      />
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Sat')} 
          onChange={handleCheckboxChange}
        name='Sat'/>}
        label='Sat'
        labelPlacement="top"
      />
      <FormControlLabel
        control={<Checkbox
          checked={forEveryWD.includes('Sun')} 
          onChange={handleCheckboxChange}
        name='Sun'/>}
        label='Sun'
        labelPlacement="top"
      />


</Grid>:null
}

                
              </Modal>
            </>
          </TabPanel>

        
          <TabPanel value='6'>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <h3>Account Settings</h3>
                </Grid>

                <Grid xs={8}>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id='demo-multiple-chip-label'>Roles</InputLabel>
                    <Select
                      labelId='demo-multiple-chip-label'
                      id='demo-multiple-chip'
                      multiple
                      value={role}
                      onChange={handleChangeSelect}
                      input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(value => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {names.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name, role, theme)}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <FormLabel id='demo-row-radio-buttons-group-label'>Account status</FormLabel>
                    <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group'>
                      <FormControlLabel value='Active' control={<Radio />} label='Active' disabled checked />
                      <FormControlLabel value='Inactive' control={<Radio />} label='Inactive' disabled />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ width: '100%', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                  <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
                    Cancel
                  </Button>
                  {allowPre?.edit ? (
                    <Button variant='outlined' type='submit'>
                      Update
                    </Button>
                  ) : (
                    ''
                  )}
                </Stack>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value='7'>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <h3>Archive this profile</h3>
                </Grid>

                <Grid xs={12}>
                  <Box sx={{ bgcolor: '#fbdddd', color: '#ea5455', p: 2, spacing: 2 }}>
                    <ReportGmailerrorredOutlinedIcon />
                    <span>
                      This action will archive the staff and you will not be able to see staff in the list and drop-downs. Also, the system
                      will not send document expiry or any other alerts for this account. If you wish to access this staff profile, you can
                      go to Archive section in the menu.
                    </span>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ width: '100%', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                {
                                 archive ==0?   <Button variant="outlined" color="error"  type="button" onClick={handleUpdateArchive} >Unarchive</Button>: <Button variant="outlined" color="error"  type="button" onClick={handleUpdateArchive} >Archive</Button>
                        
                                    }
                  <Button variant='outlined' type='submit' onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}

export default Edit
