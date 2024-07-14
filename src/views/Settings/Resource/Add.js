import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import { Upload } from 'antd';
import CancelIcon from '@mui/icons-material/Cancel';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { BASE_URL, COMMON_ADD_FUN, companyId } from 'helper/ApiInfo'


const Add = ({setIsAdding}) => {
 
 
  const oversee=localStorage.getItem('user')
  const convert=JSON.parse(oversee)
  const finalStaff=convert?.stf_firstname;
   const staffId =convert?.stf_id
  const currentDate = new Date()
 
  // const finalStaffId=convert?.stf_id;
  const [date, setDate] = useState('');
  const[staff,setStaff]=useState(finalStaff)
  const [collectionTypes, setCollectionTypes] = useState([]);
  const [collectionTypesL, setCollectionTypesL] = useState([]);
  const [title, setTitle ] = useState('');
  const [type,setType] = useState('');
  const [text,setText] = useState('');
  const [link,setLink] = useState('');


  const [collectionTypesOpen, setCollectionTypesOpen] = useState(false);
  const [attachment, setAttachment] = useState('');


 const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
 const handleClose = () => {
  setCollectionTypesOpen(false); 

};
 //get all routes

 const fetchData = async () => {
  try {
    const url = `${BASE_URL}getAll?table=all_routes&select=routes_id,routes_name`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.status) {
      setCollectionTypesL(data.messages)

     
      }
  } catch (error) {
    console.error('Error fetching data:', error);
    
  }
};

const handleChange = info => {
  const fileList = [...info.fileList];
  console.log(fileList);
  if (fileList.length > 1) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'You can only upload one file.',
      showConfirmButton: true,
    });
  } else {
    setAttachment(fileList[0]?.originFileObj || null);

  }
};


useEffect(()=>{
  fetchData();
 
},[])
const handleAdd = e => {
  e.preventDefault();
  const emptyFields = [];

  if (!date) {
    emptyFields.push('Date');
  }
   if(!staff) {
    emptyFields.push('Staff');
  }
  if(collectionTypes.length<1) {
    emptyFields.push('Collection Type');
  }
   if(!title) {
    emptyFields.push('Title');
  }
  if(!type) {
    emptyFields.push('Type');
  }


  if (emptyFields.length > 0) {
    return Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
      showConfirmButton: true,
    });
  }

  const dateFormat = date ? date.format('YYYY-MM-DD') : null

  const formData = new FormData();
  formData.append('resource_staff_id',staffId);
  formData.append('resource_date',dateFormat);
  formData.append('resource_clltntype',collectionTypes);
  formData.append('resource_type',type);
  formData.append('resource_title',title);
  formData.append('resource_text',text);
  formData.append('resource_link',link);
  formData.append('created_at',currentTime);
  formData.append('company_id',companyId);
  formData.append('photo',attachment);


  let endpoint = "insertDataPost?table=fms_setting_resource";
  let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
  response.then((data) => {
 
    if (data.status) {
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: `data has been Added.`,
        showConfirmButton: false,
        timer: 1500,
      });
      setIsAdding(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'api error',
        showConfirmButton: true,
      });
    }
  });

};


const handleDelete = (value) => {
  // console.log(value);
  const updatedCollectionTypes = collectionTypes.filter((item) => item !== value);
  console.log("yes delete");
  setCollectionTypes(updatedCollectionTypes);
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
         <h1>Create Resource</h1>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} minDate={dayjs(currentDate)} />
        </LocalizationProvider>

      
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='staff'>Staff</InputLabel>
          <Select
            labelId='staff'
            id='staff'
            value={staff}
            label='Staff'
            onChange={e => setStaff(e.target.value)}
          >
              <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>



        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='CollectionTypes '>Collection Types </InputLabel>
          <Select
  labelId='CollectionTypes'
  id='CollectionTypes'
  value={collectionTypes}
  label='CollectionTypes'
  open={collectionTypesOpen}
  onOpen={() => setCollectionTypesOpen(true)}
  onClose={() => setCollectionTypesOpen(false)}
  multiple
  onChange={(e) => {
    setCollectionTypes(e.target.value);
    handleClose();
  }}
  renderValue={(selected) => (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {selected.map((value) => {
        // console.log(value);
        const selectedPractitioner = collectionTypesL.find(item => item?.routes_name === value);
        return (
          <Chip
            key={value}
            label={selectedPractitioner?.routes_name}
            deleteIcon={
              <CancelIcon
                onMouseDown={(event) => event.stopPropagation()}
              />
            }
            onDelete={(e) => handleDelete(value)}
            sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
          />
        );
      })}
    </div>
  )}
>
  {collectionTypesL?.map((item) => (
    <MenuItem key={item?.routes_id} value={item?.routes_name}>
      {item?.routes_name}
    </MenuItem>
  ))}
</Select>

        </FormControl>

        <TextField
          required
          label='Titile'
          value={title}
          onChange={e => {
            setTitle(e.target.value)
          }}
        />
     
     <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Type  '>Type </InputLabel>
          <Select
            labelId='Type '
            id='Type '
            value={type}
            label='Type '
            onChange={e => setType(e.target.value)}
          >
          
                  <MenuItem value='Text'>Text</MenuItem>
                  <MenuItem value='Link'>Link</MenuItem>
                  <MenuItem value='Attechment'>Attechment</MenuItem>


             
          </Select>
        </FormControl>


{
  type ==='Text'?  <TextField
  required
  label='Text'
  value={text}
  onChange={e => {
    setText(e.target.value)
  }}
/>:(type === "Link"?   <TextField
          required
          label='Link'  
          value={link}
          onChange={e => {
            setLink(e.target.value)
          }}
        />:(type === "Attechment"?  <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file"   listType="picture-card"  beforeUpload={() => false}  onChange={handleChange}  fileList={attachment ? [attachment] : []} >
       {attachment ? null : <Button size='small'>Click here or Drag and drop a file in this area</Button>}
      </Upload>:""))
}
       




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

