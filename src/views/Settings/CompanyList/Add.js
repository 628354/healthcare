import React, { useContext, useEffect, useState } from 'react';
import '../../../style/document.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_NEW_ADD } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';
import { useNavigate } from 'react-router';

const Add = () => {
  const navigate = useNavigate();
  const { allowUser } = useContext(AuthContext);
  const allowPre = allowUser.find((data) => {
    if (data.user === "Company") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read };
    }
  });

  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [timezone, setTimezone] = useState('');
  const [ndis, setNdis] = useState('');
  const [abn, setAbn] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {companyId } = useContext(AuthContext)

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

  const handleAdd = (e) => {
    e.preventDefault();
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

    const data = {
      company_name: companyName,
      phone: phone,
      address: address,
      website: website,
      email: email,
      password: password,
      timezone: timezone,
      registration_number: ndis,
      abn: abn,
      role: userRole
    };

    let endpoint = 'insertComapnyData?table=fms_company';
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data);
    response.then((data) => {
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `Data has been added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          navigate('/settings/companyList');
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong.',
          showConfirmButton: true,
        });
      }
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  const getRole = async () => {
    let endpoint = `getAll?table=fms_role_permissions&select=user_role,permission_id&company_id=${companyId}&fields=status&status=1`;
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const res = await response.json();
      const CompanyAdminRole = res?.messages?.filter(item => item.user_role === "Company Admin");
      if (CompanyAdminRole.length > 0) {
        setUserRole(CompanyAdminRole[0]?.permission_id);
      }
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <div className='small-container'>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleAdd}
      >
        <TextField
          required
          value={companyName}
          label='Company Name'
          onChange={e => setCompanyName(e.target.value)}
          onBlur={() => handleBlur('companyName')}
          error={!!errors.companyName}
          helperText={errors.companyName}
        />

        <TextField
          required
          value={phone}
          label='Phone'
          type='number'
          onChange={e => setPhone(e.target.value)}
          onFocus={() => handleFocus('phone')}
          onBlur={() => handleBlur('phone')}
          error={!!errors.phone}
          helperText={errors.phone}
        />

     
        <TextField
          required
          value={website}
          label='Website'
          onChange={e => setWebsite(e.target.value)}
          onFocus={() => handleFocus('website')}
          onBlur={() => handleBlur('website')}
          error={!!errors.website}
          helperText={errors.website}
        />

        <TextField
          required
          value={email}
          label='Email'
          onChange={e => setEmail(e.target.value)}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          required
          label="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
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
          onChange={e => setAddress(e.target.value)}
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
            onChange={e => setTimezone(e.target.value)}
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
          onChange={e => setNdis(e.target.value)}
          onBlur={() => handleBlur('ndis')}
          error={!!errors.ndis}
          helperText={errors.ndis}
        />

        <TextField
          required
          value={abn}
          label='ABN'
          onChange={e => setAbn(e.target.value)}
          onBlur={() => handleBlur('abn')}
          error={!!errors.abn}
          helperText={errors.abn}
        />

        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={goBack} type="button">Cancel</Button>
            <Button variant="outlined" type="submit">Submit</Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Add;
