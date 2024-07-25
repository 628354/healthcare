import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
// import '../../../../style/document.css'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Card, CardContent, Typography } from '@mui/material';

import { BASE_URL, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'
import Select from '@mui/material/Select'
import '../../../style/document.css'

import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

const Edit = ({ selectData, setIsEditing,allowPre ,setShow}) => {
  const id = selectData.abc_id;


  const [date, setDate] = useState(selectData.abc_date? dayjs(selectData.abc_date): null);
  const [startTime, setstartTime] = useState(selectData.abc_strttime ? dayjs(selectData.abc_strttime, 'HH:mm') : null);
  const [endTime, setEndTime] = useState((selectData.abc_endtime ? dayjs(selectData.abc_endtime, 'HH:mm') : null));

  const[staff,setStaff]=useState(selectData.abc_stfid)
  const [participant, setParticipant] = useState(selectData.abc_prtcpntid);
  const [participantList,setParticipantList]=useState([])
  const[staffList,setStaffList]=useState([])
  const [antecedents, setAntecedents] = useState(selectData.abc_antecedent);
  const [behaviour , setBehaviour ] = useState(selectData.abc_behaviour);
  const [consequences ,setConsequences] = useState(selectData.abc_consequences);
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
    if(setShow){
      setShow(true)
    return () => setShow(false)
  
    }
    
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
      
    } if (!startTime) {
      emptyFields.push('Start Time');
    }
    if (!endTime) {
      emptyFields.push('End Time');
    }

    if (!antecedents) {
      emptyFields.push('Antecedents ');
      
    } if (!behaviour) {
      emptyFields.push('Behaviour');
    }
    if (!consequences) {
      emptyFields.push('Consequences');
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

    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    

    const formData = new FormData()
    formData.append('abc_date', dateFormat)
    formData.append('abc_strttime', formattedTime)
    formData.append('abc_endtime', formattedEndTime)
    formData.append('abc_stfid', staff)
    formData.append('abc_prtcpntid', participant)
    formData.append('abc_antecedent', antecedents)
    formData.append('abc_behaviour', behaviour)
    formData.append('abc_consequences', consequences)
    formData.append('updated_at', currentTime)



    let endpoint = 'updateAll?table=fms_ABC_Logs&field=abc_id&id=' + id
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
    //bgcolor:'#FFFFFF'
  }}
  noValidate
  autoComplete="off"
  onSubmit={handleUpdate}
>
   <h1>Edit Seizure</h1>

   <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker label="Date" value={dayjs(date)} format="DD/MM/YYYY" onChange={(newValue) => {setDate(newValue) }} />
  </LocalizationProvider>
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

  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label="Start Time"
      value={dayjs(startTime, 'HH:mm')}
      onChange={(newValue) => {setstartTime(newValue) }}
     
    />
     </LocalizationProvider>
     <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label="End Time"
      value={dayjs(endTime, 'HH:mm')}
      onChange={(newValue) => {setEndTime(newValue) }}
     
    />
     </LocalizationProvider>

    
   


 
 
     <TextField
      required
      label='Antecedents'
      value={antecedents}
      onChange={e => {
        setAntecedents(e.target.value)
      }}
    />
    <TextField
      value={behaviour}
        label="Behaviour"
        type="text"
        onChange={(e)=>{setBehaviour(e.target.value)}}
      />
       <TextField
      value={consequences}
        label="Consequences "
        type="text"
        onChange={(e)=>{setConsequences(e.target.value)}}
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
      </Card>
    </>

  )
}

export default Edit
