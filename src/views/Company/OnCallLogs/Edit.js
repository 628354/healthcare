import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Card, CardContent,Typography } from '@mui/material'  

import Select from '@mui/material/Select'
import '../../../style/document.css'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { BASE_URL, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'

const Edit = ({ selectCallLog, setIsEditing,allowPre ,setShow}) => {
  const id = selectCallLog.call_id;
  const [date, setDate] = useState(selectCallLog.call_date? dayjs(selectCallLog.call_date): null);
  const [time, setTime] = useState(selectCallLog.call_tme);
  const[staff,setStaff]=useState(selectCallLog.call_stfid)
  const [participant, setParticipant] = useState(selectCallLog.call_prtcpntsid);
  const [participantList,setParticipantList]=useState([])
  const[staffList,setStaffList]=useState([])

  const [communicationWith, setCommunicationWith] = useState(selectCallLog.call_with);
  const [description, setDescription] = useState(selectCallLog.call_dscrptn)
  const [duration, setDuration ] = useState(selectCallLog.call_duration);
  const [actions, setActions] = useState(selectCallLog.call_action)
  const [ followUp, setFollowUp] = useState(selectCallLog.call_follwup)
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');


  
useEffect(() => {
  if (selectCallLog) {
    const updateData = selectCallLog && selectCallLog.updated_at

    if (updateData) {
      const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
      const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = updateTime.substr(0, 5);
      const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
      setUpdateDate(final)
    }
    const createData = selectCallLog.created_at

    if (createData) {
      const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
      const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
      const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
      const formattedCreateTime = createTime.substr(0, 5);
      const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
      setCreateDate(final)
    }
  }
}, [selectCallLog]);
 const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching Participant data:', error)
    }
  }
  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setStaffList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching Participant data:', error)
    }
  }
  
  useEffect(()=>{
    getStaff();
    getRole();
  },[])

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])
 
  const handleUpdate = e => {
    e.preventDefault()

    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
    if (!time) {
      emptyFields.push('Time');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!communicationWith) {
      emptyFields.push('Communication with');
    }
    if (!duration) {
      emptyFields.push('Duration');
    }
    if (!description) {
      emptyFields.push('Description ');
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

    const formattedTime = time ? dayjs(time).format('HH:mm') : null;

    

    const formData = new FormData()
    formData.append('call_date', dateFormat)
    formData.append('call_tme', formattedTime)
    formData.append('call_stfid', staff)
    formData.append('call_prtcpntsid', participant)
    formData.append('call_dscrptn', description)
    formData.append('call_duration', duration)
    formData.append('call_action', communicationWith)
    formData.append('call_with', communicationWith)
    formData.append('call_follwup', followUp)
    formData.append('updated_at', currentTime);

    let endpoint = 'updateAll?table=fms_call_log&field=call_id&id=' + id
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, formData)
    response.then(data => {
      // console.log(data,"hbhjjk");
      //return data;
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
        <div className="small-container">

<Box
  component="form"
 
  sx={{
    '& .MuiTextField-root': { m: 1, width: '50ch' },
    //bgcolor:'#FFFFFF'
  }}
  noValidate
  autoComplete="off"
  onSubmit={handleUpdate}
>
   <h1>Edit Communication Log</h1>

   <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker label="Date" value={dayjs(date)} format="DD/MM/YYYY" onChange={(newValue) => {setDate(newValue) }} />
  </LocalizationProvider>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label="Time"
      value={dayjs(time, 'HH:mm')}
      onChange={(newValue) => {setTime(newValue) }}
     
    />
     </LocalizationProvider>

     <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
      <InputLabel id='Staff'>Staff</InputLabel>
      <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
        {staffList?.map(item => {
          return (
            <MenuItem key={item?.stf_id} value={item?.stf_id}>
              {item?.stf_firstname} {item?.stf_lastname}
            </MenuItem>
          )
        })}
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
      label='Duration'
      value={duration}
      onChange={e => {
        setDuration(e.target.value)
      }}
    />
    <TextField
      value={communicationWith}
        multiline
    
        label="Communication with "
        type="text"
        onChange={(e)=>{setCommunicationWith(e.target.value)}}
      />
       <TextField
      value={description}
      rows={5}
        multiline
        label="Description"
        type="text"
        onChange={(e)=>{setDescription(e.target.value)}}
      />
         <TextField
      value={actions}
        multiline
        rows={5}
        label="Actions"
        type="text"
        onChange={(e)=>{setActions(e.target.value)}}
      />

<TextField
      value={followUp}
        multiline
        rows={5}
        label="Followup"
        type="text"
        onChange={(e)=>{setFollowUp(e.target.value)}}
      />

    
    <Box sx={{width: '100ch',m:1}}>
        <Stack direction="row-reverse"
              spacing={2}>
          <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
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
