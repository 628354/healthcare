import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import { BASE_URL, COMMON_NEW_ADD, companyId } from 'helper/ApiInfo';

const Add = ({setIsAdding,final,staffId})  => {
     

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  
  const [role, setRole] = useState('');
  const [roleId, setRoleId] = useState();
  const [userRole, setUserRole] = useState();
  const [status, setStatus] = useState('');
  const archive=true
  // const userId =localStorage.getItem("user");

  // console.log("Type of userRole:", typeof userRole);
  // console.log("Contents of userRole:", userRole);
  const handleAdd = e => {
    e.preventDefault();
    const generateToken=()=>{
      const char ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let token ='';
      for(let i=0;i<=char.length;i++){
        token+=char.charAt(Math.floor(Math.random() * char.length))
      }
      return token
    }

    if (!firstName || !lastName || !email || !userName || !password ||!status || !cpassword) {
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
    

    const token =generateToken();
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const data = {
      stf_firstname:firstName,
      stf_lastname:lastName,
      stf_prfrdname:userName,
      stf_email:email,
      stf_pswrd:password,
      stf_status:status,
      stf_role:roleId,
      token: token,
      stf_archive:archive,  
       company_id:companyId,
      created_at:currentTime,
    };

    
    let endpoint = 'insertData?table=fms_staff_detail';
    let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
      response.then((data)=>{
          // console.log(data);
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

  
 


  // get user role

  const getRole= async()=>{
    let endpoint = 'getAll?table=fms_role_permissions&select=user_role,permission_id';

    let response =await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setUserRole(res.messages)
// console.log(res);
    }
  
  }

  useEffect(()=>{
    getRole();
  },[])

  const getId =(id)=>{
    setRoleId(id);
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
            
            label="Preferred name"
            onChange={(e)=>{setUserName(e.target.value)}}
          />

          <TextField
            required
            type="email"
            label="Email"
            onChange={(e)=>{setEmail(e.target.value)}}
          />
          
          {/* select Field */}

          <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="select-four-label">Role</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={role}
              label="Status"
              onChange={(e)=>{setRole(e.target.value)}}
              required 

            >
              {
                userRole?.map((role)=>{
// console.log(role);
                  return(
                  <MenuItem key={role.permission_id} value={role.user_role} onClick={()=>getId(role.permission_id)}>
                    {role.user_role}
                  </MenuItem>)
                })
              }
              
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


          <TextField
            required
            
            label="Password"
            type="password"
            onChange={(e)=>{setPassword(e.target.value)}}
          />

          <TextField
            required
            
            label="Confirm Password"
            type="password"
            onChange={(e)=>{setCpassword(e.target.value)}}
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