import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'

//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Swal from 'sweetalert2';

import Switch from '@mui/material/Switch';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// css import 
import '../../../style/document.css'
import { Upload } from 'antd';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo';
// import { UploadOutlined } from '@ant-design/icons';


const Add = ({ setIsAdding }) => {
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])

  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [attachment, setAttachment] = useState([]);
  // const [csvFile, setCSVFile] = useState(null);
  const [note, setNote] = useState('');
  const [hasExpiryDate, setHasExpiryDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  const [categoryList, setCategoryList] = useState([])
  const [typeList, setTypeList] = useState([])

  // const [role, setRole] = useState('');

  // const [status, setStatus] = useState('');


 
  // console.log(attachment);

  const currentDate = new Date();

  const handleAddRow = () => {

    setHasExpiryDate((prevValue) => !prevValue);


  }

  //
  const getParticipant = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }
  

  const getAdminstrationType = async () => {
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'getAll?table=document_categories&select=categorie_id,categorie_name,is_confidential,company_id';
    let response = await fetch(`${url}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setCategoryList(res.messages)
      // console.log(res);
    }

  }

  const getType = async () => {
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = `getWhereAll?table=fms_participant_doc_name&field=categorie_id&value=${category}`;


    let response = await fetch(`${url}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setTypeList(res.messages)
      console.log(res);
    }

  }

  useEffect(() => {
    getType()
  }, [category])

  useEffect(() => {
    getParticipant();
    getAdminstrationType()
  }, [])


  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj);
    }
    setAttachment(fileList);
  };




  const handleAdd = e => {
    e.preventDefault();
    const emptyFields = [];

    // Simple form validation
    if (!type) {
      emptyFields.push('Date');
    }
    if (!category) {
      emptyFields.push('Time');
    }
    if (!attachment) {
      emptyFields.push('Subject');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    //const id = employees.length + 1+1;
    // const fileName = attachment.split('\\').pop().split('/').pop();
    // const attachmentText = attachment.join(', ');
    const dateFormat = expiryDate ? expiryDate.format('YYYY-MM-DD') : null
    const formData = new FormData();
  formData.append('doc_prtcpntid', participant);
  formData.append('doc_ctgry_id', category);
  formData.append('doc_type_id', type);
  formData.append('doc_notes', note);
  formData.append('doc_exp', hasExpiryDate);
  formData.append('doc_expdate', dateFormat);
  formData.append('company_id',companyId);
  formData.append('created_at', currentTime);
  // Append files
  attachment.forEach((file, index) => {
    formData.append(`image[${index}]`, file);
  });


    /* employees.push(newEmployee);
    localStorage.setItem('employees_data', JSON.stringify(employees));
    setEmployees(employees); 
    setIsAdding(false); */
    //let url = process.env.REACT_APP_BASE_URL;
    let endpoint = "insertMedia?table=fms_prtcpnt_documts";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
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
        <h1>Add Document</h1>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
            labelId='participant'
            id='participant'
            value={participant}
            label='Participant'
            onChange={e => setParticipant(e.target.value)}
          >
            {
              participantList?.map((item) => {

                return (
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }}>
          <InputLabel id="select-four-label">Category</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={category}
            label="Status"
            onChange={(e) => { setCategory(e.target.value) }}
            required

          >
            {
              categoryList?.map((item) => {

                return (
                  <MenuItem key={item?.categorie_id} value={item?.categorie_id}>{item?.categorie_name}</MenuItem>

                )

              })
            }



          </Select>
        </FormControl>


        <FormControl sx={{ width: '50ch', m: 1 }}>
          <InputLabel id="select-four-label">Type</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={type}
            label="Status"
            onChange={(e) => { setType(e.target.value) }}


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

