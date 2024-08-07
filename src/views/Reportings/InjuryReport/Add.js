import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { Upload } from 'antd';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST,  } from 'helper/ApiInfo'
import AuthContext from 'views/Login/AuthContext';



const Add = ({setIsAdding,setShow }) => {
  const {companyId} = useContext(AuthContext);

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [staff, setStaff] = useState('');
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])

  const [description, setDescription] = useState('');
 
  const [staffId,setStaffId]=useState(null)
  const [attachment, setAttachment] = useState([]);

  
  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  
  const handleChange = (e) => {
    const files = e.fileList;
    //console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setAttachment(fileList);
  };


  const getRole = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant+companyId)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }
 
  useEffect(() => {
   
    getRole();
  }, [])
  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname= convert?.stf_lastname
      const combine =`${finalStaff} ${lname}`
      const id=convert?.stf_id
      setStaff(combine)
      setStaffId(id)

    }
  }, [])

  const handleAdd = e => {
    e.preventDefault();

    const emptyFields = [];

   
    if (!date) {
      emptyFields.push('Date');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!time) {
      emptyFields.push('Time');
    }
    if (!description) {
      emptyFields.push('Description');
    }
    if (attachment.length<1) {
      emptyFields.push('Attachment');
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
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
   
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;

    const formData = new FormData();
    formData.append('staff_id', staffId);
    formData.append('injury_date', dateFormat);
    formData.append('injury_time', formattedTime);
    formData.append('participant_id', participant);
    formData.append('description', description);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);


  

    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
  
   
    let endpoint = "insertReporting?table=fms_injury_report";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      //console.log(data);
      //console.log("check",data)
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
        <h1>Create Injury Report</h1>
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
       
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="Time"
          onChange={(newValue) => {setTime(newValue) }}
         
        />
         </LocalizationProvider>
         <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
            labelId='participant'
            id='participant'
            value={participant}
            label='Participant'
            onChange={e => setParticipant(e.target.value)}
          >
            {
              participantList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
          <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>

      
        <TextField
          value={description}
            label="Description"
            multiline
            rows={5}
            type="text"
            onChange={(e)=>{setDescription(e.target.value)}}
          />

            <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple  listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>


          
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