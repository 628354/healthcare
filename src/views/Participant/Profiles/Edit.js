import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
//inner pages 
import ContactPage from './ContactComponent/ContactD'
import DocumentPage from './Documents/index'
import RpRegister from '../RPRegister/index'
import AbcLogs from '../../Reportings/ABCLog/index'
import Incidents from '../../Reportings/Incident/index'
import ProgressNotes from '../../Reportings/ProgressNotes/index'

import { BASE_URL, COMMON_ADD_FUN, COMMON_UPDATE_FUN, IMG_BASE_URL } from '../../../helper/ApiInfo'

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Tab Imports
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// radio buttons
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Grid from '@mui/material/Unstable_Grid2';

import { Card, CardContent, Typography } from '@mui/material'
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';

import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';



const Edit = ({ selectedEmployee, setIsEditing, allowPre, setShow }) => {
const currentDate = new Date()

  const [divShadow, setDivShadow] = useState(true)
  const [updateDate, setUpdateDate] = useState(null)
  const [createDate, setCreateDate] = useState(null)

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [value, setValue] = React.useState('1');


console.log(selectedEmployee.prtcpnt_dob);
  const id = selectedEmployee.prtcpnt_id;
  const selectedEmployeeName = `${selectedEmployee.prtcpnt_firstname} ${selectedEmployee.prtcpnt_lastname}`
  // //console.log(selectedEmployee);
  const [firstName, setFirstName] = useState(selectedEmployee.prtcpnt_firstname);
  const [profileImage, setProfileImage] = useState(selectedEmployee.photo);
  const [lastName, setLastName] = useState(selectedEmployee.prtcpnt_lastname);
  const [email, setEmail] = useState(selectedEmployee.prtcpnt_email);
  const [userName, setUserName] = useState(selectedEmployee.prtcpnt_prefd_name);
  const [dob, setDob] = useState(selectedEmployee.prtcpnt_dob === '0000-00-00' ? "":selectedEmployee.prtcpnt_dob);
  const [gender, setGender] = useState(selectedEmployee?.prtcpnt_gender);
  //const [password, setPassword] = useState(selectedEmployee.stf_pswrd);
  const [profileImage2, setProfileImage2] = useState(null);
  const [address, setAddress] = useState(selectedEmployee?.prtcpnt_address);
  const [contactNumber, setContactNumber] = useState(selectedEmployee?.prtcpnt_cntctno);

  const [name, setName] = useState(selectedEmployee?.prtcpnt_emgname);
  const [emergencyContact, setEmergencyContact] = useState(selectedEmployee?.prtcpnt_emgno);
  const [relation, setRelation] = useState(selectedEmployee?.prtcpnt_emgrelatn);


console.log(selectedEmployee?.prtcpnt_srvstartdate);
  const [serviceStartDate, setServiceStartDate] = useState(selectedEmployee?.prtcpnt_srvstartdate === '0000-00-00' ? "":selectedEmployee.prtcpnt_srvstartdate);
  const [serviceEndDate, setServiceEndDate] = useState(selectedEmployee?.prtcpnt_srvenddate === '0000-00-00' ? "":selectedEmployee?.prtcpnt_srvenddate);
  const [fundingType, setFundingType] = useState(selectedEmployee?.prtcpnt_srvfundtype);

  const [NDISNumber, setNDISNumber] = useState(selectedEmployee?.prtcpnt_srvndis);
  const [medicareNumber, setMedicareNumber] = useState(selectedEmployee?.prtcpnt_srvmedicare);
  const [privateHealthcareNumber, setPrivateHealthcareNumber] = useState(selectedEmployee?.prtcpnt_srvhealthcare);
  const [ambulancNumber, setAmbulancNumber] = useState(selectedEmployee?.prtcpnt_srvamblno);
  const [invoiceTo, setInvoiceTo] = useState(selectedEmployee?.prtcpnt_srvinvoice);


  const minSelectableDate = dayjs(serviceStartDate).add(1, 'day');


  const archive = selectedEmployee.prtcpnt_archive

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if(archive == 0){
      setShow(true)
      return () => setShow(false)
    }else{
      setShow(true)
      return () => setShow(false)
    }
       
      }, [archive])

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


  const navigate = useNavigate();

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
  //console.log(profileImage2);

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
        // Perform deletion action
        setProfileImage('');
        setProfileImage2('');

        // Open file input for uploading a new image

      }
    });
  };

  const handleUpdate = e => {

    e.preventDefault();


    if (serviceEndDate && serviceStartDate && serviceEndDate.isBefore(serviceStartDate, 'day')) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'End date cannot be earlier than the start date.',
        showConfirmButton: true
      });
    }
    const newDob = dob ? dob.format('YYYY-MM-DD') : null

    const ServiceStartDate = serviceStartDate ? serviceStartDate.format('YYYY-MM-DD') : null
    const ServiceEndDate = serviceEndDate ? serviceEndDate.format('YYYY-MM-DD') : null


    const fullName =`${firstName} ${lastName}`

    //console.log(profileImage2);
    const formData = new FormData();
    formData.append('prtcpnt_firstname', firstName);
    formData.append('photo', profileImage2);
    formData.append('prtcpnt_lastname', lastName);
    formData.append('prtcpnt_prefd_name', userName);
    formData.append('prtcpnt_email', email);
    formData.append('prtcpnt_dob', newDob);
    formData.append('prtcpnt_gender', gender);
    formData.append('prtcpnt_emgname', name);
    formData.append('prtcpnt_emgno', emergencyContact);
    formData.append('prtcpnt_emgrelatn', relation);
    formData.append('prtcpnt_srvstartdate', ServiceStartDate);
    formData.append('prtcpnt_srvenddate', ServiceEndDate);
    formData.append('prtcpnt_srvfundtype', fundingType);
    formData.append('prtcpnt_srvndis', NDISNumber);
    formData.append('prtcpnt_srvmedicare', medicareNumber);
    formData.append('prtcpnt_srvhealthcare', privateHealthcareNumber);
    formData.append('prtcpnt_srvamblno', ambulancNumber);
    formData.append('prtcpnt_srvinvoice', invoiceTo);
    formData.append('updated_at', currentTime);
    formData.append('participant_fullname',fullName);

    let endpoint = `updateAll?table=fms_prtcpnt_details&field=prtcpnt_id&id=${id}`;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    //console.log(formData);
    response.then((data) => {
      // //console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${firstName} ${lastName}'s data has been Updated.`,
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
    e.preventDefault();


    const archiveValue = determineArchiveValue();
    //console.log(archiveValue);
    const formData = new FormData();
    formData.append('prtcpnt_archive', archiveValue);

    const endpoint = `updateAll?table=fms_prtcpnt_details&field=prtcpnt_id&id=${id}`;

    const response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);

    response.then(data => {
      if (data.status) {

        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Account Has Been Archived`,
          showConfirmButton: false,
          timer: 1500,

        });
        setTimeout(() => {
          setIsEditing(false)
          // navigate('/participant/profiles')

        }, 1700)

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


  const determineArchiveValue = () => {

    return archive == 1 ? 0 : 1;
  };



  return (

    <>
      <div className="small-container">

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Personal Details" value="1" />
                <Tab label="Contact Details" value="2" />
                <Tab label="Documents" value="3" />
                <Tab label="RP Register" value="4" />

                <Tab label="ABC Logs" value="5" />
                <Tab label="Incidents" value="6" />
                <Tab label="Progress Notes" value="7" />

                <Tab label="Archive/Unarchive" value="8" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box
                component="form"

                sx={{
                  '& .MuiTextField-root': { m: 1, width: '50ch' },
                  //bgcolor:'#FFFFFF'
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleUpdate}
              >
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="profile-picture" style={{ display: 'block' }}>Profile picture</label>
                  <label htmlFor="profile-picture" style={{ display: 'block', width: '100px', height: '100px', border: '1px solid #ccc', cursor: 'pointer', position: 'relative' }}>
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
                  <input id="profile-picture" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                </div>

                <TextField
                  required
                  defaultValue={firstName}
                  label="First Name"
                  onChange={(e) => { setFirstName(e.target.value) }}
                />

                <TextField
                  required
                  defaultValue={lastName}
                  label="Last Name"
                  onChange={(e) => { setLastName(e.target.value) }}
                />

                <TextField
                  required
                  defaultValue={userName}
                  label="Preferred name"
                  onChange={(e) => { setUserName(e.target.value) }}
                />

                <TextField
                  required
                  value={email}
                  label="Email"
                  onChange={(e) => { setEmail(e.target.value) }}
                />



                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Date Of Birth" format="DD/MM/YYYY" defaultValue={dayjs(dob)} onChange={(newValue) => { setDob(newValue) }} />
                </LocalizationProvider>




                <FormControl style={{ padding: '6px 0px 0px 10px' }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={gender}
                    onChange={(e) => { setGender(e.target.value) }}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="Female" />
                    <FormControlLabel value="2" control={<Radio />} label="Male" />
                    <FormControlLabel value="3" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  required
                  value={address}
                  label="Address"
                  onChange={(e) => { setAddress(e.target.value) }}
                />
                <TextField
                  required
                  value={contactNumber}
                  label="Contact Number"
                  onChange={(e) => { setContactNumber(e.target.value) }}
                />

                <h4>Emergency Contact</h4>

                <TextField
                  required
                  value={name}
                  label="Name"
                  onChange={(e) => { setName(e.target.value) }}
                />
                <TextField
                  required
                  type="number"
                  value={emergencyContact}
                  label="Emergency Contact"
                  onChange={(e) => { setEmergencyContact(e.target.value) }}
                />
                <TextField
                  required
                  value={relation}
                  label="Relation"
                  onChange={(e) => { setRelation(e.target.value) }}
                />
                <h4>Service Details</h4>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Service Start Date" format="DD/MM/YYYY" value={dayjs(serviceStartDate)}  minDate={dayjs(currentDate)}  onChange={(newValue) => { setServiceStartDate(newValue) }} />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Service End Date" format="DD/MM/YYYY" value={dayjs(serviceEndDate)} minDate={dayjs(minSelectableDate)}  onChange={(newValue) => { setServiceEndDate(newValue) }} />
                </LocalizationProvider>
                <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                  <InputLabel id='administration-type'>Funding Type</InputLabel>
                  <Select
                    labelId='fundingType'
                    id='fundingType'
                    value={fundingType}
                    label='fundingType'
                    onChange={e => setFundingType(e.target.value)}
                  >  <MenuItem value="NDIS Managed">NDIS Managed</MenuItem>
                    <MenuItem value="Plan Managed">Plan Managed</MenuItem>
                    <MenuItem value="Self Managed">Self Managed</MenuItem>

                  </Select>
                </FormControl>

                <TextField
                  required
                  type="number"
                  value={NDISNumber}
                  label="NDIS Number"
                  onChange={(e) => { setNDISNumber(e.target.value) }}
                />

                <TextField
                  required
                  type="number"
                  value={medicareNumber}
                  label="Medicare Number"
                  onChange={(e) => { setMedicareNumber(e.target.value) }}
                />
                <TextField
                  required
                  type="number"
                  value={privateHealthcareNumber}
                  label="Private healthcare number"
                  onChange={(e) => { setPrivateHealthcareNumber(e.target.value) }}
                />
                <TextField
                  required
                  type="number"
                  value={ambulancNumber}
                  label="Ambulance number"
                  onChange={(e) => { setAmbulancNumber(e.target.value) }}
                />
                <TextField
                  required
                  multiline
                  rows={4}
                  type="text"
                  value={invoiceTo}
                  label="Invoice to"
                  onChange={(e) => { setInvoiceTo(e.target.value) }}
                />
                <Box sx={{ width: '100ch', m: 1 }}>
                  <Stack direction="row-reverse"
                    spacing={2}>
                    <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
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
            <TabPanel value="2">
              <ContactPage divShadow={divShadow} participantId={id} />







            </TabPanel>
            <TabPanel value="3" className='tab_parent'>
              <DocumentPage selectedEmployeeName={selectedEmployeeName} participantId={id} divShadow={divShadow} />
            </TabPanel>

            <TabPanel value="4" className='tab_parent'>
              <RpRegister selectedEmployeeName={selectedEmployeeName} participantId={id} divShadow={divShadow} />


            </TabPanel>
            <TabPanel value="5" className='tab_parent'>
              <AbcLogs participantId={id} divShadow={divShadow} />


            </TabPanel>

            <TabPanel value="6" className='tab_parent'>
              <Incidents participantId={id} divShadow={divShadow} />


            </TabPanel>
            <TabPanel value="7" className='tab_parent'>
              <ProgressNotes participantId={id} divShadow={divShadow} />


            </TabPanel>

            <TabPanel value="8">
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <h3>Archive this profile</h3>
                  </Grid>

                  <Grid xs={12} >
                    <Box sx={{ bgcolor: '#fbdddd', color: '#ea5455', p: 2, spacing: 2 }} ><ReportGmailerrorredOutlinedIcon /><span>This action will archive the staff and you will not be able to see staff in the list and drop-downs. Also, the system will not send document expiry or any other alerts for this account. If you wish to access this staff profile, you can go to Archive section in the menu.</span></Box>
                  </Grid>




                </Grid>

                <Box sx={{ width: '100%', m: 1 }}>
                  <Stack direction="row-reverse"
                    spacing={2}>
                       {
                                 archive ==0?   <Button variant="outlined" color="error"  type="button" onClick={handleUpdateArchive} >Unarchive</Button>: <Button variant="outlined" color="error"  type="button" onClick={handleUpdateArchive} >Archive</Button>
                        
                                    }
                    <Button variant="outlined" type="submit" onClick={() => setIsEditing(false)} >Cancel</Button>

                  </Stack>
                </Box>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>

      </div>

      <Card className='update_card' >
        <CardContent className='updateChild' >
          <div className="uppercase">
            <Typography variant="h5"> <span> {createDate} </span> {updateDate ? <span> || {updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card></>

  );
};

export default Edit;