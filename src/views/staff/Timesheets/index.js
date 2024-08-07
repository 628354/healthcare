import React, { useState } from 'react';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
/* import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; */
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import Swal from 'sweetalert2';

const Add = ({setIsAdding }) => {
  const [Staff, setstaff] = useState('');
  const [Fortnightly, setfortnightly] = useState('');
  const [status, setStatus] = useState('');
  const handleAdd = e => {
    e.preventDefault();

    if (!Staff || !Fortnightly ||!status) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }
    if(password != cpassword){
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Password And Confirm Password Does Not Match!.',
        showConfirmButton: true,
      });
    }

    //const id = employees.length + 1+1;
    const data = {
      stf_Staff:Staff,
      stf_Fortnightly:Fortnightly,
      stf_status:status,
    };
    // //console.log(data);

    /* employees.push(newEmployee);
    localStorage.setItem('employees_data', JSON.stringify(employees));
    setEmployees(employees); 
    setIsAdding(false); */
    //let url = process.env.REACT_APP_BASE_URL;
    
    let url="https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'insertData?table=fms_staff_detail';
    let response = add(url,endpoint,data);
      response.then((data)=>{
          // //console.log(data.status);
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
        onSubmit={handleAdd}
      >
        <h1>Timesheets</h1>
          

          

          

         
          
          {/* select Field */}

          <FormControl sx={{width: '25ch',m:1}}>
            <InputLabel id="select-four-label">Staff</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={Staff}
              label="Staff"
              onChange={(e)=>{setstaff(e.target.value)}}
              required 
            >
               <MenuItem value={1}>hth</MenuItem>
              <MenuItem value={0}>gfhfth</MenuItem>
              <MenuItem value={1}>gfhggfh</MenuItem>
              <MenuItem value={0}>gfh</MenuItem>
              <MenuItem value={1}>gff</MenuItem>
              <MenuItem value={0}>hghhg</MenuItem>
            </Select>
          </FormControl>
      
          {/* select Field */}

          <FormControl sx={{width: '25ch',m:1}}>
            <InputLabel id="select-four-label">Status</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={status}
              label="Status"
              onChange={(e)=>{setStatus(e.target.value)}}
            >
              <MenuItem value={1}>Pending</MenuItem>
              <MenuItem value={0}>Approved</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{width: '25ch',m:1}}>
            <InputLabel id="select-four-label">FortNightly</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={Fortnightly}
              label="FortNightly"
              onChange={(e)=>{setfortnightly(e.target.value)}}
            >
              <MenuItem value={1}>Weekly</MenuItem>
              <MenuItem value={0}>Fortnightly</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{width: '25ch',m:1}}>
            <InputLabel id="select-four-label">Status</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={status}
              label="Status"
              onChange={(e)=>{setStatus(e.target.value)}}
            >
              <MenuItem value={1}>Pending</MenuItem>
              <MenuItem value={0}>Approved</MenuItem>
            </Select>
          </FormControl>
        

        
      </Box>
    </div>
  );
};


export default Add;