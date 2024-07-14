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

import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'


const Add = ({setIsAdding,setShow }) => {

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [documentOn, setDocumentOn] = useState('')

  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])
  
  const [staff, setStaff] = useState('');
 

  const [progressNotes , setProgressNotes] = useState('');
  const [behaviourOfConcerns , setBehaviourOfConcerns] = useState('')
  const [diet, setDiet ] = useState('')

  const [fluids ,setFluids ]=useState('')
  const [activities , setActivities ] = useState('');
  const [chokingObservations,setChokingObservations]=useState('')
  const [appointments,setAppointment]=useState('')
  const [staffId,setStaffId]=useState(null)

  const [staffAdministered ,setStaffAdministered]=useState('')
  const [ndisGoal ,setNdisGoal]=useState('')

  const [independentS ,setIndependentS]=useState('')

  const [communityAccess ,setCommunityAccess]=useState('')


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



 
const getRole = async () => {
  try {
    let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant)
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
      emptyFields.push('Start Date');
    }
    if (!endDate) {
      emptyFields.push('End date');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    } if (!progressNotes) {
      emptyFields.push('Progress notes');
    }
    if (!behaviourOfConcerns) {
      emptyFields.push('Behaviour of concerns');
    }

    if (!diet) {
      emptyFields.push('Diet ');
      
    } if (!fluids) {
      emptyFields.push('Fluids');
    }
    if (!activities) {
      emptyFields.push('Activities');
    }
    if (!documentOn) {
      emptyFields.push('Documented on');
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
    const nextDate = endDate ? endDate.format('YYYY-MM-DD') : null
    const documentOnF = documentOn ? documentOn.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();
    formData.append('staff_id', staffId);
    formData.append('start_date', dateFormat);
    formData.append('end_date', nextDate);
    formData.append('participant_id', participant);
    formData.append('documented_on', documentOnF);
    formData.append('progress_notes', progressNotes);
    formData.append('behaviour_of_concerns',behaviourOfConcerns);
    formData.append('diet',diet);
    formData.append('fluids',fluids);
    formData.append('activities',activities);
    formData.append('choking_observations', chokingObservations);
    formData.append('appointments',appointments);
    formData.append('staff_administered', staffAdministered);
    formData.append('ndsi_goal_setting',ndisGoal);
    formData.append('independent_skills', independentS);
    formData.append('community_access', communityAccess);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);



  
    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
 
    let endpoint = "insertReporting?table=fms_progress_report";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check",data)
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
        <h1>Create Progress Report</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Start Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>
       
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='End Date'
            format='DD/MM/YYYY'
            minDate={dayjs(minSelectableDate)}
            onChange={newValue => {
              setEndDate(newValue)
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Document On'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDocumentOn(newValue)
            }}
          />
        </LocalizationProvider>
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
              participantList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
          <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>

      
        <TextField
          value={progressNotes}
          multiline
          rows={4}
            label="Progress Notes"
            type="text"
            onChange={(e)=>{setProgressNotes(e.target.value)}}
          />
          
         
		<TextField
          value={behaviourOfConcerns}
            multiline
            rows={4}
            label="Behaviour of concerns "
            type="text"
            onChange={(e)=>{setBehaviourOfConcerns(e.target.value)}}
          />
          <TextField
          value={diet}
            multiline
            rows={4}
            label="Diet"
            type="text"
            onChange={(e)=>{setDiet(e.target.value)}}
          />
           <TextField
          value={fluids}
            multiline
            rows={4}
            label="Fluids"
            type="text"
            onChange={(e)=>{setFluids(e.target.value)}}
          />
           <TextField
          value={activities}
            multiline
            rows={4}
            label="Activities"
            type="text"
            onChange={(e)=>{setActivities(e.target.value)}}
          />
           <TextField
          value={chokingObservations}
            multiline
            rows={4}
            label="Choking observations"
            type="text"
            onChange={(e)=>{setChokingObservations(e.target.value)}}
          />
           <TextField
          value={appointments}
            multiline
            rows={4}
            label="Appointments or Family visits"
            type="text"
            onChange={(e)=>{setAppointment(e.target.value)}}
          />
          <TextField
          value={staffAdministered}
            multiline
            rows={4}
            label="Staff administered medication"
            type="text"
            onChange={(e)=>{setStaffAdministered(e.target.value)}}
          />

<TextField
          value={ndisGoal}
            multiline
            rows={4}
            label="NDIS goal setting"
            type="text"
            onChange={(e)=>{setNdisGoal(e.target.value)}}
          />

<TextField
          value={independentS}
            multiline
            rows={4}
            label="Independent skills"
            type="text"
            onChange={(e)=>{setIndependentS(e.target.value)}}
          />

<TextField
          value={communityAccess}
            multiline
            rows={4}
            label="Community access"
            type="text"
            onChange={(e)=>{setCommunityAccess(e.target.value)}}
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