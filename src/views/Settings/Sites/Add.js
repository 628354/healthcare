import React, { useEffect, useState } from 'react';
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
import Chip from '@mui/material/Chip';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
 import '../../../style/document.css'
// import Switch from '@mui/material/Switch';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR,GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'


const Add = ({setIsAdding}) => {

  
  const currentDate = new Date()
 const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
 
  const [participant, setParticipant] = useState([]);
  const [participantList,setParticipantList]=useState([])
  const [participantOpen, setParticipantOpen] = useState(false);
console.log(participant.length);
 
 
const handleDelete = (value) => {
  const updatedParticipants = participant.filter(participantId => participantId !== value);
  setParticipant(updatedParticipants);
};

  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
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
  console.log(participant);
  const handleAdd = async e => {
    e.preventDefault();
  
    const emptyFields = [];
  
    if (!name) {
      emptyFields.push('name');
    }
    if(!location) {
      emptyFields.push('Location');
    }
    if(participant.length<1) {
      emptyFields.push('Participant');
    }
  
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required field: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
  
    const formData = new FormData();
    formData.append('site_name', name);
    formData.append('site_location', location);
    formData.append('site_Participants', participant);
    formData.append('created_at', currentTime);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);

    let endpoint = "insertDataPost?table=fms_setting_site";
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
  



  const [chipClicked, setChipClicked] = useState(false);

const handleClose = () => {
  if (!chipClicked) {
    setParticipantOpen(false); 
  }
  setChipClicked(false);
};

const handleChipClick = () => {
  setChipClicked(true); 
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
        <h1 className=''>Create Site</h1>

        
        <TextField
          value={name}
            label="Name"
            type="text"
          required
            onChange={(e)=>{setName(e.target.value)}}
            
          />
           <TextField
          value={location}
            label="Location"
            type="text"
         required
            onChange={(e)=>{setLocation(e.target.value)}}
          />


       
       
<FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
          required
            labelId='participant'
            id='participant'
            value={participant}
            label='Participant'
            open={participantOpen}
            onOpen={() => setParticipantOpen(true)} 
           onClose={handleClose} 
             multiple 
             onChange={(e) => {
               setParticipant(e.target.value);
               handleClose(); 
             }}
             renderValue={(selected) => (
               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                 {selected?.map((value) => 
                {
                 const selectedPractitioner = participantList.find(item => item?.prtcpnt_id === value);
                 // console.log(value);
                 return (
                   <Chip
                   key={value}
                   label={selectedPractitioner?.prtcpnt_firstname}
                   onDelete={() => { handleDelete(value); handleChipClick(); }}
                   sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
                 />
                 
                 )
                 })}
               </div>
             )}
          >
           {participantList?.filter(item => !participant.includes(item?.prtcpnt_id)).slice(0, 5).map((item) => {
      return (
        <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>
      );
    })}
          </Select>
        </FormControl>

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