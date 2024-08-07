import React, { useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
// Switch Imports
import FormGroup from '@mui/material/FormGroup';
//import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

//grid imports
//import { styled } from '@mui/material/styles';
//import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
// Dialog imports
import { Modal } from 'antd';
// chip imports
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// gid imports
import { Col, Row } from 'antd';

import Swal from 'sweetalert2';
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
  'Kelly Snyder',
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// multiselect code end
const style = {
  padding: '8px 0',
};

const Edit = ({ selectedEmployee, setIsEditing }) => {

    /* Model Styling in css start */

    /* Model Styling css ends */
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    //dialog box state code start
         const [isModalOpen, setIsModalOpen] = useState(false);
          const showModal = () => {
            setIsModalOpen(true);
          };
          const handleOkModelFirst = () => {
            if(!unavailabilityDate || !unavailabilityStartTime || !unavailabilityEndTime){
              setIsModalOpen(false);  
              return Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'All fields are required.',
                showConfirmButton: true,
              });
            }
            // creating new formdata object
            $data = new FormData();
            alert('insert data function');

            
          };
          const handleCancel = () => {
            setIsModalOpen(false);
          };

    // dialog box state code end

    //multiselect state code start

        const theme = useTheme();
        //const [personName, setPersonName] = React.useState([]);

        const handleChangeSelect = (event) => {
          const {
            target: { value },
          } = event;
          setRole(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        };
    // multiselect state code end

  const id = selectedEmployee.stf_id;
console.log(selectedEmployee);
  const [firstName, setFirstName] = useState(selectedEmployee.stf_firstname);
  const [profileImage, setProfileImage] = useState(selectedEmployee.photo);
  const [lastName, setLastName] = useState(selectedEmployee.stf_lastname);
  const [email, setEmail] = useState(selectedEmployee.stf_email);
  const [userName, setUserName] = useState(selectedEmployee.stf_prfrdname);
  //const [password, setPassword] = useState(selectedEmployee.stf_pswrd);
  const [dob, setDob] = useState(selectedEmployee.stf_dob);
  const [gender, setGender] = useState(selectedEmployee.stf_gender);
  const [personalContact, setPersonalContact] = useState(selectedEmployee.stf_prsnlcntctno);
  const [workContact, setWorkContact] = useState(selectedEmployee.stf_workcntctno);
  const [address, setAddress] = useState(selectedEmployee.stf_address);
  const [guardianName, setGuardianName] = useState(selectedEmployee.stf_emgname);
  const [guardianNumber, setGuardianNumber] = useState(selectedEmployee.stf_emgctcno);
  const [guardianRelation, setGuardianRelation] = useState(selectedEmployee.stf_emgrelntn);
  const [EmploymentType , setEmploymentType] =useState(selectedEmployee.stf_empltype);
  const [jobTitle, setJobTitle] = useState(selectedEmployee.stf_empljobtitle);
  const [startDate, setStartDate] = useState(selectedEmployee.stf_strtdate);
  const [endDate, setEndDate] = useState(selectedEmployee.stf_enddate);
  const [primaryManager, setPrimaryManager] = useState(selectedEmployee.stf_pmrymngr);
  const [accessCode, setAccessCode] = useState(selectedEmployee.stf_acccode);
  const [payLevel, setPayLevel] = useState(selectedEmployee.stf_paylvl);
  const [profileState, setProfileState] = useState(selectedEmployee.stf_prfilstats);
  const [role, setRole] = useState([]);
  //const [accountStatus, setAccountStatus] = useState(selectedEmployee.stf_accstatus);
  //const [archive, setArchive] = useState(selectedEmployee.stf_archive);
  //const [status, setStatus] = useState(selectedEmployee.stf_status);

  // Handling Unavailability form State
  const[unavailabilityDate,setUnavailabilityDate] = useState('');
  const[unavailabilityStartTime,setUnavailabilityStartTime] = useState('');
  const[unavailabilityEndTime,setUnavailabilityEndTime] = useState('');
  const[unavailabilityRepeat,setUnavailabilityRepeat] = useState('');


  const handleUpdate = e => {

    //alert('working'); 
    e.preventDefault();

    if (  !firstName || !lastName || !email || !userName || !gender || !dob ) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const formData = new FormData();
    formData.append('stf_firstname',firstName);
    formData.append('photo',profileImage);
    formData.append('stf_lastname',lastName);
    formData.append('stf_prfrdname',userName);
    formData.append('stf_email',email);
    formData.append('stf_dob',dob);
    formData.append('stf_gender',gender);

    /* const data = {
      stf_firstname:firstName,
      stf_lastname:lastName,
      stf_prfrdname:userName,
      stf_email:email,
      stf_pswrd:password,
      stf_dob:dob,
      stf_gender:gender,
      stf_prsnlcntctno:personalContact,
      stf_workcntctno:workContact,
      stf_address:address,
      stf_emgname:guardianName,
      stf_emgctcno:guardianNumber,
      stf_empljobtitle:jobTitle,
      stf_strtdate:startDate,
      stf_enddate:endDate,
      stf_pmrymngr:primaryManager,
      stf_acccode:accessCode,
      stf_paylvl:payLevel,
      stf_prfilstats:profileState,
      stf_role:role,
      stf_accstatus:accountStatus,
      stf_archive:archive,
      stf_status:status,
    };  */
      
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id='+id;
    let response = update(url,endpoint,formData);
      response.then((data)=>{
          // //console.log(data.status);
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `${firstName} ${lastName}'s data has been Updated.`,
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

    const handleUpdateTwo = e => {
    alert('working from two'); 
    e.preventDefault();

    if ( !personalContact ||!workContact || !address || !guardianName || !guardianNumber || !guardianRelation) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    } 

    const formData = new FormData();
    formData.append('stf_prsnlcntctno',personalContact);
    formData.append('stf_workcntctno',workContact);
    formData.append('stf_address',address);
    formData.append('stf_emgname',guardianName);
    formData.append('stf_emgctcno',guardianNumber);
    formData.append('stf_emgrelntn',guardianRelation);
      
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id='+id;
    let response = update(url,endpoint,formData);
      response.then((data)=>{
          // //console.log(data.status);
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

  const handleUpdateThree = e => {
    //alert('working from three'); 
    e.preventDefault();

    if ( !EmploymentType ||!jobTitle || !startDate || !endDate || !primaryManager || !accessCode || !payLevel || !profileState) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    } 

    const formData = new FormData();
    formData.append('stf_empltype',EmploymentType);
    formData.append('stf_empljobtitle',jobTitle);
    formData.append('stf_strtdate',startDate);
    formData.append('stf_enddate',endDate);
    formData.append('stf_pmrymngr',primaryManager);
    formData.append('stf_acccode',accessCode);
    formData.append('stf_paylvl',payLevel);
    formData.append('stf_prfilstats',profileState);
      
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id='+id;
    let response = update(url,endpoint,formData);
      response.then((data)=>{
          // //console.log(data.status);
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


    async function update(url,endpoint,formData){
          //console.log(data);
          // //console.log('console from function');
        const response =  await fetch( url+endpoint,{
                                      method: "POST", // *GET, POST, PUT, DELETE, etc.
                                      mode: "cors",
                                      /* headers: {
                                        "Content-Type": "application/json",
                                        //'Content-Type': 'application/x-www-form-urlencoded',
                                      }, */
                                      body: formData, // body data type must match "Content-Type" header
                                    }); 
          return response.json();
    }

  return (
    <div className="small-container">
        <h1>Edit Employee</h1>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Personal Details" value="1" />
                <Tab label="Contact Details" value="2" />
                <Tab label="Employment Details" value="3" />
                <Tab label="Unavailability" value="4" />
                <Tab label="Documents" value="5" />
                <Tab label="Account Settings" value="6" />
                <Tab label="Archive/Unarchive" value="7" />
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
                        <TextField
                          
                          
                          label="Profile Picture"
                          type="file"
                          onChange={(e)=>{setProfileImage(e.target.files[0])}}
                        />

                        <TextField
                          required
                          defaultValue={firstName}
                          label="First Name"
                          onChange={(e)=>{setFirstName(e.target.value)}}
                        />

                        <TextField
                          required
                          defaultValue={lastName}
                          label="Last Name"
                          onChange={(e)=>{setLastName(e.target.value)}}
                        />

                        <TextField
                          required
                          defaultValue={userName}
                          label="User Name"
                          onChange={(e)=>{setUserName(e.target.value)}}
                        />

                        <TextField
                          required
                          defaultValue={email}
                          label="Email"
                          onChange={(e)=>{setEmail(e.target.value)}}
                        />

                        

                        {/* date picker field */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker label="Date Of Birth" defaultValue={dayjs(dob)} onChange={(newValue)=>{setDob(newValue)}} />
                        </LocalizationProvider>

                        <FormControl style={{ padding:'6px 0px 0px 10px'}}>
                          <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={gender}
                            onChange={(e)=>{setGender(e.target.value)}}
                          >
                            <FormControlLabel value="1" control={<Radio />} label="Female" />
                            <FormControlLabel value="2" control={<Radio />} label="Male" />
                            <FormControlLabel value="3" control={<Radio />} label="Other" />
                          </RadioGroup>
                        </FormControl>
                        
                        
                        
                        <Box sx={{width: '100ch',m:1}}>
                            <Stack direction="row-reverse"
                                  spacing={2}>
                              <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                              <Button variant="outlined" type="submit" >Update</Button>
                              
                            </Stack>
                        </Box>
                    </Box>
            </TabPanel>
            <TabPanel value="2">
                            <Box sx={{ flexGrow: 1,m:1 }} component="form" onSubmit={handleUpdateTwo}>
                              <Grid container spacing={2}>
                                <Grid xs={10}>
                                  <h3>Contact Details</h3>
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Personal Contact"
                                          type="number"
                                          defaultValue={personalContact}
                                          onChange={(e)=>{setPersonalContact(e.target.value)}}
                                          
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Work Contact"
                                          type="number"
                                          defaultValue={workContact}
                                          onChange={(e)=>{setWorkContact(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Address"
                                          defaultValue={address}
                                          onChange={(e)=>{setAddress(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={12}>
                                  <h3>Emergency Contact </h3>
                                  <hr></hr>
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Name"
                                          defaultValue={guardianName}
                                          onChange={(e)=>{setGuardianName(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Number"
                                          type="number"
                                          defaultValue={guardianNumber}
                                          onChange={(e)=>{setGuardianNumber(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Relation"
                                          defaultValue={guardianRelation}
                                          onChange={(e)=>{setGuardianRelation(e.target.value)}}
                                        />
                                </Grid>
                              </Grid>

                              <Box sx={{m:1}}>
                                <Stack direction="row-reverse"
                                      spacing={2}>
                                  <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                                  <Button variant="outlined" type="submit" >Update</Button>
                                  
                                </Stack>
                              </Box>
                            </Box>
                            

                                        


                                        

                                        
                    </TabPanel>
            <TabPanel value="3">
                            <Box sx={{ flexGrow: 1 }} component="form"  onSubmit={handleUpdateThree}>
                              <Grid container spacing={2}>
                                <Grid xs={12}>
                                  <h3>Employment Details</h3>
                                </Grid>
                                <Grid xs={6}>
                                          <FormControl sx={{width: '100%'}}>
                                            <InputLabel id="select-one-label">Employment type</InputLabel>
                                            <Select
                                              labelId="select-one-label"
                                              id="select-one-label"
                                              value={EmploymentType}
                                              label="Employment type"
                                              onChange={(e)=>{setEmploymentType(e.target.value)}}
                                            >
                                              <MenuItem value={1}>Full Time</MenuItem>
                                              <MenuItem value={2}>Part Time</MenuItem>
                                              <MenuItem value={3}>Casual</MenuItem>
                                            </Select>
                                          </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                          <TextField
                                            style={{width:'100%'}}
                                            required
                                            label="Job Title"
                                            defaultValue={jobTitle}
                                            onChange={(e)=>{setJobTitle(e.target.value)}}
                                          />
                                </Grid>
                                <Grid xs={6}>
                                        {/* date picker field */}
                                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                            <DatePicker label="Start Date"  sx={{width: '100%'}} defaultValue={dayjs(startDate)} onChange={(newValue)=>{setStartDate(newValue)}} />
                                        </LocalizationProvider>
                                </Grid>
                                <Grid xs={6}>
                                        {/* date picker field */}
                                        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                            <DatePicker label="End Date" sx={{width: '100%'}}  defaultValue={dayjs(endDate)} onChange={(newValue)=>{setEndDate(newValue)}} />
                                        </LocalizationProvider>
                                </Grid>
                                <Grid xs={6}>
                                          <FormControl sx={{width: '100%'}}>
                                            <InputLabel id="select-one-label">Primary Manager</InputLabel>
                                            <Select
                                              labelId="select-one-label"
                                              id="select-one-label"
                                              value={primaryManager}
                                              label="Primary Manager"
                                              onChange={(e)=>{setPrimaryManager(e.target.value)}}
                                            >
                                              <MenuItem value={1}>Test1</MenuItem>
                                              <MenuItem value={2}>Test2</MenuItem>
                                              <MenuItem value={3}>Test3</MenuItem>
                                            </Select>
                                          </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                          <FormControl sx={{width: '100%'}}>
                                            <InputLabel id="select-one-label">Accounting code</InputLabel>
                                            <Select
                                              labelId="select-one-label"
                                              id="select-one-label"
                                              value={accessCode}
                                              label="Accounting code"
                                              onChange={(e)=>{setAccessCode(e.target.value)}}
                                            >
                                              <MenuItem value={1}>Test1</MenuItem>
                                              <MenuItem value={2}>Test2</MenuItem>
                                              <MenuItem value={3}>Test3</MenuItem>
                                            </Select>
                                          </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                          <FormControl sx={{width: '100%'}}>
                                            <InputLabel id="select-one-label">Pay Levels</InputLabel>
                                            <Select
                                              labelId="select-one-label"
                                              id="select-one-label"
                                              value={payLevel}
                                              label="Pay Levels"
                                              onChange={(e)=>{setPayLevel(e.target.value)}}
                                            >
                                              <MenuItem value={1}>Home Care Level 1</MenuItem>
                                              <MenuItem value={2}>Home Care Level 2</MenuItem>
                                              <MenuItem value={3}>Home Care Level 3</MenuItem>
                                              <MenuItem value={4}>Service Coordinator</MenuItem>
                                            </Select>
                                          </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                          <FormControl sx={{width: '100%'}}>
                                            <InputLabel id="select-one-label">Profile status</InputLabel>
                                            <Select
                                              labelId="select-one-label"
                                              id="select-one-label"
                                              value={profileState}
                                              label="Profile status"
                                              onChange={(e)=>{setProfileState(e.target.value)}}
                                            >
                                              <MenuItem value={1}>Compliant</MenuItem>
                                              <MenuItem value={2}>Non Compliant</MenuItem>
                                            </Select>
                                          </FormControl>
                                </Grid>
                              </Grid>

                              <Box sx={{m:1}}>
                                <Stack direction="row-reverse"
                                      spacing={2}>
                                  <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                                  <Button variant="outlined" type="submit" >Update</Button>
                                  
                                </Stack>
                              </Box>
                            </Box>
                                          
            </TabPanel>
            <TabPanel value="4">
                          <>
                                
                                <Row
                                  gutter={{
                                    xs: 8,
                                    sm: 16,
                                    md: 24,
                                    lg: 32,
                                  }}
                                >
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}><h3>Unavailability</h3></div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}></div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}></div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}><Button variant="outlined" color="success" onClick={showModal}><AddOutlinedIcon/>Add</Button></div>
                                  </Col>
                                </Row>
                                
                                <Modal title="Add Unavailability" open={isModalOpen} onOk={handleOkModelFirst} onCancel={handleCancel}>
                                <Row style={{margin:'20px 0px 10px 0px'}}>
                                      <Col span={24}>
                                          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                              <DatePicker label="Start Date"  sx={{width: '100%'}} defaultValue={dayjs(unavailabilityDate)} onChange={(newValue)=>{setUnavailabilityDate(newValue)}} />
                                          </LocalizationProvider>
                                      </Col>
                                </Row>
                                <Row style={{margin:'10px 0px 10px 0px'}}>
                                      <Col span={11}>
                                          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                              <TimePicker label="Start Time"  sx={{width: '100%'}} defaultValue={dayjs(unavailabilityStartTime)} onChange={(newValue)=>{setUnavailabilityStartTime(newValue)}} /> 
                                          </LocalizationProvider>
                                      </Col>
                                      <Col span={2}></Col>
                                      <Col span={11}>
                                          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                              <TimePicker label="End Time"  sx={{width: '100%'}} defaultValue={dayjs(unavailabilityEndTime)} onChange={(newValue)=>{setUnavailabilityEndTime(newValue)}} /> 
                                          </LocalizationProvider>
                                      </Col>
                                </Row>
                                
                                <Row style={{margin:'10px 0px 10px 0px'}}>
                                      <Col span={24}>
                                          <TextField
                                            style={{width:'100%'}}
                                            required
                                            label="Relation"
                                            defaultValue={userName}
                                            onChange={(e)=>{setGuardianRelation(e.target.value)}}
                                          />
                                      </Col>
                                </Row>

                                <Row style={{margin:'10px 0px 10px 0px'}}>
                                      <Col span={24}>
                                          <FormGroup>
                                            <FormControlLabel required control={<Switch />} label="Repeat unavailability"   defaultValue={unavailabilityRepeat}  value="1" onChange={(e)=>{setUnavailabilityRepeat(e.target.value)}} />
                                          </FormGroup>
                                      </Col>
                                </Row>

                              </Modal>
                          </>          
            </TabPanel>
            <TabPanel value="5">
                          <>
                              <Row
                                  gutter={{
                                    xs: 8,
                                    sm: 16,
                                    md: 24,
                                    lg: 32,
                                  }}
                                >
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}><h3>Documents</h3></div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}></div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}></div>
                                  </Col>
                                  <Col className="gutter-row" span={6}>
                                    <div style={style}><Button variant="outlined" color="success" onClick={showModal}><AddOutlinedIcon/>Add</Button></div>
                                  </Col>
                                </Row>
                                
                                <Modal title="Add Unavailability" open={isModalOpen} onOk={handleOkModelFirst} onCancel={handleCancel}>
                                <Row style={{margin:'20px 0px 10px 0px'}}>
                                      <Col span={24}>
                                          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                              <DatePicker label="Start Date"  sx={{width: '100%'}} defaultValue={dayjs(unavailabilityDate)} onChange={(newValue)=>{setUnavailabilityDate(newValue)}} />
                                          </LocalizationProvider>
                                      </Col>
                                </Row>
                                <Row style={{margin:'10px 0px 10px 0px'}}>
                                      <Col span={11}>
                                          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                              <TimePicker label="Start Time"  sx={{width: '100%'}} defaultValue={dayjs(unavailabilityStartTime)} onChange={(newValue)=>{setUnavailabilityStartTime(newValue)}} /> 
                                          </LocalizationProvider>
                                      </Col>
                                      <Col span={2}></Col>
                                      <Col span={11}>
                                          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width: '100%'}} >
                                              <TimePicker label="End Time"  sx={{width: '100%'}} defaultValue={dayjs(unavailabilityEndTime)} onChange={(newValue)=>{setUnavailabilityEndTime(newValue)}} /> 
                                          </LocalizationProvider>
                                      </Col>
                                </Row>
                                
                                <Row style={{margin:'10px 0px 10px 0px'}}>
                                      <Col span={24}>
                                          <TextField
                                            style={{width:'100%'}}
                                            required
                                            label="Relation"
                                            defaultValue={userName}
                                            onChange={(e)=>{setGuardianRelation(e.target.value)}}
                                          />
                                      </Col>
                                </Row>

                                <Row style={{margin:'10px 0px 10px 0px'}}>
                                      <Col span={24}>
                                          <FormGroup>
                                            <FormControlLabel required control={<Switch />} label="Repeat unavailability"   defaultValue={unavailabilityRepeat}  value="1" onChange={(e)=>{setUnavailabilityRepeat(e.target.value)}} />
                                          </FormGroup>
                                      </Col>
                                </Row>

                              </Modal> 
                          </> 
              </TabPanel>
            <TabPanel value="6">
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <h3>Account Settings</h3>
                    </Grid>
                    
                    <Grid xs={8} >
                                <FormControl sx={{ m: 1, width: '100%' }}>
                                  <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
                                  <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={role}
                                    onChange={handleChangeSelect}
                                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                    renderValue={(selected) => (
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                        ))}
                                      </Box>
                                    )}
                                    MenuProps={MenuProps}
                                  >
                                    {names.map((name) => (
                                      <MenuItem
                                        key={name}
                                        value={name}
                                        style={getStyles(name, role, theme)}
                                      >
                                        {name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                    </Grid>

                    <Grid xs={4} >
                      <FormControl sx={{ m: 1, width: '100%' }}>
                        <FormLabel id="demo-row-radio-buttons-group-label">Account status</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel value="Active" control={<Radio />} label="Active" disabled checked />
                          <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" disabled />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                  </Grid>

                      <Box sx={{width: '100%',m:1}}>
                          <Stack direction="row-reverse"
                                spacing={2}>
                            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                            <Button variant="outlined" type="submit" >Update</Button>
                            
                          </Stack>
                      </Box>
                </Box>
            </TabPanel>
            <TabPanel value="7">
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid xs={12}>
                        <h3>Archive this profile</h3>
                      </Grid>
                      
                      <Grid xs={12} >
                           <Box sx={{bgcolor:'#fbdddd',color: '#ea5455',p: 2,spacing:2}} ><ReportGmailerrorredOutlinedIcon/><span>This action will archive the staff and you will not be able to see staff in the list and drop-downs. Also, the system will not send document expiry or any other alerts for this account. If you wish to access this staff profile, you can go to Archive section in the menu.</span></Box>       
                      </Grid>

                      
                        

                    </Grid>

                        <Box sx={{width: '100%',m:1}}>
                            <Stack direction="row-reverse"
                                  spacing={2}>
                              <Button variant="outlined" color="error"  type="button" onClick={()=>{Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `Account Has Been Archived`,
              showConfirmButton: false,
              timer: 1500,
            });}} >Archive</Button>
                              <Button variant="outlined" type="submit" onClick={() => setIsEditing(false)} >Cancel</Button>
                              
                            </Stack>
                        </Box>
                  </Box>
            </TabPanel>
          </TabContext>
        </Box>
      
    </div>
  );
};

export default Edit;