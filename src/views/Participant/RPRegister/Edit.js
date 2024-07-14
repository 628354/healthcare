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
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
// import { Upload } from 'antd'
import '../../../style/document.css'

import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Card, CardContent,Typography } from '@mui/material'
import { BASE_URL, COMMON_UPDATE_FUN } from 'helper/ApiInfo'
         
const Edit = ({ selectedRP, setIsEditing,setShow,show,participantId}) => {
  const id = selectedRP.rpreg_id;   
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const [startDate, setStartDate] = useState(selectedRP.rpreg_strtdate)
  const [startTime, setStartTime] = useState(selectedRP.rpreg_strttime)
  const [endDate, setEndDate] = useState(selectedRP.rpreg_enddate)
  const [endTime, setEndTime] = useState(selectedRP.rpreg_endtime)
  const [restrictivePractice, setRestrictivePractice] = useState(selectedRP.rpreg_rsttype)
  const [restrictivePracticeList, setRestrictivePracticeList] = useState([])
  const [administrationType, setAdministrationType] = useState(selectedRP.rpreg_admtyp)
  const [participant, setParticipant] = useState(selectedRP.rpreg_prtcpntid);
  const [participantList,setParticipantList]=useState([])
  const [isAuthorised, setIsAuthorised] = useState(selectedRP.rpreg_auth)
  const [description, setDescription] = useState(selectedRP.rpreg_dscrptn)
  const [behaviorOfConcerns, setBehaviorOfConcerns] = useState(selectedRP.rpreg_bhvrcncrn)
  const [reportingFrequency, setReportingFrequency] = useState(selectedRP.rpreg_freq)
  const [nextReviewDate, setNextReviewDate] = useState(selectedRP.rpreg_rvwdate === '0000-00-00' ? '':selectedRP.rpreg_rvwdate);
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)

  useEffect(() => {
    if (selectedRP) {
      const updateData = selectedRP && selectedRP.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedRP.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedRP]);

  const minSelectableDate = dayjs(startDate).add(1, 'day');
  const getRole= async()=>{
    let url = "https://tactytechnology.com/mycarepoint/api/";
  let endpoint = 'getWhereAll?table=fms_prtcpnt_details&field=prtcpnt_archive&value=1';
  
    let response =await fetch(`${url}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setParticipantList(res.messages)
  // console.log(res);
    }
  
  }

  useEffect(() => {

    if(!participantId){
      setShow(true)
    return () => setShow(false)
  
    }
    
  }, [setShow])
  
  const getRestrictive = async()=>{
    let url = "https://tactytechnology.com/mycarepoint/api/";
  let endpoint = 'getAll?table=admin_restrictive_practice&select=admin_res_prac_id,res_prac_name';
  
    let response =await fetch(`${url}${endpoint}`,{
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
  
  
  


 

  const handleUpdate = e => {
    e.preventDefault()

    if (!startDate) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      })
    }


 

    const formattedDate =startDate? dayjs(startDate).format('YYYY-MM-DD'): null; 
    const formattedEnd = endDate?dayjs(endDate).format('YYYY-MM-DD'): null; 
    const formattedNextDate =nextReviewDate? dayjs(nextReviewDate).format('YYYY-MM-DD'): null; 
    
    const formattedTime = dayjs(startTime).format('HH:mm');
    const formattedEndTime = dayjs(endTime).format('HH:mm');
    const formData = new FormData()
    formData.append('rpreg_strtdate',formattedDate)
    formData.append('rpreg_strttime',formattedTime)
    formData.append('rpreg_endtime',formattedEndTime)
    formData.append('rpreg_enddate',formattedEnd)
    formData.append('rpreg_rsttype',restrictivePractice)
    formData.append('rpreg_admtyp',administrationType)
    formData.append('rpreg_dscrptn',description)
    formData.append('rpreg_auth',isAuthorised)
    formData.append('rpreg_prtcpntid',participant)
    formData.append('rpreg_bhvrcncrn', behaviorOfConcerns)
    formData.append('rpreg_freq',reportingFrequency)
    formData.append('rpreg_rvwdate',formattedNextDate)
    formData.append('created_at',currentTime)




    let endpoint = 'updateAll?table=fms_prtcpnt_rpregistration&field=rpreg_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    console.log(formData);
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
      <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Edit a record</h1>

      <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '50ch', marginBottom: '15px' }}>
        <DatePicker label="Start date" format='DD/MM/YYYY' value={dayjs(startDate)} onChange={(newValue) => { setStartDate(newValue) }} />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
        value={dayjs(startTime, 'HH:mm')}
        label="Start Time"
        onChange={(newValue) => { setStartTime(newValue) }}

        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '50ch', marginBottom: '15px' }}>
        <DatePicker label="End date" format='DD/MM/YYYY' value={dayjs(endDate)} onChange={(newValue) => { setEndDate(newValue) }} />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label="End Time"
          value={dayjs(endTime, 'HH:mm')}
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
        <DatePicker required label='Next review date' minDate={dayjs(minSelectableDate)}  value={dayjs(nextReviewDate)} format='DD/MM/YYYY' type='date' onChange={(newValue) => { setNextReviewDate(newValue) }} />
      </LocalizationProvider>


      <Box sx={{ width: '100ch', m: 1 }}>
        <Stack direction='row-reverse' spacing={2}>
          <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
            Cancel
          </Button>
          <Button variant='outlined' type='submit'>
            Submit
          </Button>
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
