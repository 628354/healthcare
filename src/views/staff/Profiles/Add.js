import React, { useContext, useEffect, useState } from 'react';
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
import { BASE_URL, COMMON_NEW_ADD } from 'helper/ApiInfo';
import dayjs from 'dayjs';
import AuthContext from 'views/Login/AuthContext';
import { useNavigate } from 'react-router';
import { FormHelperText } from '@mui/material';

const Add = ({setIsAdding,final,staffId})  => {
     
const {companyId}=useContext(AuthContext)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  
  const [role, setRole] = useState('');
  const [roleId, setRoleId] = useState();
  const [userRole, setUserRole] = useState([]);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();


  const [errors, setErrors] = useState({
    firstName: '',
    lastName:'',
    userName:'',
    phone: '',
    email: '',
    password: '',
    cpassword: '',
    role:''
  })

  const archive=true
console.log(errors);

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
      case 'confirmPassword':
        setErrors({ ...errors, cpassword: password === cpassword ? '' : 'Passwords do not match.' });
        break;
          case 'role':
        setErrors({ ...errors, role: role ? '' : 'Role is required.' });
        break;

      default:
        break;
    }
  };


  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!firstName) {
      newErrors.firstName = 'First Name is required.';
      isValid = false;
    } else {
      newErrors.firstName = '';
    }

    if (!lastName) {
      newErrors.lastName = 'Last Name is required.';
      isValid = false;
    } else {
      newErrors.lastName = '';
    }

    if (!userName) {
      newErrors.userName = 'Preferred Name is required.';
      isValid = false;
    } else {
      newErrors.userName = '';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    } else {
      newErrors.email = '';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one letter and one number.';
      isValid = false;
    } else {
      newErrors.password = '';
    }

    if (password !== cpassword) {
      newErrors.cpassword = 'Passwords do not match.';
      isValid = false;
    } else {
      newErrors.cpassword = '';
    }

    if (!role) {
      newErrors.role = 'Role is required.';
      isValid = false;
    } else {
      newErrors.role = '';
    }

    setErrors(newErrors);
    return isValid;
  };

  //console.log(role);
  const handleAdd = e => {
    e.preventDefault();
   
 if (!validateForm()) {
      return;
    }
    


    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const fullName =`${firstName} ${lastName}`

    const data = {
      stf_firstname:firstName,
      stf_lastname:lastName,
      stf_prfrdname:userName,
      stf_email:email,
      stf_pswrd:password,
      stf_status:status,
      stf_role:roleId,
 
      stf_archive:archive,  
      company_id:companyId,
      created_at:currentTime,
      staff_fullname:fullName

    };

    
    let endpoint = 'insertData?table=fms_staff_detail';
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
            setTimeout(() => {

              navigate('/staff/profiles')
    
            }, 1700)
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
    let endpoint = `getAll?table=fms_role_permissions&select=user_role,permission_id&company_id=${companyId}&fields=status&status=1`;
    let response =await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    const res = await response?.json()
  if(res.status){

    setUserRole(res.messages)
  }else{
    setUserRole([])
  }
  
  }

  useEffect(()=>{
    getRole();
  },[])

  const getId =(id)=>{
    setRoleId(id);
  }
 
  const goBack = () => {
    navigate(-1)
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
            onBlur={() => validateForm()}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />

          <TextField
            required
            
            label="Last Name"
            onChange={(e)=>{setLastName(e.target.value)}}
            onBlur={() => validateForm()}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />

          <TextField
            required
            
            label="Preferred name"
            onChange={(e)=>{setUserName(e.target.value)}}
            onBlur={() => validateForm()}

            error={!!errors.userName}
            helperText={errors.userName}
          />

          <TextField
            required
            type="email"
            label="Email"
            onChange={(e)=>{setEmail(e.target.value)}}
            onFocus={() => handleFocus('email')}
            onBlur={() => validateForm()}
            error={!!errors.email}
            helperText={errors.email}
          />
          
          {/* select Field */}

          <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="select-four-label">Role</InputLabel>
            <Select
              labelId="select-four-label"
              id="select-four-label"
              value={role}
            label="role"
              onChange={(e)=>{setRole(e.target.value)}}
              required 
              onBlur={() => validateForm()}
              error={!!errors?.role}
              helperText={errors?.role}

            >
              {
                 userRole && userRole.length > 0 && userRole?.map((role)=>{
// //console.log(role);
                  return(
                  <MenuItem key={role.permission_id} value={role.user_role} onClick={()=>getId(role.permission_id)}>
                    {role.user_role}
                  </MenuItem>)
                })
              }
              
            </Select>
            <FormHelperText>{errors?.role}</FormHelperText>
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
              <MenuItem value={0}>Active</MenuItem>
              <MenuItem value={1}>Inactive</MenuItem>
            </Select>
          </FormControl>


          <TextField
            required
            
            label="Password"
            type="password"
            onChange={(e)=>{setPassword(e.target.value)}}
            onFocus={() => handleFocus('password')}
            onBlur={() => validateForm()}
            error={!!errors.password}
            helperText={errors.password}
          />

          <TextField
            required
            
            label="Confirm Password"
            type="password"
            onChange={(e)=>{setCpassword(e.target.value)}}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={() => validateForm()}
            error={!!errors.cpassword}
            helperText={errors.cpassword}
          />

           

          
          
          <Box sx={{width: '100ch',m:1}}>
              <Stack direction="row-reverse"
                    spacing={2}>
                <Button variant="outlined" color="error" onClick={goBack} type="button">Cancel</Button>
                <Button variant="outlined" type="submit" >Submit</Button>
                
              </Stack>
          </Box>
      </Box>
    </div>
  );
};


export default Add;