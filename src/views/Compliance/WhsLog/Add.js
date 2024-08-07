import React, { useContext, useEffect, useState } from 'react';
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
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN} from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';



const Add = ({ setIsAdding, setShow }) => {
  const {companyId} = useContext(AuthContext)


  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [location, setLocation] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('')
  const [comments, setComments] = useState('');

  const [attachment, setAttachment] = useState([]);
  const minSelectableDate = dayjs(date).add(1, 'day');



  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const handleChange = (e) => {
    const files = e.fileList;
    //console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); // Push only the file objects
    }
    setAttachment(fileList);
  };

  const getCategory = async () => {
    try {
      let endpoint = 'getAll?table=whs_log_ctgry&select=whs_log_id,whs_log_name'

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
        //console.log(res)
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

  const handleAdd = e => {
    e.preventDefault();

    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!category) {
      emptyFields.push('Category');
    }
    if (!location) {
      emptyFields.push('Location');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const nextReviewDateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData();
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    formData.append('whs_date', dateFormat);
    formData.append('whs_ctgry', category);
    formData.append('whs_location', location);
    formData.append('whs_rvudate', nextReviewDateFormat);
    formData.append('whs_comnt', comments);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);

    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

   
    let endpoint = "insertCompliance?table=fms_whs_logs";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      //console.log(data);
      //console.log("check", data)
      //console.log(data);
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
        <h1>Create WHS Log</h1>
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

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='category'>Category</InputLabel>
          <Select labelId='category' id='category' value={category} label='category' onChange={e => setCategory(e.target.value)}>
            {categoryList?.map(item => {
              return (
                <MenuItem key={item?.whs_log_id} value={item?.whs_log_id}>
                  {item?.whs_log_name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <TextField
          required

          value={location}
          label="Location"
          type="text"
          onChange={(e) => { setLocation(e.target.value) }}
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



        <TextField
          value={comments}
          multiline
          rows={4}
          label="Comments"
          type="text"
          onChange={(e) => { setComments(e.target.value) }}
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