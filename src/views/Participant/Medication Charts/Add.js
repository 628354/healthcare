import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Swal from 'sweetalert2';

import dayjs from 'dayjs'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// css import 
// import '../../../../style/document.css'
import { Upload } from 'antd';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST,  } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';
// import { useSelector } from 'react-redux';
// import { UploadOutlined } from '@ant-design/icons';


const Add = ({setIsAdding,setShow}) => {
  const {companyId} = useContext(AuthContext);

  const oversee=localStorage.getItem('user')
  const convert=JSON.parse(oversee)
  const finalStaff=convert?.stf_firstname;
  const currentDate = new Date()

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  
  const [date, setDate] = useState('');
  const[staff,setStaff]=useState(finalStaff)
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])

  const [levelOfSupport, setLevelOfSupport] = useState('');
  const [note, setNote] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('')
  const [attachment, setAttachment] = useState([]);
   
  
  useEffect(() => {

    // if(show){
      setShow(true)
    return () => setShow(false)
  
    // }
    
  }, [setShow])
  
// get user role
const minSelectableDate = new Date();

const getRole = async () => {
  try {
    let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant+companyId)
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

useEffect(()=>{
getRole();
},[])




const handleChange = (e) => {
  const files = e.fileList;
  //console.log(files);
  const fileList = [];
  for (let i = 0; i < files.length; i++) {
    fileList.push(files[i].originFileObj); // Push only the file objects
  }
  setAttachment(fileList);
};;



  const handleAdd = e => {
    e.preventDefault();
    const emptyFields = [];
   
    if (!date) {
      emptyFields.push('Date');
    }

    if (!levelOfSupport) {
      emptyFields.push('Subject');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Satff');
    }
    if (!note) {
      emptyFields.push('Notes');
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

 
  const checkStartDate = dayjs(`${date}` );
  const checkNextDate = dayjs(`${nextReviewDate}`);

  if(checkNextDate.isBefore(checkStartDate)){
    return Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: ' Next Review Date cannot be less than start date.',
      showConfirmButton: true
    });
  }
   

    const formattedDate = dayjs(date).format('YYYY-MM-DD'); 
const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');
  
    const formData = new FormData();
    formData.append('mdi_date', formattedDate);
    formData.append('mdi_stf', staff);
    formData.append('mdi_prtcpntsid', participant);
    formData.append('mdi_level', levelOfSupport);
    formData.append('mdi_note', note);
    formData.append('mdi_rvudate',formattedNextDate);
    formData.append('company_id',companyId);
    formData.append('created_at', currentTime);
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    
    let endpoint = 'insertMedia?table=fms_medicationchart';
    let response = COMMON_ADD_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
          // //console.log(data.status);
          // //console.log("check",data)
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(false);
          }else{
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
         <h1>Create Medication Chart</h1>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)} onChange={(newValue) => {setDate(newValue) }} />
        </LocalizationProvider>

         <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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
       
        <TextField
          required
          label='Level of support required *'
          value={levelOfSupport}
          onChange={e => {
            setLevelOfSupport(e.target.value)
          }}
        />
           <TextField
          value={note}
            multiline
            label="Notes"
            type="text"
            onChange={(e)=>{setNote(e.target.value)}}
          />

		
<LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Next review date" format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)}  onChange={(newValue)=>{setNextReviewDate(newValue)}} />
          </LocalizationProvider>

          <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
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

