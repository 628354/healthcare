import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { BASE_URL, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'

import Select from '@mui/material/Select'
import { Upload } from 'antd'
import '../../../style/document.css'

import Swal from 'sweetalert2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import AuthContext from 'views/Login/AuthContext'

const Edit = ({ selectData, setIsEditing,allowPre ,setShow}) => {

  const {companyId}=useContext(AuthContext)
  //console.log(selectData);
  const id = selectData.bld_id;
  const [date, setDate] = useState(selectData.bld_date? dayjs(selectData.bld_date): null);
  const [time, setTime] = useState(selectData.bld_time);
  const[staff,setStaff]=useState(selectData.bld_stfid)
  const [participant, setParticipant] = useState(selectData.bld_prtcntsid);
  const [participantList,setParticipantList]=useState([])
  const[staffList,setStaffList]=useState([])

  const [systolic, setSystolic] = useState(selectData.bld_systolic);
  const [diastolic , setDiastolic] = useState(selectData.bld_diastolic);
  const [pulse , setPulse] = useState(selectData.bld_pulse);
  const [comments, setComments] = useState(selectData.bld_cmnt);
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  
     useEffect(() => {
      if (selectData) {
        const updateData = selectData && selectData.updated_at
  
        if (updateData) {
          const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
          const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
          const formattedDate = `${day}-${month}-${year}`;
          const formattedTime = updateTime.substr(0, 5);
          const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
          setUpdateDate(final)
        }
        const createData = selectData.created_at
  
        if (createData) {
          const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
          const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
          const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
          const formattedCreateTime = createTime.substr(0, 5);
          const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
          setCreateDate(final)
        }
      }
    }, [selectData]);

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
      }
    }
    const getStaff = async () => {
      try {
        let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
        if(response.status) {  
          setStaffList(response.messages)
         
        } else {
          throw new Error('Network response was not ok.')
        }
      } catch (error) {
        console.error('Error fetching staff data:', error)
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
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    } if (!time) {
      emptyFields.push('Time');
    }
    if (!systolic) {
      emptyFields.push('Systolic');
    }
    if (!diastolic) {
      emptyFields.push('Diastolic');
      
    } if (!pulse) {
      emptyFields.push('Pulse');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;

    

    const formData = new FormData()
    formData.append('bld_date', dateFormat)
    formData.append('bld_time', formattedTime)
    formData.append('bld_stfid', staff)
    formData.append('bld_prtcntsid', participant)
    formData.append('bld_systolic', systolic)
    formData.append('bld_diastolic', diastolic)
    formData.append('bld_pulse', pulse)
    formData.append('bld_cmnt', comments)
    formData.append('updated_at', currentTime)

   




    let endpoint = 'updateAll?table=fms_bloodpres&field=bld_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
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
        <div className="small-container">

<Box
  component="form"
 
  sx={{
    '& .MuiTextField-root': { m: 1, width: '50ch' },
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
      label='Systolic (mm Hg)'
      value={systolic}
      onChange={e => {
        setSystolic(e.target.value)
      }}
    />
     <TextField
      value={diastolic}            
        label="Diastolic (mm Hg)"
        type="text"
        onChange={(e)=>{setDiastolic(e.target.value)}}
      />
       <TextField
       value={pulse}          
        label="Pulse (per minute)"
        type="text"
        onChange={(e)=>{setPulse(e.target.value)}}
        />

    <TextField
      value={comments}
        multiline
        rows={4}
        label="Comments"
        type="text"
        onChange={(e)=>{setComments(e.target.value)}}
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
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card></>

  )
}

export default Edit
