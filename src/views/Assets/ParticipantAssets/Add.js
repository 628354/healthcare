import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { Upload } from 'antd';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import {COMMON_ADD_FUN,BASE_URL,GET_PARTICIPANT_LIST,COMMON_GET_PAR} from '../../../helper/ApiInfo'
import { useNavigate } from 'react-router';
import AuthContext from 'views/Login/AuthContext';
import { FormHelperText } from '@mui/material';


// import Switch from '@mui/material/Switch';


const Add = () => {
  const {companyId } = useContext(AuthContext)

  const navigate =useNavigate()
  const currentDate = new Date()
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const [date, setDate] = useState('')
  const [staff, setStaff] = useState('');
  // const [staffList, setStaffList] = useState([])

  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])
  const [asset, setAsset] = useState('');
  const [location, setLocation] = useState('');

  const [description, setDescription] = useState('')
  const [staffId, setStaffId] = useState(null)
  const [attachment, setAttachment] = useState([]);


  const [errors ,setErrors]=useState()
 
  
  const handleChange = (e) => {
    const files = e.fileList;
    // //console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setAttachment(fileList);
  };


  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant+companyId)
      if (response.status) {  
        setParticipantList(response.messages)
      }
    } catch (error) {
      console.error("Error fetching role:", error);
    }
  }
  

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {

    getRole();
  }, [])
  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      setStaff(combine)
      setStaffId(id)

    }
  }, [])

  const handleAdd = e => {
    e.preventDefault();
    let hasError = false;
    const newErrors = {};

   
    if (!date) {
      newErrors.date = 'Date is required';
      hasError = true;
    }
    if (!staff) {
      newErrors.staff = 'Satff is required';
      hasError = true;
    }
    if (!participant) {
      newErrors.participant = 'Participant is required';
      hasError = true;
    }
    if (!asset) {
      newErrors.asset = 'Asset is required';
      hasError = true;
    }
    if (!location) {
      newErrors.location = 'Location is required';
      hasError = true;
    }
    setErrors(newErrors);

    if (hasError) {
      return;
    }
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData();
    formData.append('prasets_stfid', staffId);
    formData.append('prasets_date', dateFormat);
    formData.append('prasets_prtcpntid', participant);
    formData.append('prasets_name', asset);
    formData.append('prasets_locatn', location);
    formData.append('prasets_dscrptn', description);
    formData.append('created_at', currentTime);
    formData.append('company_id', companyId);


    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });


    let endpoint = "insertAssets?table=fms_prtcpntassets";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      //console.log(data);
      //console.log("check", data)
      //return data;
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

          navigate('/assets/participant-assets')

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
        <h1>Create Participant Asset</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            rewuired
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
              if (newValue) {
                setErrors((prevErrors) => ({ ...prevErrors, date: '' }));
              }
            }}
            slotProps={{
              textField: {
                helperText: errors?.date,
               
              },
            }}
          />
        </LocalizationProvider>


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff'  onChange={(e) => {
            setStaff(e.target.value);
            if (e.target.value) {
              setErrors((prevErrors) => ({ ...prevErrors, staff: '' }));
            }
          }} error={!!errors?.staff}
                    helperText={errors?.staff}>
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
          <FormHelperText>{errors?.staff}</FormHelperText>

        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
            labelId='participant'
            id='participant'
            value={participant}
            label='Participant'
            onChange={(e) => {
              setParticipant(e.target.value);
              if (e.target.value) {
                setErrors((prevErrors) => ({ ...prevErrors, participant: '' }));
              }
            }} error={!!errors?.participant}
                      helperText={errors?.participant}>
          
            {
              participantList?.map((item) => {

                return (
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
          <FormHelperText>{errors?.participant}</FormHelperText>

        </FormControl>
        <TextField
          required
          value={asset}
          label="Assets"
          type="text"
          onChange={(e)=>{setAsset(e.target.value);if (e.target.value){
            setErrors((prevErrors) => ({ ...prevErrors, asset: '' }));
          }
        }}

          helperText={errors? errors?.asset: ""}
          error={!!errors?.asset}
        />
        <TextField
          value={location}
          multiline
          label="Location"
          type="text"
          onChange={(e) => { setLocation(e.target.value) }}
        />
        <TextField
          value={description}
          multiline
          rows={4}
          label="Description"
          type="text"
          onChange={(e) => { setDescription(e.target.value) }}
        />
        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



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