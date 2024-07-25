import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { Upload } from 'antd';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, companyId } from 'helper/ApiInfo';



const Add = ({ setIsAdding, setShow }) => {


  const [name, setName] = useState('');
  const [version, setVersion] = useState('')
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('')

  const [attachment, setAttachment] = useState([]);


  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

 
  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); // Push only the file objects
    }
    setAttachment(fileList);
  };



  const handleAdd = e => {

    e.preventDefault();
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const emptyFields = [];
   
    if (!name) {
      emptyFields.push('name');
    }

    if (!version) {
      emptyFields.push('version');
    }
    if (!category) {
      emptyFields.push('Category');
    }
    if (!type) {
      emptyFields.push('type');
    }
    if (!attachment) {
      emptyFields.push('Attechment');
    }
   
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const formData = new FormData();
    formData.append('form_name', name);
    formData.append('form_version', version);
    formData.append('form_ctgry', category);
    formData.append('form_type', type);
    formData.append('from_note', notes);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);


    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    
    let endpoint = "insertCompany?table=fms_form";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check", data)
      //return data;
      console.log(data);
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
        <h1>Create Form</h1>
        <TextField
          value={name}
          label="Name"
          type="text"
          onChange={(e) => { setName(e.target.value) }}
        />

        <TextField
          value={version}

          label="Version "
          type="text"
          onChange={(e) => { setVersion(e.target.value) }}
        />


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='category '>Category</InputLabel>
          <Select labelId='category' id='category' value={category} label='Category' onChange={e => setCategory(e.target.value)}>
            <MenuItem value='General'>General</MenuItem>
            <MenuItem value='Participant'>Participant</MenuItem>
            <MenuItem value='Staff'>Staff</MenuItem>


          </Select>
        </FormControl>

        <TextField
          value={type}
          label="Type"
          type="text"
          onChange={(e) => { setType(e.target.value) }}
        />

        <TextField
          value={notes}
          multiline
          rows={4}
          label="notes"
          type="text"
          onChange={(e) => { setNotes(e.target.value) }}
        />

        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



        <Box sx={{ width: '100ch', m: 1 }}>
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