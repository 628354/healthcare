import React, { useContext, useEffect, useState } from 'react'
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

//grid imports
//import { styled } from '@mui/material/styles';
//import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'

import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { BASE_URL, COMMON_GET_FUN, COMMON_GET_PAR, COMMON_NEW_ADD, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST, IMG_BASE_URL, companyId } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext'


const Edit = () => {
  const { allowUser,companyId} = useContext(AuthContext)
  const allowPre = allowUser.find((data) => {
    // //console.log(data);
  
    if (data.user === "Company") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
    }
  
  
  })
console.log(allowPre);

  const [value, setValue] = React.useState('1')
  const [selectedEmployee, setSelectedEmployee] = useState([])
  const [staff, setStaff] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  //dialog box state code start
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }


  const [companyName, setCompanyName] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [timezone, setTimezone] = useState('')
  const [ndis, setNdis] = useState('')
  const [abn, setAbn] = useState('')

  const [account, setAccount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  const [password, setPassword] = useState();

  const [currentId, setCurrentId] = useState(null)

  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileImage2, setProfileImage2] = useState(null);
console.log(profileImage);
const [errors, setErrors] = useState({
  companyName: '',
  phone: '',
  email: '',
  address: '',
  website: '',
  timezone: '',
  ndis: '',
  abn: '',
  password: '',
  confirmPassword: '',
});
const validateMobileNumber = (value) => {
  return /^\d{10}$/.test(value);
};

const validateEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const validatePassword = (value) => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(value);
};

const validateWebsiteURL = (value) => {
  const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(\/[a-zA-Z0-9#]+\/?)*$/;
  return urlPattern.test(value);
};
const handleFocus = (field) => {
  switch (field) {
    
    case 'phone':
      setErrors({ ...errors, phone: validateMobileNumber(phone) ? '' : 'Mobile number should be exactly 10 digits.' });
      break;
    case 'email':
      setErrors({ ...errors, email: validateEmail(email) ? '' : 'Email address is invalid.' });
      break;
    case 'password':
      setErrors({ ...errors, password: validatePassword(password) ? '' : 'Password must be at least 8 characters long and contain at least one letter and one number.' });
      break;
    case 'confirmPassword':
      setErrors({ ...errors, confirmPassword: password === confirmPassword ? '' : 'Passwords do not match.' });
      break;
    case 'website':
      setErrors({ ...errors, website: validateWebsiteURL(website) ? '' : 'Website URL is invalid.' });
      break;
      
    default:
      break;
  }
};

const handleBlur = (field) => {
  handleFocus(field);
};


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

  
  const getCompany  = async () => {
    try {
      const staff = localStorage.getItem('user');
      if (!staff) {
        throw new Error('Staff data not found in localStorage');
      }
      const convert = JSON.parse(staff);
      const id = convert?.stf_id;

      let endpoint = `companyData?table=fms_company&id=${companyId}`;
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);

      if (response.status) {

        //console.log(response?.messages);

        setSelectedEmployee(response?.messages)
        setCompanyName(response?.messages.company_name || '');
        setPhone(response?.messages.phone || '');
        setAddress(response?.messages.address || '');
        setWebsite(response?.messages.website || '');
        setEmail(response?.messages.email || '');
        setTimezone(response?.messages.timezone || '');
        setNdis(response?.messages.registration_number || '');
        setAbn(response?.messages.abn || '');
        setProfileImage(response?.messages.photo || '');
        setCurrentId(response?.messages.id)

        setAccount(response?.messages.account_bsb || '');
        setAccountName(response?.messages.account_name || '');
        setAccountNumber(response?.messages.account_number);
        setPassword(response?.messages.password)
        setConfirmPassword(response?.messages.password);

      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  useEffect(() => {
    getCompany();
  }, [])


  const handleUpdate = e => {
    e.preventDefault()
    const emptyFields = [];

    if (!companyName) emptyFields.push('Company Name');
    if (!phone) emptyFields.push('Phone');
    else if (!validateMobileNumber(phone)) {
      setErrors({ ...errors, phone: 'Mobile number should be exactly 10 digits.' });
      return;
    }

    if (!address) emptyFields.push('Address');
    if (!website) emptyFields.push('Website');
    else if (!validateWebsiteURL(website)) {
      setErrors({ ...errors, website: 'Website URL is invalid.' });
      return;
    }
    if (!email) emptyFields.push('Email');
    else if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'Email address is invalid.' });
      return;
    }
    if (!password) emptyFields.push('Password');
    else if (!validatePassword(password)) {
      setErrors({ ...errors, password: 'Password must be at least 8 characters long and contain at least one letter and one number.' });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
      return;
    }
    if (!timezone) emptyFields.push('Timezone');
    if (!ndis) emptyFields.push('NDIS');
    if (!abn) emptyFields.push('ABN');

    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    // const newDob = dob ? dob.format('YYYY-MM-DD') : null
    const formData = new FormData()
    formData.append('company_name', companyName)
    formData.append('phone', phone);
    formData.append('address', address)
    formData.append('website', website)
    formData.append('email', email)
    formData.append('timezone', timezone)
    formData.append('registration_number', ndis)
    formData.append('abn', abn)
    formData.append('photo', profileImage2);

    formData.append('account_bsb', account)
    formData.append('account_name', accountName);
    formData.append('account_number', accountNumber);
    let endpoint = `updateAll?table=fms_company&field=id&id=${currentId}`
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    //console.log(formData)
    response.then(data => {

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











  return (
    <div className='small-container'>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label='Personal Details' value='1' />
              <Tab label='Contact Details' value='2' />
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
              <div style={{ marginBottom: '10px', marginLeft: "10px" }}>
                <label htmlFor='profile-picture' style={{ display: 'block' }}>
                  Logo
                </label>
                <label
                  htmlFor='profile-picture'
                  style={{
                    display: 'block',
                    width: '180px',
                    height: '100px',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: '10px',
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
                <input id='profile-picture' type='file' accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>

              <TextField
                required
                value={companyName}
                label='Company Name'
                onChange={e => {
                  setCompanyName(e.target.value)
                }}
                onBlur={() => handleBlur('companyName')}
                error={!!errors.companyName}
                helperText={errors.companyName}
              />

              <TextField
                required
                value={phone}
                label='Phone'
                onChange={e => {
                  setPhone(e.target.value)
                }}
                onFocus={() => handleFocus('phone')}
                onBlur={() => handleBlur('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
              />

             
              <TextField
                required
                value={website}
                label='Website'
                onChange={e => {
                  setWebsite(e.target.value)
                }}
                onFocus={() => handleFocus('website')}
                onBlur={() => handleBlur('website')}
                error={!!errors.website}
                helperText={errors.website}
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
              <TextField
                required
                value={password}
                label="Password"
                type="password"
                onChange={(e) => { setPassword(e.target.value) }}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                error={!!errors.password}
                helperText={errors.password}
              />
   <TextField
          required
          label="Confirm Password"
          type="password"
          onChange={e => setConfirmPassword(e.target.value)}
          onFocus={() => handleFocus('confirmPassword')}
          onBlur={() => handleBlur('confirmPassword')}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
         <TextField
                required
                value={address}
                label='Address'
                onChange={e => {
                  setAddress(e.target.value)
                }}
                onBlur={() => handleBlur('address')}
                error={!!errors.address}
                helperText={errors.address}
              />

              <FormControl id="selecet_tag_w" className="desk_sel_w" sx={{ m: 1 }}>
                <InputLabel id="select-four-label">Timezone</InputLabel>
                <Select
                  labelId="select-four-label"
                  id="select-four-label"
                  value={timezone}
                  label="Timezone"
                  onChange={(e) => { setTimezone(e.target.value) }}
                  onFocus={() => handleFocus('timezone')}
                  onBlur={() => handleBlur('timezone')}
                  error={!!errors.timezone}
                  helperText={errors.timezone}
                >
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </FormControl>

              <TextField
                required
                value={ndis}
                label='NDIS'
                onChange={e => {
                  setNdis(e.target.value)
                }}
                onBlur={() => handleBlur('ndis')}
                error={!!errors.ndis}
                helperText={errors.ndis}
              />

              <TextField
                required
                value={abn}
                label='ABN'
                onChange={e => {
                  setAbn(e.target.value)
                }}
                onBlur={() => handleBlur('abn')}
                error={!!errors.abn}
                helperText={errors.abn}
              />






              <Box sx={{ width: '100ch', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>
                

                  {allowPre?.edit ? <Button variant='outlined' type='submit'>
                    Update
                  </Button> : ""}

                </Stack>
              </Box>
            </Box>
          </TabPanel>


          <TabPanel value='2'>
          <Box sx={{ flexGrow: 1 }} component='form' onSubmit={handleUpdate} >
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <h3>Payment Details</h3>
                </Grid>
                <Grid xs={6}>
                  <TextField
                    style={{ width: '100%' }}
                    required
                    label='Account BSB'
                    value={account}

                    onChange={e => {
                      setAccount(e.target.value)
                    }}
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    style={{ width: '100%' }}
                    required
                    label='Account Number'
                    value={accountNumber}

                    onChange={e => {
                      setAccountNumber(e.target.value)
                    }}
                  />
                </Grid>
                <Grid xs={6}>
                  <TextField
                    style={{ width: '100%' }}
                    required
                    label='Account Name'
                    value={accountName}

                    onChange={e => {
                      setAccountName(e.target.value)
                    }}
                  />
                </Grid>




              </Grid>

              <Box sx={{ width: '100ch', m: 1 }}>
                <Stack direction='row-reverse' spacing={2}>

                  {allowPre?.edit ? <Button variant='outlined' type='submit'>
                    Update
                  </Button> : ""}
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
