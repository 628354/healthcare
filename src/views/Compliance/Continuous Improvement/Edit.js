import React, { useState,useEffect, useContext } from 'react'
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
import { IMG_BASE_URL,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN} from '../../../helper/ApiInfo'
  import AuthContext from 'views/Login/AuthContext'
  import { Card, CardContent, Typography } from '@mui/material'
const Edit = ({selectedData , setIsEditing,allowPre,setShow}) => {

  const {companyId}=useContext(AuthContext)
 //console.log(selectedData);
const currentDate =new Date();
  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const id = selectedData.cnt_id;

  const [date, setDate] = useState(selectedData.cnt_date  ? dayjs(selectedData.cnt_date) : dayjs())
  const [sourceOfFeedback, setSourceOfFeedback] = useState(selectedData.cnt_feedback )
  const [opportunityForImprovement, setOpportunityForImprovement] = useState(selectedData.cnt_opor)
  const [actionsRequired, setActionsRequired] = useState(selectedData.cnt_actn)
  const [personOversee, setPersonOversee] = useState(selectedData.cnt_stfid)
  const [personOverseeLi, setPersonOverseeLi] = useState([])

  const [status, setStatus] = useState(selectedData.cnt_status)
  const [dueDate, setDueDate] = useState(selectedData.cnt_duedate === '0000-00-00' ? '':selectedData.cnt_duedate)
  const [nextReviewDate, setNextReviewDate] = useState(selectedData.cnt_rvudate === '0000-00-00' ? '':selectedData.cnt_rvudate  )
  const [comments, setComments] = useState(selectedData.cnt_cmnt)
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  
     useEffect(() => {
      if (selectedData) {
        const updateData = selectedData && selectedData.updated_at
  
        if (updateData) {
          const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
          const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
          const formattedDate = `${day}-${month}-${year}`;
          const formattedTime = updateTime.substr(0, 5);
          const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
          setUpdateDate(final)
        }
        const createData = selectedData.created_at
  
        if (createData) {
          const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
          const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
          const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
          const formattedCreateTime = createTime.substr(0, 5);
          const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
          setCreateDate(final)
        }
      }
    }, [selectedData]);



  
  const minSelectableDate = dayjs(date).add(1, 'day');

  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
      if(response.status) {  
        setPersonOverseeLi(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  useEffect(() => {
  
    getStaff();
  }, []);


const handleUpdate = e => {
    e.preventDefault()
    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
    if (!sourceOfFeedback) {
      emptyFields.push('Source of feedback');
    }
    if (!opportunityForImprovement) {
      emptyFields.push('Opportunity for improvement');
    }
    if (!actionsRequired) {
      emptyFields.push('Actions required');
    }

    if (!personOversee) {
      emptyFields.push('Person overseeing');
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
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const formattedstartDate = dayjs(date).format('YYYY-MM-DD');
    const formatteddueDate = dayjs(dueDate).format('YYYY-MM-DD');
    const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');
    
    const formData = new FormData();

    formData.append('cnt_date', formattedstartDate);
    formData.append('cnt_feedback',sourceOfFeedback);
    formData.append('cnt_opor', opportunityForImprovement);
    formData.append('cnt_actn', actionsRequired);
    formData.append('cnt_stfid',personOversee);
    formData.append('cnt_status',status);
    formData.append('cnt_duedate',formatteddueDate);
    formData.append('cnt_rvudate',formattedNextDate);
    formData.append('cnt_cmnt',comments);
    formData.append('updated_at',currentTime);



  
    let endpoint = `updateAll?table=fms_cntnusimprvmnt&field=cnt_id&id=${id}`;
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
        
        <Box sx={{ width: "100%" }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date'
                format='DD/MM/YYYY'
                value={dayjs(date)}
                minDate={dayjs(currentDate)}
                onChange={newValue => {
                  setDate(newValue)
                }}
              />
            </LocalizationProvider>

            <TextField

              required
              label='Source of feedback'
              value={sourceOfFeedback}
              onChange={e => {
                setSourceOfFeedback(e.target.value)
              }}
            />

          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <TextField
              required
              label='Opportunity for improvement'
              multiline
              rows={4}
              value={opportunityForImprovement}
              onChange={e => {
                setOpportunityForImprovement(e.target.value)
              }}
            />

            <TextField

              required
              label='Actions required'
              multiline
              rows={4}
              value={actionsRequired}
              onChange={e => {
                setActionsRequired(e.target.value)
              }}
            />
          </div>
          <div style={{ display: 'flex', gap:'26px',marginLeft:"7px" }}>
            <FormControl style={{ width: '50ch' }} required>
              <InputLabel id='personOversee'>Person overseeing</InputLabel>
              <Select
                labelId='personOversee'
                id='personoversee'
                value={personOversee}
                label='Person overseeing'
                onChange={e => setPersonOversee(e.target.value)}
              >
                {personOverseeLi?.map(item => {
                  //console.log(item.stf_id);
                  return (
                    <MenuItem key={item?.stf_id} value={item?.stf_id}>
                      {item?.stf_firstname} {item?.stf_lastname}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>

            <FormControl style={{ width: '50ch' }} required>
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
                <MenuItem value="Completed">Completed</MenuItem>

              </Select>
            </FormControl>
          </div>


          <div style={{ display: 'flex', gap: '10px', marginTop: "14px" }}>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Due date" format='DD/MM/YYYY' value={dayjs(dueDate)} minDate={dayjs(minSelectableDate)} onChange={(newValue) => { setDueDate(newValue) }} />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Next review date" format='DD/MM/YYYY' value={dayjs(nextReviewDate)} minDate={dayjs(minSelectableDate)} onChange={(newValue) => { setNextReviewDate(newValue) }} />
            </LocalizationProvider>


          </div>

          <div style={{ display: 'flex', gap: '10px',  }}>

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
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>
  
  )
}

export default Edit
