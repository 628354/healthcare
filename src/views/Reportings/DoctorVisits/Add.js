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

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR,GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'


const Add = ({setIsAdding,setShow }) => {

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [staff, setStaff] = useState('');
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])

  const [doctorName, setDoctorName] = useState('');
  const [healthPractitioner , setHealthPractitioner] = useState('')
  const [healthPractitionerLi , setHealthPractitionerLi] = useState([])

  const [reasonForVisit,setReasonForVisit]=useState('')
  const [doctorInstructions, setDoctorInstructions] = useState('');
  const [location,setLocation]=useState('')
  const [appointmentType,setAppointmentType]=useState('')
  const [staffId,setStaffId]=useState(null)

  const [nextAppointmentDate,setNextAppointmentDate]=useState('')

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
      fileList.push(files[i].originFileObj); 
    }
    setAttachment(fileList);
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


const healthData = async () => {
  let endpoint = 'getAll?table=admin_health_practitioner&select=health_practitioner_id,health_practitioner_name,';
  
  try {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      const res = await response.json();
      setHealthPractitionerLi(res.messages);
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Error fetching health data:', error);
  }
}

  useEffect(() => {
    healthData();
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
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    } if (!time) {
      emptyFields.push('Time');
    }
    if (!doctorName) {
      emptyFields.push('Doctor name');
    }

    if (!healthPractitioner) {
      emptyFields.push('Health practitioner ');
      
    } if (!reasonForVisit) {
      emptyFields.push('Reason for visit');
    }
    if (!doctorInstructions) {
      emptyFields.push('Doctor instructions');
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
    const nextDate = nextAppointmentDate ? nextAppointmentDate.format('YYYY-MM-DD') : null
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();
    formData.append('visit_staff', staffId);
    formData.append('visit_date', dateFormat);
    formData.append('visit_time', formattedTime);
    formData.append('visit_participant', participant);
    formData.append('visit_doctor_name', doctorName);
    formData.append('visit_health_practitioner', healthPractitioner);
    formData.append('visit_reason',reasonForVisit);
    formData.append('visit_doctor_instructions',doctorInstructions);
    formData.append('visit_location',location);
    formData.append('visit_appointment_type',appointmentType);
    formData.append('visit_nextdate', nextDate);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);


  
    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
  
  
    let endpoint = "insertReporting?table=fms_doctor_visit";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check",data)
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
        <h1>Create Doctor Visit</h1>
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
          value={doctorName}
            label="Doctor Name"
            type="text"
            onChange={(e)=>{setDoctorName(e.target.value)}}
          />


            <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='participant'>Health Practitioner</InputLabel>
          <Select
            labelId='Healthpractitioner'
            id='Healthpractitioner'
            value={healthPractitioner}
            label='Healthpractitioner'
            onChange={e => setHealthPractitioner(e.target.value)}
          >
            {
              healthPractitionerLi?.map((item)=>{
             
                return(
                  <MenuItem key={item?.health_practitioner_id} value={item?.health_practitioner_id}>{item?.health_practitioner_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
          
         
		<TextField
          value={reasonForVisit}
            multiline
            rows={4}
            label="Reason for visit"
            type="text"
            onChange={(e)=>{setReasonForVisit(e.target.value)}}
          />
          <TextField
          value={doctorInstructions}
            multiline
            rows={4}
            label="Doctor instructions"
            type="text"
            onChange={(e)=>{setDoctorInstructions(e.target.value)}}
          />
 <TextField
          value={location}
          
            label="Location"
            type="text"
            onChange={(e)=>{setLocation(e.target.value)}}
          />


           <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='appointmentType '>Appointment type</InputLabel>
          <Select labelId='appointmentType' id='appointmentType' value={appointmentType} label='Paid By' onChange={e => setAppointmentType(e.target.value)}>
          <MenuItem  value='In Person'>In Person</MenuItem>
          <MenuItem  value='Online'>Online</MenuItem>
          <MenuItem  value='Over Phone'>Over Phone</MenuItem>

          </Select>


        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Next appointment date" format='DD/MM/YYYY' onChange={(newValue) => {setNextAppointmentDate(newValue) }}  />
        </LocalizationProvider>

        
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