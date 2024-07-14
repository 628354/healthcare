import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { Upload,  } from "antd";



import Swal from 'sweetalert2';

const Edit = ({setIsEditing,selectedEmployees }) => {
  const id = selectedEmployees.ctc_id;
  const [type, setType] = useState(selectedEmployees.ctc_type);
  const [contactName, setContactName] = useState(selectedEmployees.ctc_name);
  const [address, setAddress] = useState(selectedEmployees.ctc_address);
  const [contactUserEmail, setContactUserEmail] = useState(selectedEmployees.ctc_email);
  const [contactUserPhone, setContactUserPhone] = useState(selectedEmployees.ctc_phone);
    
      const handleUpdate = e => {
        // alert('working from two'); 
        e.preventDefault();
    
        if  ( !type ||!contactName) {
          return Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'All fields are required.',
            showConfirmButton: true,
          });
        } 
    
      
        const formData = new FormData();
       
          
        formData.append('ctc_type',type);
        formData.append('ctc_name',contactName);
        formData.append('ctc_address',address);
        formData.append('ctc_email',contactUserEmail);
        formData.append('ctc_phone',contactUserPhone);
          
        let url = "https://tactytechnology.com/mycarepoint/api/";
        let endpoint = `updateAll?table=fms_prtcpnt_contactdetails&field=ctc_id&id=${id}`;
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
  
      async function update(url,endpoint,formData){
        //console.log(data);
        // console.log('console from function');
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
    <Box sx={{ flexGrow: 1, m: 1 }} component="form" onSubmit={handleUpdate}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <h3>Contact Details</h3>
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            required
            label="Type"
            type="text"
            defaultValue={type}
            onChange={(e) => { setType(e.target.value) }}
          
          />
        </Grid>
       
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            required
            label="Name"
            type="text"
            defaultValue={contactName}
            onChange={(e) => {setContactName(e.target.value) }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            defaultValue={address}
            label="Address"
            onChange={(e) => {setAddress(e.target.value) }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            defaultValue={contactUserEmail}
            label="Email"
            type='email'
            onChange={(e) => {setContactUserEmail(e.target.value) }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            label="Number"
            type="number"
            defaultValue={contactUserPhone}
            onChange={(e) => { setContactUserPhone(e.target.value) }}
          />
           
        </Grid>
        
      </Grid>

      
      <Box sx={{ width: '100ch', m: 1 }}>
        <Stack direction="row-reverse" spacing={2}>
          <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
          <Button variant="outlined" type="submit">Update</Button>
        </Stack>
      </Box>
    </Box>
  </div>
      );
};


export default Edit;
















