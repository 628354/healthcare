import React, { useContext, useEffect, useState } from 'react'
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
import { BASE_URL,COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST,  } from 'helper/ApiInfo'
import AuthContext from 'views/Login/AuthContext'

const Add = ({ setIsAdding, setShow }) => {

  const {companyId} = useContext(AuthContext)

  const [date, setDate] = useState('')


  const [sourceOfFeedback, setSourceOfFeedback] = useState('')

  const [opportunityForImprovement, setOpportunityForImprovement] = useState('')
  const [actionsRequired, setActionsRequired] = useState('')
  const [personOversee, setPersonOversee] = useState('')
  const [personOverseeLi, setPersonOverseeLi] = useState([])

  const [status, setStatus] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [nextReviewDate, setNextReviewDate] = useState('')
  const [comments, setComments] = useState('')

  const currentDate = new Date();

  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_id
      // //console.log(finalStaff);
      setPersonOversee(finalStaff)
    }
  }, [])

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
    }
  }

  useEffect(() => {

    getStaff();
  }, []);

  const minSelectableDate = dayjs(date).add(1, 'day');
  // //console.log("Type of userRole:", typeof userRole);
  // //console.log("Contents of userRole:", userRole);
  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const handleAdd = e => {
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

    const formattedstartDate = dayjs(date).format('YYYY-MM-DD');
    const formatteddueDate = dayjs(dueDate).format('YYYY-MM-DD');
    const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const data = {
      cnt_date: formattedstartDate,
      cnt_feedback: sourceOfFeedback,
      cnt_opor: opportunityForImprovement,
      cnt_actn: actionsRequired,
      cnt_stfid: personOversee,
      cnt_status: status,
      cnt_duedate: formatteddueDate,
      cnt_rvudate: formattedNextDate,
      cnt_cmnt: comments,
      company_id:companyId,
      created_at:currentTime
    }

    

    let endpoint = 'insertData?table=fms_cntnusimprvmnt'
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
          
          '& .MuiTextField-root': { m: 1, width: '50ch' }
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleAdd}
      >

        <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Create Continuous Improvement</h1>

        <Box sx={{ width: "100%" }}>
          <div style={{ display: 'flex', gap: '10px' }}>
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
              <DatePicker label="Due date" format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)} onChange={(newValue) => { setDueDate(newValue) }} />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Next review date" format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)} onChange={(newValue) => { setNextReviewDate(newValue) }} />
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
