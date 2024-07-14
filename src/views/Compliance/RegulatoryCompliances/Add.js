import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Upload } from 'antd';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';



const Add = ({ setIsAdding, setShow }) => {
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [documentBy, setDocumentBy] = useState('');
  const [documentId, setDocumentID] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  const [notes, setNotes] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('')

  const [attachment, setAttachment] = useState([]);
  const minSelectableDate = dayjs(date).add(1, 'day');

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setAttachment(fileList);
  };



  const getCategory = async () => {
    try {
      let endpoint = 'getAll?table=reg_comp_catgry&select=comp_catgry_name,comp_catgry_id'

      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const res = await response.json()
        setCategoryList(res.messages)
        console.log(res)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  useEffect(() => {

    getCategory();
  }, []);


  useEffect(() => {
    const documentBy = localStorage.getItem('user')

    if (documentBy) {
      const convert = JSON.parse(documentBy)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      setDocumentBy(combine)
      setDocumentID(id)

    }
  }, [])
  const handleAdd = e => {
    e.preventDefault();
 const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!documentBy) {
      emptyFields.push('Documented By');
    }
    if (!title) {
      emptyFields.push('Title');
    }
    if (!category) {
      emptyFields.push('Category');
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
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const nextReviewDateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData();
    formData.append('rc_date', dateFormat);
    formData.append('rc_stfid', documentId);
    formData.append('rc_title', title);
    formData.append('rc_ctgry', category);
    formData.append('rc_note', notes);
    formData.append('rc_rvudate', nextReviewDateFormat);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);

    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

  
    let endpoint = "insertCompliance?table=fms_regulatory_compliance";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check", data)
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
        <h1>Create Regulatory Compliance</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='documentBy'>Document By</InputLabel>
          <Select labelId='documentBy' id='Staff' value={documentBy} label='documentBy' onChange={e => setDocumentBy(e.target.value)}>
            <MenuItem style={{ display: 'none' }} value={documentBy}>{documentBy}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          required

          value={title}
          label="Title"
          type="text"
          onChange={(e) => { setTitle(e.target.value) }}
        />

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='category'>Category</InputLabel>
          <Select labelId='category' id='category' value={category} label='category' onChange={e => setCategory(e.target.value)}>
            {categoryList?.map(item => {
              return (
                <MenuItem key={item?.comp_catgry_id} value={item?.comp_catgry_id}>
                  {item?.comp_catgry_name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <TextField
          value={notes}
          multiline
          rows={4}
          label="Notes"
          type="text"
          onChange={(e) => { setNotes(e.target.value) }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next review date'
            format='DD/MM/YYYY'
            minDate={dayjs(minSelectableDate)}
            onChange={newValue => {
              setNextReviewDate(newValue)
            }}
          />
        </LocalizationProvider>
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