import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
// import '../../../../style/document.css'
import TextField from '@mui/material/TextField'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import Select from '@mui/material/Select'
import { Upload } from 'antd'
import '../../../style/document.css'

import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

import { BASE_URL, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'

const Edit = ({ selectData, setIsEditing,allowPre ,setShow}) => {
  const id = selectData.bwl_id;
  const [date, setDate] = useState(selectData.bwl_date? dayjs(selectData.bwl_date): null);
  const [time, setTime] = useState(selectData.bwl_time);
  const[staff,setStaff]=useState(selectData.bwl_stfid)
  const [participant, setParticipant] = useState(selectData.bwl_prtcpntid);
  const [participantList,setParticipantList]=useState([])
  const[staffList,setStaffList]=useState([])
  const [status , setStatus ] = useState(selectData.bwl_status);
  const [type, setType] = useState(selectData.bwl_type);
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
    const getStaff = async () => {
      try {
        let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
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
    if (!status) {
      emptyFields.push('Status');
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

    
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData()
    formData.append('bwl_date', dateFormat)
    formData.append('bwl_time', formattedTime)
    formData.append('bwl_stfid', staff)
    formData.append('bwl_prtcpntid', participant)
    formData.append('bwl_status', status)
    formData.append('bwl_type', type)
    formData.append('updated_at', currentTime)


    let endpoint = 'updateAll?table=fms_bowel&field=bwl_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data =>{
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
   <h1>Edit Bowel</h1>

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
      label='Status'
      value={status}
      onChange={e => {
        setStatus(e.target.value)
      }}
    />
    <TextField
      value={type}
        label="Type"
        type="text"
        onChange={(e)=>{setType(e.target.value)}}
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
