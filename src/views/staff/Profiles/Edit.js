import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
//inner pages
import Checkbox from '@mui/material/Checkbox';
import ContactPage from './ContactComponent/ContactD'
import DocumentPage from './Documents/index'
import '../../../style/document.css'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
// import { DataGrid/* GridToolbar */,GridToolbarContainer,
//   // GridToolbarColumnsButton,
//   GridToolbarFilterButton,
//   GridToolbarExport,
//   } from '@mui/x-data-grid';
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
import Switch from '@mui/material/Switch'

import Grid from '@mui/material/Unstable_Grid2'
// Dialog imports
import { Modal } from 'antd'
// chip imports
// import { useTheme } from '@mui/material/styles'
// import OutlinedInput from '@mui/material/OutlinedInput'
// import Chip from '@mui/material/Chip'
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
// gid imports
import { Col, Row } from 'antd'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { useLocation, useNavigate, useParams } from 'react-router'
// import { width } from '@mui/system'
import { BASE_URL, COMMON_GET_PAR, COMMON_NEW_ADD, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST, IMG_BASE_URL,  } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';

const style = {
  padding: '8px 0'
}

const Edit = () => {
const {companyId}=useContext(AuthContext)
const locationD = useLocation()
  const { allowPre, selectedEmployee } = locationD.state
const [errors, setErrors] = useState({
  firstName: '',
  phone: '',
  email: '',
  password: '',
  cpassword: '',
  role:''
})


const validateMobileNumber = (value) => {
  return /^\d{10}$/.test(value);
};
const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const validatePassword = (value) => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(value);
};


const handleFocus = (field) => {
  switch (field) {
    
   
    case 'email':
      setErrors({ ...errors, email: validateEmail(email) ? '' : 'Email address is invalid.' });
      break;
    case 'password':
      setErrors({ ...errors, password: validatePassword(password) ? '' : 'Password must be at least 8 characters long and contain at least one letter and one number.' });
      break;
    
    default:
      break;
  }
};

const handleBlur = (field) => {
  handleFocus(field);
};

  // const {id} = useParams();
  // console.log(id);
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

  const id = selectedEmployee.stf_id
  const selectedEmployeeName = `${selectedEmployee.stf_firstname} ${selectedEmployee.stf_lastname}`
  const [firstName, setFirstName] = useState(selectedEmployee.stf_firstname)
  const [profileImage, setProfileImage] = useState(selectedEmployee.photo)
  const [lastName, setLastName] = useState(selectedEmployee.stf_lastname)
  const [email, setEmail] = useState(selectedEmployee.stf_email)
  const [userName, setUserName] = useState(selectedEmployee.stf_prfrdname)
  const [dob, setDob] = useState(selectedEmployee.stf_dob ? dayjs(selectedEmployee.stf_dob) : null)
  const [gender, setGender] = useState(selectedEmployee.stf_gender)
  const [password, setPassword] = useState(selectedEmployee.stf_pswrd);

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [profileImage2, setProfileImage2] = useState(null);

  const archive = selectedEmployee.stf_archive

  const [EmploymentType, setEmploymentType] = useState(selectedEmployee.stf_empltype)
  const [jobTitle, setJobTitle] = useState(selectedEmployee.stf_empljobtitle)
  const [startDate, setStartDate] = useState(selectedEmployee.stf_strtdate ? dayjs(selectedEmployee.stf_strtdate) : null)
  const [endDate, setEndDate] = useState(selectedEmployee.stf_enddate ? dayjs(selectedEmployee.stf_enddate) : null)
  const [primaryManager, setPrimaryManager] = useState(selectedEmployee.stf_pmrymngr)
  const [accountingCode, setAccountingCode] = useState(selectedEmployee.stf_acccode)
  const [payLevel, setPayLevel] = useState(selectedEmployee.stf_paylvl)
  const [profileState, setProfileState] = useState(selectedEmployee.stf_prfilstats)

  const [primaryManagerList, setPrimaryManagerList] = useState([]);
  const [payLevelList, setPayLevelList] = useState([])
  const [role, setRole] = useState([])
  const [accountStatus, setAccountStatus] = useState(selectedEmployee.stf_status);
  const [userRole, setUserRole] = useState(selectedEmployee.stf_role)
  const [userRoleList, setUserRoleList] = useState([])



  const [unavailabilityDate, setUnavailabilityDate] = useState('')
  const [unavailabilityStartTime, setUnavailabilityStartTime] = useState('')
  const [unavailabilityEndTime, setUnavailabilityEndTime] = useState('')
  const [unavailabilityRepeat, setUnavailabilityRepeat] = useState(false)

  const [unavailabilityData, setUnavailabilityData] = useState([])
  const [updateDate, setUpdateDate] = useState(null)
  const [createDate, setCreateDate] = useState(null)
  useEffect(() => {
    if (selectedEmployee) {
      const updateData = selectedEmployee && selectedEmployee.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedEmployee.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedEmployee]);


 
  console.log(unavailabilityRepeat);
  const [forEvery, setForEvery] = useState('')
  const [forEveryWD, setForEveryWD] = useState([])
  const [endsOnDate, setEndsOnDate] = useState('')
  const [occurrences, setOccurrences] = useState('')
  const [availableType, setAvailableType] = useState('')
  const [staff, setStaff] = useState(selectedEmployeeName)
  const [weekName, setWeekName] = useState([])
  const daysOfWeek = [
    { label: 'Mon' },
    { label: 'Tue' },
    { label: 'Wed' },
    { label: 'Thu' },
    { label: 'Fri' },
    { label: 'Sat' },
    { label: 'Sun' },
  ];

  console.log(availableType);
  const currentDate = new Date();


  const handleAddRow = () => {

    setUnavailabilityRepeat(prevValue => !prevValue)
  }

  const minSelectableDate = dayjs(startDate).add(1, 'day');
  const navigate = useNavigate()


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage2(file)

    if (file) {

      const reader = new FileReader();
      reader.onload = () => {

        setProfileImage(reader.result);

        // e.target.value = null;
      };
      reader.readAsDataURL(file);
    }
  };


  console.log(startDate);
  console.log(endDate);
  
  const handleCheckboxChange = (event) => {
    const value = event.target.value;

    if (event.target.checked) {
      setWeekName([...weekName, value])
    } else {
      setWeekName(weekName.filter(item => item !== value))
    }


  };



 

  const userRoleData = async () => {
    try {
      let endpoint = `getAll?table=fms_role_permissions&select=user_role,permission_id,permissions&company_id=${companyId}&fields=status&status=1`

      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const res = await response.json()

      if (res.status) {
        setUserRoleList(res.messages)
        console.log(res)
      } else {
        setUserRoleList([])
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }



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
    const weekData = JSON.stringify(weekName)
    const data = {
      avl_date: formattedstartDate,
      avl_strttime: unavailabilityStartTime,
      avl_endtime: unavailabilityEndTime,
      // unavailabilityRepeat:unavailabilityRepeat,
      avl_stfid: selectedEmployee.stf_id,
      avl_type: availableType,
      avl_endson: endsOnDate,
      avl_occrnce: occurrences,
      avl_week: weekData,
      avl_foreryweeksorday: forEveryWD,
      created_at:currentTime


    }

    let endpoint = `insertData?table=fms_stf_unavailability`
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data)
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
        setTimeout(() => {

          navigate('/staff/profiles')

        }, 1700)
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

  const getUnavailabilityData = async () => {

    try {
      const url = `${BASE_URL}getAll?table=fms_stf_unavailability&select=avl_id,avl_strttime,avl_strttime,avl_endtime,avl_type,avl_endson,avl_occrnce,avl_stfid&company_id=${companyId}&fields=status&status=1`;
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
        console.log("check", data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  useEffect(() => {
    getUnavailabilityData();
    userRoleData()
  }, [])
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleImageDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure you want to delete this attachment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        setProfileImage('');
        setProfileImage2('');


      }
    });
  };

  const handleUpdate = e => {
    e.preventDefault()
    const emptyFields = [];

    if (!firstName) emptyFields.push('first name');
    
    if (!lastName) emptyFields.push('last name');
    if (!userName) emptyFields.push('Preferred name ');
   
    if (!email) emptyFields.push('Email');
    else if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'Email address is invalid.' });
      return;
    }
   

   

    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const newDob = dob ? dob.format('YYYY-MM-DD') : null

    const formData = new FormData()
    formData.append('stf_firstname', firstName)
      formData.append('photo', profileImage2);
    formData.append('stf_lastname', lastName)
    formData.append('stf_prfrdname', userName)
    formData.append('stf_email', email)
    formData.append('stf_dob', newDob)
    formData.append('stf_gender', gender)
    formData.append('updated_at', currentTime);

    

    let endpoint = `updateAll?table=fms_staff_detail&field=stf_id&id=${id}`
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    console.log(formData)
    response.then(data => {
 
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




  // get pay level 
  const getPayLevel = async () => {
    let endpoint = 'getAll?table=fms_staff_pay_levels&select=pay_level_id,pay_level_name';

    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setPayLevelList(res.messages)
      // console.log(res);
    }

  }
 
  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setPrimaryManagerList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  useEffect(() => {
    getStaff();
    getPayLevel();
  }, [])

  const handleUpdateThree = e => {
    // alert('working from three');
    e.preventDefault();

    if (!EmploymentType || !jobTitle || !startDate) {
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
    formData.append('stf_empltype', EmploymentType);
    formData.append('stf_empljobtitle', jobTitle);
    formData.append('stf_strtdate', sdateFormat);
    formData.append('stf_enddate', edateFormat);
    formData.append('stf_pmrymngr', primaryManager);
    formData.append('stf_acccode', accountingCode);
    formData.append('stf_paylvl', payLevel);
    formData.append('stf_prfilstats', profileState);
    formData.append('updated_at', currentTime);

    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Data has been Updated.`,
          showConfirmButton: false,
          timer: 1500,
        });
        //setIsEditing(false);
      } else {
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
    formData.append('stf_archive', archiveValue)

    const endpoint = `updateAll?table=fms_staff_detail&field=stf_id&id=${id}`

    const response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)

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

  const goBack = () => {
    navigate(-1)
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
                      <>{
                        profileImage2 ? <>
                          <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)', color: '#fff', padding: '4px' }}>
                            <DeleteIcon onClick={handleImageDelete} />
                          </div>
                        </> : <>
                          <img src={`${IMG_BASE_URL}${profileImage}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)', color: '#fff', padding: '4px' }}>
                            <DeleteIcon onClick={handleImageDelete} />
                          </div>
                        </>
                      }

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
                onBlur={() => handleBlur('first name')}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />

              <TextField
                required
                value={lastName}
                label='Last Name'
                onChange={e => {
                  setLastName(e.target.value)
                }}
                onBlur={() => handleBlur('Last Name')}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />

              <TextField
                required
                value={userName}
                label='Preferred name'
                onChange={e => {
                  setUserName(e.target.value)
                }}
                onBlur={() => handleBlur('Preferred name')}
            error={!!errors.userName}
            helperText={errors.userName}
              />

              <TextField
                required
                value={email}
                label='Email'
                onChange={e => {
                  setEmail(e.target.value)
                }}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                error={!!errors.email}
                helperText={errors.email}
              />
            

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
                  <FormControlLabel value='Female' control={<Radio />} label='Female' />
                  <FormControlLabel value='Male' control={<Radio />} label='Male' />
                  <FormControlLabel value='Other' control={<Radio />} label='Other' />
                </RadioGroup>
              </FormControl>

              <Box sx={{ width: '100ch', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                  <Button variant='outlined' color='error' onClick={goBack} type='button'>
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
            <ContactPage participantId={id} selectedEmployee={selectedEmployee}  />
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
                        primaryManagerList?.map((item) => {

                          return (
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
                        payLevelList?.map((item) => {

                          return (
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
                  <Button variant='outlined' color='error' onClick={goBack} type='button'>
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
        





              <Modal title='Add Unavailability' style={{ width: '800px' }} className='staff_formModal' open={isModalOpen} onSubmit={handleOkModelFirst}
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
                        <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>


                <Row style={{ margin: '10px 0px 10px 0px' }}>
                  <Col span={24}>
                    <FormGroup>
                      <FormControlLabel
                        required
                        control={unavailabilityDate === 1 ? <Switch defaultChecked /> : <Switch />}
                        label='Repeat unavailability'
                        value={unavailabilityRepeat}

                        onClick={handleAddRow}

                      />
                    </FormGroup>
                  </Col>
                </Row>
                {
                  unavailabilityRepeat ? (<>
                    <div className='custom_Radio' style={{ display: 'flex', justifyContent: 'end' }}>
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
                    <div style={{ display: 'flex', gap: '27px', marginLeft: "7px", marginTop: "14px", marginBottom: "20px" }}>

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
                      {availableType === "Ends on" ?
                        <LocalizationProvider dateAdapter={AdapterDayjs} className="endsON">
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
                        : <TextField
                          style={{ width: '100%' }}
                          type='number'
                          required

                          defaultValue={occurrences}
                          onChange={e => {
                            setOccurrences(e.target.value)
                          }}
                        />}




                    </div></>) : null
                }

                {
                  forEveryWD === "Week" && unavailabilityRepeat ?
                    <Grid container direction="row" justifyContent="start" alignItems="center" >


                      {daysOfWeek.map((item, index) => {
                        console.log(item);
                        return (
                          <>
                            <FormControlLabel key={index}
                              control={<Checkbox
                                value={item.label}

                                onChange={handleCheckboxChange}
                              />}
                              label={item.label}
                              labelPlacement="top"
                            />
                          </>
                        )
                      })}



                    </Grid> : null
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
                  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                    <InputLabel id='Role'>Role</InputLabel>
                    <Select labelId='Role' id='Role' value={userRole} label='Role' onChange={e => setUserRole(e.target.value)}>
                      {userRoleList?.map(item => {
                        return (
                          <MenuItem key={item?.permission_id} value={item?.permission_id}>
                            {item?.user_role}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={4}>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <FormLabel id='demo-row-radio-buttons-group-label'>Account status</FormLabel>
                    <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label' name='row-radio-buttons-group'>
                      {
                        accountStatus == 1 ? <><FormControlLabel value='Active' control={<Radio />} label='Active' checked />
                          <FormControlLabel value='Inactive' control={<Radio />} label='Inactive' disabled /></> :

                          <><FormControlLabel value='Active' control={<Radio />} label='Active' disabled />
                            <FormControlLabel value='Inactive' control={<Radio />} label='Inactive' checked /></>
                      }

                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ width: '100%', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                  <Button variant='outlined' color='error' onClick={goBack} type='button'>
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
                  <Button variant='outlined' color='error' type='button' onClick={handleUpdateArchive}>
                    Archive
                  </Button>
                  <Button variant='outlined' type='submit' onClick={goBack}>
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


