import React, {useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';



import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { BASE_URL, COMMON_NEW_ADD,  } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';

const Add = ({setIsAdding,setShow }) => {
  const {companyId} = useContext(AuthContext);

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  
  const [ndsiNumber, setNdsiNumber] = useState('');
  const archive=true
 

useEffect(() => {
  setShow(true)
  return () => setShow(false)
}, [setShow])


  const handleAdd = e => {
    e.preventDefault();
    

    if (!firstName || !lastName || !preferredName) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }
    
    

const fullName =`${firstName} ${lastName}`
    //const id = employees.length + 1+1;
    const data = {
      prtcpnt_firstname:firstName,
      prtcpnt_lastname:lastName,
      prtcpnt_prefd_name:preferredName,
      prtcpnt_srvndis:ndsiNumber,
      prtcpnt_archive:archive,
      company_id:companyId,
      created_at:currentTime,
      participant_fullname:fullName

     
    };

    
    let endpoint = 'insertData?table=fms_prtcpnt_details';
    let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
      response.then((data)=>{
          // //console.log(data);
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
            <h3 style={{fontSize:"1.285rem",fontWeight:"500",paddingLeft:"8px",}}>Create Participant Profile</h3>

          <TextField
            required
           type='text'
            
            label="First Name"
            onChange={(e)=>{setFirstName(e.target.value)}}
          />

          <TextField
            required
           type='text'
            
            label="Last Name"
            onChange={(e)=>{setLastName(e.target.value)}}
          />

          <TextField
            required
           type='text'
            
            label="Preferred name"
            onChange={(e)=>{setPreferredName(e.target.value)}}
          />

          <TextField
          
           type='text'
            label="NDIS number"
            onChange={(e)=>{setNdsiNumber(e.target.value)}}
          />
          


          


         
         

           

          
          
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