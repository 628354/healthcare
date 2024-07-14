import React, { useState } from 'react';
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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Swal from 'sweetalert2';

const Add = ({setIsAdding }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [personalContact, setPersonalContact] = useState('');
  const [workContact, setWorkContact] = useState('');
  const [address, setAddress] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianNumber, setGuardianNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [primaryManager, setPrimaryManager] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [payLevel, setPayLevel] = useState('');
  const [profileState, setProfileState] = useState('');
  const [role, setRole] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [archive, setArchive] = useState('');
  const [status, setStatus] = useState('');
  

  const handleAdd = e => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !userName || !password || !gender || !dob || !personalContact || !workContact || !address || !guardianName || !guardianNumber || !jobTitle || !startDate || !endDate || !primaryManager || !accessCode || !payLevel || !profileState || !role || !accountStatus || !archive || !status) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    //const id = employees.length + 1+1;
    const data = {
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
    };
    // console.log(data);

    /* employees.push(newEmployee);
    localStorage.setItem('employees_data', JSON.stringify(employees));
    setEmployees(employees); 
    setIsAdding(false); */
    //let url = process.env.REACT_APP_BASE_URL;
    
    let url="https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'insertData?table=fms_staff_detail';
    let response = add(url,endpoint,data);
      response.then((data)=>{
          // console.log(data.status);
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `${firstName} ${lastName}'s data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(false);
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

  
  async function add(url,endpoint,data){
        // console.log(data);
        // console.log('console from function');
       const response =  await fetch( url+endpoint,{
                                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors",
                                    headers: {
                                      "Content-Type": "application/json",
                                      //'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                                  }); 
        return response.json();
  }  
 
  return (
    <div className="small-container">

      <Box
        component="form"
       
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
        <h1>Add Employee</h1>
          <TextField
            required
            
            label="First Name"
            onChange={(e)=>{setFirstName(e.target.value)}}
          />

          <TextField
            required
            
            label="Last Name"
            onChange={(e)=>{setLastName(e.target.value)}}
          />

          <TextField
            required
            
            label="User Name"
            onChange={(e)=>{setUserName(e.target.value)}}
          />

          <TextField
            required
            
            label="Email"
            onChange={(e)=>{setEmail(e.target.value)}}
          />

          <TextField
            required
            
            label="Password"
            type="password"
            onChange={(e)=>{setPassword(e.target.value)}}
          />

           {/* date picker field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date Of Birth" onChange={(newValue)=>{setDob(newValue)}} />
          </LocalizationProvider>

          <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="select-one-label">Gender</InputLabel>
            <Select
              labelId="select-one-label"
              id="select-one-label"
              value={gender}
              label="Gender"
              onChange={(e)=>{setGender(e.target.value)}}
            >
              <MenuItem value={1}>Male</MenuItem>
              <MenuItem value={2}>female</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            required
            label="Personal Contact"
            type="number"
            onChange={(e)=>{setPersonalContact(e.target.value)}}
            
          />


          <TextField
            required
            label="Work Contact"
            type="number"
            onChange={(e)=>{setWorkContact(e.target.value)}}
          />

          <TextField
            required
            label="Address"
            onChange={(e)=>{setAddress(e.target.value)}}
          />

          <TextField
            required
            label="Guardian Name"
            onChange={(e)=>{setGuardianName(e.target.value)}}
          />

          <TextField
            required
            label="Guardian Number"
            type="number"
            onChange={(e)=>{setGuardianNumber(e.target.value)}}
          />

          <TextField
            required
            label="Job Title"
            onChange={(e)=>{setJobTitle(e.target.value)}}
          />

          {/* date picker field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start Date" onChange={(newValue)=>{setStartDate(newValue)}} />
          </LocalizationProvider>



          {/* date picker field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="End Date" onChange={(newValue)=>{setEndDate(newValue)}} />
          </LocalizationProvider>

          <TextField
            required
            label="Primary Manager"
            onChange={(e)=>{setPrimaryManager(e.target.value)}}
          />

          <TextField
            required
            label="Access Code"
            onChange={(e)=>{setAccessCode(e.target.value)}}
          />

          <TextField
            required
            label="Pay Level"
            onChange={(e)=>{setPayLevel(e.target.value)}}
          />

          <TextField
            required
            label="Profile State"
            onChange={(e)=>{setProfileState(e.target.value)}}
          />

          <TextField
            required
            label="Role"
            onChange={(e)=>{setRole(e.target.value)}}
          />

          {/* setect field */}
          <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="select-two-label">Account Status</InputLabel>
            <Select
              labelId="select-two-label"
              id="select-two-label"
              value={accountStatus}
              label="Account Status"
              onChange={(e)=>{setAccountStatus(e.target.value)}}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>

          {/* select Field */}

          <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="select-three-label">Archive</InputLabel>
            <Select
              labelId="select-three-label"
              id="select-three-label"
              value={archive}
              label="Archive"
              onChange={(e)=>{setArchive(e.target.value)}}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>


          {/* select Field */}

          <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="select-four-label">Status</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={status}
              label="Status"
              onChange={(e)=>{setStatus(e.target.value)}}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"
                    spacing={2}>
                <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Submit</Button>
                
              </Stack>
          </Box>
      </Box>
    </div>
  );
};


export default Add;