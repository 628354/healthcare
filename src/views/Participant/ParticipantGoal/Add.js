import React, {useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
//select field
import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import Swal from 'sweetalert2'
import { MenuItem } from '@mui/material'
import dayjs from 'dayjs'
import { BASE_URL, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

const Add = ({ setIsAdding,setShow }) => {
const oversee=localStorage.getItem('user')
const convert=JSON.parse(oversee)
const finalOversee=convert?.stf_firstname;

const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
const currentDate = new Date()

  const [participant, setParticipant] = useState('')
  const [participantList,setParticipantList]=useState([])
  const [goalTitle, setGoalTitile] = useState('')
  const [goalDescription, setGoalDescription] = useState('')
  const [achiveGoal, setAchiveGoal] = useState('')
  const [supportAchiveGoal, setSupportAchiveGoal] = useState('')
  const [comments, setComments] = useState('')
   const [startDate, setStartDate] = useState('')
   const [dueDate, setDueDate] = useState('')
   const [nextReviewDate, setNextReviewDate] = useState('')
  const [personOversee, setPersonOversee] = useState(finalOversee)
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')


  const minSelectableDate = dayjs(startDate).add(1, 'day');
  // console.log("Type of userRole:", typeof userRole);
  // console.log("Contents of userRole:", userRole);
  useEffect(() => {

    // if(show){
      setShow(true)
    return () => setShow(false)
  
    // }
    
  }, [setShow])
  
  const handleAdd = e => {
    e.preventDefault()

    if (!participant || !goalTitle || !goalDescription || !startDate || !type || !personOversee || !status ){
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      })
    }
    if (dueDate && startDate && dueDate.isBefore(startDate, 'day')) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'End date cannot be earlier than the start date.',
        showConfirmButton: true
      });
    }
    const formattedstartDate = dayjs(startDate).format('YYYY-MM-DD'); 
    const formatteddueDate = dayjs(dueDate).format('YYYY-MM-DD');
    const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');


    const data = {
      gol_prtcpntid:participant,
      gol_title: goalTitle,
      gol_desrptn: goalDescription,
      gol_achive: achiveGoal,
      gol_suport: supportAchiveGoal,
      gol_comment: comments,
      gol_strtdate: formattedstartDate,
      gol_duedate: formatteddueDate,
      gol_rvudate: formattedNextDate,
      gol_prsn: personOversee,
      gol_type: type,
      gol_status: status,
      created_at:currentTime,
      company_id:companyId

     

    }

    //function to generateToken

    // console.log(data);

    /* employees.push(newEmployee);
    localStorage.setItem('employees_data', JSON.stringify(employees));
    setEmployees(employees); 
    setIsAdding(false); */
    //let url = process.env.REACT_APP_BASE_URL;

    let endpoint = 'insertData?table=fms_goals'
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data)
    response.then(data => {
      // console.log(data)
      //return data;
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



  // get user role

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

  useEffect(()=>{
    getRole();
  },[])

  

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
        <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Create Participant Goal</h1>
        
        <Box sx={{width:"100%"}}>
        <div style={{ display: 'flex', gap: '10px' }}>
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
        <TextField
        
          required
          label='Goal Title'
          value={goalTitle}
          onChange={e => {
            setGoalTitile(e.target.value)
          }}
        />
          
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
        <TextField
          required
          label='Goal Description'
          multiline
          rows={4}
          value={goalDescription}
          onChange={e => {
            setGoalDescription(e.target.value)
          }}
        />
        
         <TextField
         
          required
          label='How will i achieve this goal?'
          multiline
          rows={4}
          value={achiveGoal}
          onChange={e => {
            setAchiveGoal(e.target.value)
          }}
        />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
        <TextField
          required
          label='What support will need to achieve this goal?'
          multiline
          rows={4}
          value={supportAchiveGoal}
          onChange={e => {
            setSupportAchiveGoal(e.target.value)
          }}
        />
      
        <TextField
           required
           label='Comments'
           multiline
           rows={4}
           value={comments}
           onChange={e => {
             setComments(e.target.value)
           }}
        />
        </div>
 
         
        <div style={{ display: 'flex', gap: '10px',width:"82%",marginTop:"14px"}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)}  onChange={(newValue)=>{setStartDate(newValue)}} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="End date"  format='DD/MM/YYYY'  minDate={dayjs(minSelectableDate)}  onChange={(newValue)=>{setDueDate(newValue)}} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Next review date"  format='DD/MM/YYYY'  minDate={dayjs(minSelectableDate)}  onChange={(newValue)=>{setNextReviewDate(newValue)}} />
          </LocalizationProvider>
       

        </div>

        <div style={{ display: 'flex', gap: '27px',marginLeft:"7px",marginTop:"14px" }}>
        <FormControl style={{ width: '32ch'}} required>
          <InputLabel id='personOversee'>Person overseeing</InputLabel>
          <Select
            labelId='personOversee'
            id='personOversee'
            value={personOversee}
            label='Person overseeing'
            onChange={e => setPersonOversee(e.target.value)}
          >
              <MenuItem   style={{ display: 'none' }} value={personOversee}>{personOversee}</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '32ch'}}required>
          <InputLabel id='setType'>Type</InputLabel>
          <Select
            labelId='type'
            id='type'
            value={type}
            label='Type'
            onChange={e => setType(e.target.value)}
          >  <MenuItem value="Short Term">Short Term</MenuItem>
          <MenuItem value="Medium Term">Medium Term</MenuItem>
          <MenuItem value="Long Term">Long Term</MenuItem>

          </Select>
        </FormControl>
        
        <FormControl style={{ width: '32ch'}} required>
  <InputLabel id='status'>Status</InputLabel>
  <Select
    labelId='status'
    id='is-authorised'
    value={status}
    label='status'
    onChange={e => setStatus(e.target.value)}
  >
    <MenuItem value="Draft">Draft</MenuItem>
    <MenuItem value="In Progress">In Progress</MenuItem>
    <MenuItem value="Achieved">Achieved</MenuItem>

  </Select>
</FormControl>



        </div>
       
        </Box>
        


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
