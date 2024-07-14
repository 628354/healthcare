import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import { Upload } from 'antd'
import { BASE_URL, COMMON_ADD_FUN,companyId } from 'helper/ApiInfo';

//select field
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Swal from 'sweetalert2'

// import Switch from '@mui/material/Switch'

const Add = ({ setIsAdding, setShow }) => {
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [staff, setStaff] = useState('')

  const [meetingType, setMeetingType] = useState('')
  const [location, setLocation] = useState('')

  const [purpose, setPurpose] = useState('')
  const [attendees, setAttendees] = useState('')
  const [apologies, setApologies] = useState('')

  const [agenda, setAgenda] = useState('')
  const [discussion, setDiscussion] = useState('')
  const [action, setAction] = useState('')

  const [staffId, setStaffId] = useState(null)
  const [typeList, setTypeList] = useState([])

  const [attachment, setAttachment] = useState([])

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const getType = async () => {
    try {
      let endpoint = 'getAll?table=meeting_type&select=meeting_type_id,meeting_type_name'

      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const res = await response.json()
        setTypeList(res.messages)
        // console.log(res)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  const handleChange = e => {
    const files = e.fileList
    console.log(files)
    const fileList = []
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj)
    }
    setAttachment(fileList)
  }

  useEffect(() => {
    getType();
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      setStaff(combine)
      setStaffId(id)
    }
  }, [])

  const handleAdd = e => {
    e.preventDefault()
    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
    if (!startTime) {
      emptyFields.push('Start Time');
    } 
    if (!endTime) {
      emptyFields.push('End Time');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!meetingType) {
      emptyFields.push('Meeting Type');
    }
    if (!location) {
      emptyFields.push('Location');
    }if (!purpose) {
      emptyFields.push('Purpose');
    }if (!attendees) {
      emptyFields.push('Attendees ');

    }if (!apologies) {
      emptyFields.push('Apologies');
    }
    if (!agenda) {
      emptyFields.push('Agenda');
    }if (!discussion) {
      emptyFields.push('Discussion');
    }if (!action) {
      emptyFields.push('Action');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    
    const formattedDate = date ? date.format('YYYY-MM-DD') : null

    const timeStart = dayjs(startTime).format('HH:mm')
    const timeEnd = dayjs(endTime).format('HH:mm')
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');


    const formData = new FormData()
    formData.append('meet_date', formattedDate)
    formData.append('meet_strttime', timeStart)
    formData.append('meet_endtime', timeEnd)
    formData.append('meet_stfid', staffId)
    formData.append('meet_meettype', meetingType)
    formData.append('meet_location', location)
    formData.append('meet_prpose', purpose)
    formData.append('meet_attend', attendees)
    formData.append('meet_apologs', apologies)
    formData.append('meet_agenda', agenda)
    formData.append('meet_discus', discussion)
    formData.append('meet_acton', action)
    formData.append('created_at', currentTime)
    formData.append('company_id', currentTime)

    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file)
    })

    let endpoint = 'insertMeeting?table=fms_meeting'
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      // console.log(data.status);
      console.log('check', data)
      //return data;
      console.log(data)
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
        <h1>Create Meeting</h1>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label='Start Time'
            onChange={newValue => {
              setStartTime(newValue)
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label='End Time'
            onChange={newValue => {
              setEndTime(newValue)
            }}
          />
        </LocalizationProvider>


        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='type'>Meeting type</InputLabel>
          <Select
            labelId='Meetingtype'
            id='Meeting'
            value={meetingType}
            label='Meeting Type'
            onChange={e => setMeetingType(e.target.value)}
          >
            {typeList?.map(item => {
              return (
                <MenuItem key={item?.meeting_type_id} value={item?.meeting_type_id}>
                  {item?.meeting_type_name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <TextField
          value={location}
          multiline
          label='Location'
          type='text'
          onChange={e => {
            setLocation(e.target.value)
          }}
        />

        <TextField
          required
          value={purpose}
          multiline
          rows={4}
          label='Purpose '
          type='text'
          onChange={e => {
            setPurpose(e.target.value)
          }}
        />
        <TextField
          required
          value={attendees}
          multiline
          rows={4}
          label='Attendees'
          type='text'
          onChange={e => {
            setAttendees(e.target.value)
          }}
        />
        <TextField
          required
          multiline
          rows={4}
          value={apologies}
          label='Apologies  '
          type='text'
          onChange={e => {
            setApologies(e.target.value)
          }}
        />
        <TextField
          required
          multiline
          rows={4}
          value={agenda}
          label='Agenda  '
          type='text'
          onChange={e => {
            setAgenda(e.target.value)
          }}
        />

        <TextField
          required
          value={discussion}
          label='Discussion'
          multiline
          rows={4}
          type='text'
          onChange={e => {
            setDiscussion(e.target.value)
          }}
        />
        <TextField
          required
          value={action}
          multiline
          rows={4}
          label='Action  '
          type='text'
          onChange={e => {
            setAction(e.target.value)
          }}
        />


        <Upload
          style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }}
          type='file'
          multiple
          listType='picture-card'
          onChange={handleChange}
        >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>

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
