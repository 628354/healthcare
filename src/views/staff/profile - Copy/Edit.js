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
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Swal from 'sweetalert2';

const Edit = ({ selectedEmployee, setIsEditing }) => {
  const id = selectedEmployee.stf_id;

  const [firstName, setFirstName] = useState(selectedEmployee.stf_firstname);
  const [lastName, setLastName] = useState(selectedEmployee.stf_lastname);
  const [email, setEmail] = useState(selectedEmployee.stf_email);
  const [userName, setUserName] = useState(selectedEmployee.stf_prfrdname);
  const [password, setPassword] = useState(selectedEmployee.stf_pswrd);
  const [dob, setDob] = useState(selectedEmployee.stf_dob);
  const [gender, setGender] = useState(selectedEmployee.stf_gender);
  const [personalContact, setPersonalContact] = useState(selectedEmployee.stf_prsnlcntctno);
  const [workContact, setWorkContact] = useState(selectedEmployee.stf_workcntctno);
  const [address, setAddress] = useState(selectedEmployee.stf_address);
  const [guardianName, setGuardianName] = useState(selectedEmployee.stf_emgname);
  const [guardianNumber, setGuardianNumber] = useState(selectedEmployee.stf_emgctcno);
  const [jobTitle, setJobTitle] = useState(selectedEmployee.stf_empljobtitle);
  const [startDate, setStartDate] = useState(selectedEmployee.stf_strtdate);
  const [endDate, setEndDate] = useState(selectedEmployee.stf_enddate);
  const [primaryManager, setPrimaryManager] = useState(selectedEmployee.stf_pmrymngr);
  const [accessCode, setAccessCode] = useState(selectedEmployee.stf_acccode);
  const [payLevel, setPayLevel] = useState(selectedEmployee.stf_paylvl);
  const [profileState, setProfileState] = useState(selectedEmployee.stf_prfilstats);
  const [role, setRole] = useState(selectedEmployee.stf_role);
  const [accountStatus, setAccountStatus] = useState(selectedEmployee.stf_accstatus);
  const [archive, setArchive] = useState(selectedEmployee.stf_archive);
  const [status, setStatus] = useState(selectedEmployee.stf_status);

  const handleUpdate = e => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !userName || !password || !gender || !dob || !personalContact || !workContact || !address || !guardianName || !guardianNumber || !jobTitle || !startDate || !endDate || !primaryManager || !accessCode || !payLevel || !profileState || !role || !accountStatus || !archive || !status) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

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
      
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id='+id;
    let response = update(url,endpoint,data);
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
            setIsEditing(false);
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

    async function update(url,endpoint,data){
          // //console.log(data);
          // //console.log('console from function');
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
        onSubmit={handleUpdate}
      >
        <h1>Edit Employee</h1>
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

          <TextField
            required
            defaultValue={password}
            label="Password"
            type="password"
            onChange={(e)=>{setPassword(e.target.value)}}
          />

           {/* date picker field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Date Of Birth" defaultValue={dayjs(dob)} onChange={(newValue)=>{setDob(newValue)}} />
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
            defaultValue={personalContact}
            onChange={(e)=>{setPersonalContact(e.target.value)}}
            
          />


          <TextField
            required
            label="Work Contact"
            type="number"
            defaultValue={workContact}
            onChange={(e)=>{setWorkContact(e.target.value)}}
          />

          <TextField
            required
            label="Address"
            defaultValue={address}
            onChange={(e)=>{setAddress(e.target.value)}}
          />

          <TextField
            required
            label="Guardian Name"
            defaultValue={guardianName}
            onChange={(e)=>{setGuardianName(e.target.value)}}
          />

          <TextField
            required
            label="Guardian Number"
            type="number"
            defaultValue={guardianNumber}
            onChange={(e)=>{setGuardianNumber(e.target.value)}}
          />

          <TextField
            required
            label="Job Title"
            defaultValue={jobTitle}
            onChange={(e)=>{setJobTitle(e.target.value)}}
          />

          {/* date picker field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start Date"  defaultValue={dayjs(startDate)} onChange={(newValue)=>{setStartDate(newValue)}} />
          </LocalizationProvider>



          {/* date picker field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="End Date"  defaultValue={dayjs(endDate)} onChange={(newValue)=>{setEndDate(newValue)}} />
          </LocalizationProvider>

          <TextField
            required
            label="Primary Manager"
            defaultValue={primaryManager}
            onChange={(e)=>{setPrimaryManager(e.target.value)}}
          />

          <TextField
            required
            label="Access Code"
            defaultValue={accessCode}
            onChange={(e)=>{setAccessCode(e.target.value)}}
          />

          <TextField
            required
            label="Pay Level"
            defaultValue={payLevel}
            onChange={(e)=>{setPayLevel(e.target.value)}}
          />

          <TextField
            required
            label="Profile State"
            defaultValue={profileState}
            onChange={(e)=>{setProfileState(e.target.value)}}
          />

          <TextField
            required
            label="Role"
            defaultValue={role}
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
              <MenuItem value={2}>Inactive</MenuItem>
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
              <MenuItem value={2}>Inactive</MenuItem>
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
              <MenuItem value={2}>Inactive</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"
                    spacing={2}>
                <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Update</Button>
                
              </Stack>
          </Box>
      </Box>
    </div>
  );
};

export default Edit;