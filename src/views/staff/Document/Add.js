import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST} from 'helper/ApiInfo'
import Swal from 'sweetalert2';

import Switch from '@mui/material/Switch';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import '../../../style/document.css'
import { Upload } from 'antd';
import AuthContext from 'views/Login/AuthContext';
import { useNavigate } from 'react-router';
import { FormHelperText } from '@mui/material';


const Add = () => {

const {companyId} = useContext(AuthContext)
const [staff, setStaff] = useState('');
  const [staffList, setstaffList] = useState([])

  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [note, setNote] = useState('');
  const [hasExpiryDate, setHasExpiryDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  const [categoryList, setCategoryList] = useState([])
  const [typeList, setTypeList] = useState([])
const navigate =useNavigate()

const [errors, setErrors] = useState({
  category: '',
  staff: '',
  type: '',
  attachment: '',
});


  const currentDate = new Date();
// //console.log(currentDate);

  const handleAddRow = () => {

    setHasExpiryDate((prevValue) => !prevValue);


  }

  //
  const getStaff = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setstaffList(response.messages)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }

  }
  const getAdminstrationType = async () => {
    let endpoint = `getAll?table=staff_doc_categories&select=categorie_id,categorie_name,company_id&company_id=${companyId}&fields=status&status=1,`;
  
    try {
      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
  //console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const res = await response.json();
  
      if(res.status){
        setCategoryList(res.messages);
      }else{
        setCategoryList([]);

      }
   
    } catch (error) {
    
      console.error('Error fetching data:', error);
     
      setCategoryList([]);
    }
  };
  

  const getType = async () => {
    try {
      let endpoint = `getWhereAll?table=fms_staff_doc_name&field=categorie_id&value=${category}`;
  
      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const res = await response.json();
        setTypeList(res.messages);
        // //console.log(res);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    
    }
  };
  

  useEffect(() => {
    getType()
  }, [category])

  useEffect(() => {
    getStaff();
    getAdminstrationType()
  }, [])


  const handleChange = (e) => {
    const files = e.fileList;
    //console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setAttachment(fileList);
  };
  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname= convert?.stf_lastname
      const combine =`${finalStaff} ${lname}`
      const id=convert?.stf_id
      setStaff(id)

    }
  }, [])


  const handleAdd = e => {
    e.preventDefault();
    let formErrors = {
      category: '',
      staff: '',
      type: '',
      attachment: '',
    };

  let hasError = false;

  if (!category) {
    formErrors.category = 'Category is required.';
    hasError = true;
  }
  if (!staff) {
    formErrors.staff = 'Staff is required.';
    hasError = true;
  }
  if (!type) {
    formErrors.type = 'Type is required.';
    hasError = true;
  }
  // if (attachment.length == 0) {
  //   formErrors.attachment = 'At least one attachment is required.';
  //   hasError = true;
  // }

  if (hasError) {
    setErrors(formErrors);
    return;
  }
  setErrors({
    category: '',
    staff: '',
    type: '',
    attachment: '',
  });
 

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const dateFormat = expiryDate ? expiryDate.format('YYYY-MM-DD') : null
    const formData = new FormData();
  formData.append('dcmt_stfid', staff);
  formData.append('dcmt_ctgry_id', category);
  formData.append('dcmt_type_id', type);
  formData.append('dcmt_note', note);
  formData.append('dcmt_expdatestatus', hasExpiryDate);
  formData.append('dcmt_expdate', dateFormat);
  formData.append('company_id', companyId);
    formData.append('created_at', currentTime);
  // Append files
  attachment.forEach((file, index) => {
    formData.append(`image[${index}]`, file);
  });

    let endpoint = "insertStaffMedia?table=fms_stf_document";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint,formData);
    response.then((data) => {
      //console.log("check",formData) 

      //console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          
          navigate('/staff/sleep-disturbances')
  
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

  const goBack=()=>{
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
        <h1>Add Document</h1>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='staff'>Staff</InputLabel>
          <Select
  labelId='staff'
  id='staff'
  value={staff}
  label='staff'
  onChange={(e) => {
    setStaff(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, staff: '' }));
    }
  }}
>
  {
    staffList?.map((item) => (
      <MenuItem key={item?.stf_id} value={item?.stf_id}>
        {item?.stf_firstname} {item?.stf_lastname}
      </MenuItem>
    ))
  }
</Select>
{errors.staff && <FormHelperText error>{errors.staff}</FormHelperText>}
        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id="select-four-label">Category</InputLabel>
          <Select
  labelId="select-four-label"
  id="select-four-label"
  value={category}
  label="Category"
  onChange={(e) => { setCategory(e.target.value) 
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, category: '' }));
    }
  }}
  required
>
  {
    categoryList?.map((item) => (
      <MenuItem key={item?.categorie_id} value={item?.categorie_id}>
        {item?.categorie_name}
      </MenuItem>
    ))
  }
</Select>
{errors.category && <FormHelperText error>{errors.category}</FormHelperText>}
        </FormControl>


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id="select-four-label">Type</InputLabel>
          <Select
  labelId="select-four-label"
  id="select-four-label"
  value={type}
  label="Type"
  onChange={(e) => {
    setType(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, type: '' }));
    }
  }}
>
  {
    Array.isArray(typeList) && typeList.length > 0 ? (
      typeList.map((item) => (
        <MenuItem key={item?.category_document_id} value={item?.category_document_id}>
          {item?.category_document_name}
        </MenuItem>
      ))
    ) : (
      <MenuItem value="">No types available</MenuItem>
    )
  }
</Select>
{errors.type && <FormHelperText error>{errors.type}</FormHelperText>}
        </FormControl>
        <TextField

          multiline
          label="Notes"
          type="text"
          onChange={(e) => { setNote(e.target.value) }}
        />


        <br></br>
        <Switch label="Expiry date" onClick={handleAddRow} />

  

        {
          hasExpiryDate ? (
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Expiry date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)}  onChange={(newValue) => { setExpiryDate(newValue) }} />
              </LocalizationProvider>
            </div>
          ) : null
        }



        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple  listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>
        {errors.type && <FormHelperText error>{errors.attachment}</FormHelperText>}


        <Box sx={{ width: '100ch', m: 1 }}>
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

