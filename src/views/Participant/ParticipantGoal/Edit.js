import React, { useState,useEffect } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
// import { Upload } from 'antd'
// import Switch from '@mui/material/Switch'
import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { Card, CardContent,Typography } from '@mui/material'
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'

const Edit = ({selectedGoal, setIsEditing,allowPre,setShow  }) => {
  const id = selectedGoal.gol_id;
  
  const [participant, setParticipant] = useState(selectedGoal.gol_prtcpntid)
  const [participantList,setParticipantList]=useState([])
  const [goalTitle, setGoalTitile] = useState(selectedGoal.gol_title)
  const [goalDescription, setGoalDescription] = useState(selectedGoal.gol_desrptn)
  const [achiveGoal, setAchiveGoal] = useState(selectedGoal.gol_achive)
  const [supportAchiveGoal, setSupportAchiveGoal] = useState(selectedGoal.gol_suport)
  const [comments, setComments] = useState(selectedGoal.gol_comment)
   const [startDate, setStartDate] = useState(selectedGoal.gol_strtdate? dayjs(selectedGoal.gol_strtdate): null)
   const [dueDate, setDueDate] = useState(selectedGoal.gol_duedate ? dayjs(selectedGoal.gol_duedate): null)
   const [nextReviewDate, setNextReviewDate] = useState(selectedGoal.gol_rvudate === '0000-00-00' ? '':selectedGoal.gol_rvudate )
  const [personOversee, setPersonOversee] = useState(selectedGoal.gol_prsn)
  const [type, setType] = useState(selectedGoal.gol_type)
  const [status, setStatus] = useState(selectedGoal.gol_status)
  const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)
const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const minSelectableDate = dayjs(startDate).add(1, 'day');


  useEffect(() => {

    // if(show){
      setShow(true)
    return () => setShow(false)
  
    // }
    
  }, [setShow])
  useEffect(() => {
    if (selectedGoal) {
      const updateData = selectedGoal && selectedGoal.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedGoal.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedGoal]);

   // get user role

   const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
        console.log(response.messages);
       
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
const handleUpdate = e => {
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
    const startDateFormat = startDate ? startDate.format('YYYY-MM-DD') : null
    
    const dueDateFormat = dueDate ? dueDate.format('YYYY-MM-DD') : null
    const nextReviewDateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null
    const finalNextReviewDate = nextReviewDate ? nextReviewDateFormat : null;
    console.log(nextReviewDate);
    const formData = new FormData()
    
    formData.append('gol_prtcpntid',participant)
    formData.append('gol_title',goalTitle)
    formData.append('gol_desrptn',goalDescription)
    formData.append('gol_achive',achiveGoal)
    formData.append('gol_suport',supportAchiveGoal)
    formData.append('gol_comment',comments)
    formData.append('gol_strtdate',startDateFormat)
    formData.append('gol_duedate',dueDateFormat)
    formData.append('gol_rvudate',finalNextReviewDate)
    formData.append('gol_prsn',personOversee)
    formData.append('gol_status',status)
    formData.append('gol_type',type)
    formData.append('updated_at',currentTime)
  
  
    let endpoint = `updateAll?table=fms_goals&field=gol_id&id=${id}`;
    let response = COMMON_UPDATE_FUN(BASE_URL,endpoint, formData)
    response.then(data => {
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
         setIsEditing(false)
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
    <>
        <div className='small-container'>
      <Box
        component='form'
        sx={{

          '& .MuiTextField-root': { m: 1, width: '50ch' }
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleUpdate}
      >
        <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Edit Participant Goal</h1>
        
        <Box sx={{width:"100%"}}>
        <div style={{ display: 'flex', gap: '10px' }}>
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
            labelId='participant'
            id='participant'
          value={participant || ''}
            label='Participant'
            onChange={e => setParticipant(e.target.value)}
          >
            {
              participantList?.map((item)=>{
             console.log(item);
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
               
            <DatePicker  value={dayjs(startDate)} format="DD/MM/YYYY"  label="Start date" onChange={(newValue)=>{setStartDate(newValue)}} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
  
            <DatePicker  value={dayjs(dueDate)} label="End date"  minDate={dayjs(minSelectableDate)} format="DD/MM/YYYY" onChange={(newValue)=>{setDueDate(newValue)}} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker  value={dayjs(nextReviewDate)} label="Next review date" minDate={dayjs(minSelectableDate)} format="DD/MM/YYYY" onChange={(newValue)=>{setNextReviewDate(newValue)}} />
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
            <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
              Cancel
            </Button>
            {
                
                allowPre?.edit?<Button variant="outlined" type="submit" >Update</Button>:""
                }
          </Stack>
        </Box>
      </Box>
    </div>
    
  <Card className='update_card' >
        <CardContent className='updateChild' >
          <div className="uppercase">
            <Typography variant="h5"> <span> {createDate} </span> {updateDate ? <span> || {updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
      </>

  )
}

export default Edit
