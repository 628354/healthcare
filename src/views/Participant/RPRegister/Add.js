import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Swal from 'sweetalert2'
import { MenuItem } from '@mui/material'
import { BASE_URL, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

const Add = ({ setIsAdding,participantId,setShow,b  }) => {
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [restrictivePractice, setRestrictivePractice] = useState('')
  const [restrictivePracticeList, setRestrictivePracticeList] = useState([])
  const [administrationType, setAdministrationType] = useState('')
  const [participant, setParticipant] = useState(participantId?participantId:'');
  const [participantList,setParticipantList]=useState([])
  const [isAuthorised, setIsAuthorised] = useState('')
  const [description, setDescription] = useState('')
  const [behaviorOfConcerns, setBehaviorOfConcerns] = useState('')
  const [reportingFrequency, setReportingFrequency] = useState('')
  const [nextReviewDate, setNextReviewDate] = useState('')
  const currentDate = new Date()


  const minSelectableDate = dayjs(startDate).add(1, 'day');
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');


  useEffect(() => {

    if(!participantId){
      setShow(true)
    return () => setShow(false)
  
    }
    
  }, [setShow])
  
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
  const getRestrictive = async()=>{
  let endpoint = 'getAll?table=admin_restrictive_practice&select=admin_res_prac_id,res_prac_name';
  
    let response =await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setRestrictivePracticeList(res.messages)
  // console.log(res);
    }
  
  }
  
  useEffect(()=>{
  getRole();
  getRestrictive()
  },[])

  const handleAdd = e => {
    e.preventDefault()
    const emptyFields = [];
   
    if (!startDate) {
      emptyFields.push('Start Date');
    }

    if (!startTime) {
      emptyFields.push('Start Time');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!restrictivePractice) {
      emptyFields.push('Type of Restrictive Practice otes');
    }
    if (!isAuthorised) {
      emptyFields.push('Is authorised');
    }
    if (!description) {
      emptyFields.push('Description');
    }
    if (!behaviorOfConcerns) {
      emptyFields.push('Behaviour of concerns');
    }
    if (!reportingFrequency) {
      emptyFields.push('Reporting frequency');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }



    const checkStartDate = dayjs(`${startDate}` );
    const checkEndDate = dayjs(`${endDate}`);
    const checkNextDate = dayjs(`${nextReviewDate}`);
    if (checkEndDate.isBefore(checkStartDate)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'End date  cannot be less than start date.',
        showConfirmButton: true
      });
    }else if(checkNextDate.isBefore(checkStartDate)){
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: ' Next Review Date cannot be less than start date.',
        showConfirmButton: true
      });
    }
 
    const formattedDate = dayjs(startDate).format('YYYY-MM-DD'); 
    const formattedEnd = dayjs(endDate).format('YYYY-MM-DD'); 
    const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD'); 
    const formattedTime = dayjs(startTime).format('HH:mm');
    const formattedEndTime = dayjs(endTime).format('HH:mm');

   


    const data = {
      rpreg_strtdate:formattedDate,
      rpreg_strttime:formattedTime,
      rpreg_endtime:formattedEndTime,
      rpreg_enddate:formattedEnd,
      rpreg_rsttype:restrictivePractice,
      rpreg_admtyp:administrationType,
      rpreg_dscrptn:description,
      rpreg_auth:isAuthorised,
      rpreg_prtcpntid:participant,
      rpreg_bhvrcncrn:behaviorOfConcerns,
      rpreg_freq:reportingFrequency,
      rpreg_rvwdate:formattedNextDate,
      created_at:currentTime,
      company_id:companyId
    }
    let endpoint = 'insertData?table=fms_prtcpnt_rpregistration'
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data)
    response.then(data => {
 
     
       if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',  
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500
        })
        setIsAdding(false)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    })
  }



  return (
    <div className='small-container'>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleAdd}
      >
        <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Create a record</h1>

        <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '50ch', marginBottom: '15px' }}>
          <DatePicker label="Start date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)}  value={startDate} onChange={(newValue) => { setStartDate(newValue) }} />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker

            label="Start Time"
            onChange={(newValue) => { setStartTime(newValue) }}

          />
        </LocalizationProvider>
 
  <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '50ch', marginBottom: '15px' }}>
          <DatePicker label="End date" format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)}  onChange={(newValue) => { setEndDate(newValue) }} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker

            label="End Time"
            onChange={(newValue) => { setEndTime(newValue) }}

          />
        </LocalizationProvider>

        
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='restrictive-practice-label'>Type of Restrictive Practice</InputLabel>
          <Select
            labelId='restrictive-practice-label'
            id='restrictive-practice'
            value={restrictivePractice}
            label='Type of Restrictive Practice'
            onChange={e => setRestrictivePractice(e.target.value)}
          >
           {
              restrictivePracticeList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.admin_res_prac_id} value={item?.admin_res_prac_id}>{item?.res_prac_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>


        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='administration-type'>Administration type</InputLabel>
          <Select
            labelId='administration-type'
            id='administration-type'
            value={administrationType}
            label='Administration type'
            onChange={e => setAdministrationType(e.target.value)}
          >  <MenuItem value="PRN">PRN</MenuItem>
            <MenuItem value="Routine">Routine</MenuItem>
            <MenuItem value="Other">Other</MenuItem>

          </Select>
        </FormControl>
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
          <InputLabel id='isAuthorised'>Is authorised?</InputLabel>
          <Select
            labelId='isAuthorised'
            id='is-authorised'
            value={isAuthorised}
            label='Is Authorised ?'
            onChange={e => setIsAuthorised(e.target.value)}
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>


        <TextField
          required
          label='Description'
          multiline
          rows={4}
          value={description}
          onChange={e => {
            setDescription(e.target.value)
          }}
        />
        <TextField
          required
          label='Behavior Of Concerns'
          multiline
          rows={4}
          value={behaviorOfConcerns}
          onChange={e => {
            setBehaviorOfConcerns(e.target.value)
          }}
        />
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='restrictive-practice-label'>Reporting frequency</InputLabel>
          <Select
            labelId='reporting-frequency'
            id='reporting-frequency'
            value={reportingFrequency}
            label='Type of Restrictive Practice'
            onChange={e => setReportingFrequency(e.target.value)}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="One Off">One Off</MenuItem>
            <MenuItem value="Every Five Day">Every Five Day</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Other">Other</MenuItem>


          </Select>
        </FormControl>

      
        <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '50ch', marginBottom: '15px' }}>
          <DatePicker required label='Next review date' minDate={dayjs(minSelectableDate)}  format='DD/MM/YYYY' type='date' onChange={(newValue) => { setNextReviewDate(newValue) }} />
        </LocalizationProvider>


        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction='row-reverse' spacing={2}>
            <Button variant='outlined' color='error' onClick={() => setIsAdding(false)} type='button'>
              Cancel
            </Button>
            <Button variant='outlined' type='submit'>
              Submit
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  )
}

export default Add
