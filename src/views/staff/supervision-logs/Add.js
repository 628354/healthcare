import React, { useContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import { Upload } from 'antd'
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import AuthContext from 'views/Login/AuthContext'

const CustomDatePicker = ({ value, onChange, error, helperText, ...props }) => (
  <TextField
    {...props}
    value={value ? value.format('DD/MM/YYYY') : ''}
    onChange={(e) => onChange(dayjs(e.target.value, 'DD/MM/YYYY'))}
    error={error}
    helperText={helperText}
    InputProps={{ ...props.InputProps, readOnly: true }}
  />
)

const Add = ({ setIsAdding, setShow }) => {
  const currentDate = new Date()
  const [date, setDate] = useState(null)
  const [staff, setStaff] = useState('')
  const [staffList, setStaffList] = useState([])
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [nextdueon, setNextDueOn] = useState(null)
  const [attachment, setAttachment] = useState([])
  const [errors, setErrors] = useState({}) 

  const minSelectableDate = dayjs(date).add(1, 'day')
  const { companyId } = useContext(AuthContext)

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const handleChange = (e) => {
    const files = e.fileList
    const fileList = []
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj)
    }
    setAttachment(fileList)
  }

  const handleFieldChange = (setter, fieldName) => (event) => {
    setter(event.target.value)
    // Clear specific error when user starts typing
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }))
  }

  useEffect(() => {
    const staff = localStorage.getItem('user')
    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_id
      setStaff(finalStaff)
    }
  }, [])

  const getStaff = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.staff+companyId)
      if (response.status) {
        setStaffList(response.messages)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  useEffect(() => {
    getStaff()
  }, [])

  const handleAdd = (e) => {
    e.preventDefault()

    // Clear previous errors
    const newErrors = {}
    let hasErrors = false

    if (!date) {
      newErrors.date = 'Date is required'
      hasErrors = true
    }
    if (!type) {
      newErrors.type = 'Type is required'
      hasErrors = true
    }
    if (!staff ) {
      newErrors.staff = 'Staff is required'
      hasErrors = true
    }
    if (!nextdueon) {
      newErrors.nextdueon = 'Next Due On is required'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const nextdueonDate = nextdueon ? nextdueon.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm')

    const formData = new FormData()
    formData.append('suprvsn_stfid', staff)
    formData.append('suprvsn_date', dateFormat)
    formData.append('suprvsn_type', type)
    formData.append('suprvsn_note', notes)
    formData.append('suprvsn_dueon', nextdueonDate)
    formData.append('company_id', companyId)
    formData.append('created_at', currentTime)
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file)
    })

    let endpoint = 'insertStaffMedia?table=fms_stf_supervision'
    COMMON_ADD_FUN(BASE_URL, endpoint, formData).then(data => {
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${type}'s data has been added.`,
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
        sx={{ '& .MuiTextField-root': { m: 1, width: '50ch' } }}
        noValidate
        autoComplete='off'
        onSubmit={handleAdd}
      >
        <h1>Create Supervision Log</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            value={date}
            onChange={newValue => setDate(newValue)}
            renderInput={(params) => (
              <CustomDatePicker
                {...params}
                error={!!errors.date}
                helperText={errors.date}
                onChange={(value) => setDate(value)}
              />
            )}
          />
        </LocalizationProvider>

        <FormControl sx={{ width: '50ch', m: 1 }} required error={!!errors.staff}>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select
            labelId='Staff'
            id='Staff'
            value={staff}
            label='Staff'
            onChange={handleFieldChange(setStaff, 'staff')}
          >
            {staffList?.map(item => (
              <MenuItem key={item?.stf_id} value={item?.stf_id}>
                {item?.stf_firstname} {item?.stf_lastname}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors.staff}</FormHelperText>
        </FormControl>

        <TextField
          required
          label='Type'
          value={type}
          onChange={handleFieldChange(setType, 'type')}
          error={!!errors.type}
          helperText={errors.type}
        />

        <TextField
          required
          label='Notes'
          value={notes}
          onChange={handleFieldChange(setNotes, 'notes')}
        />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next Due On'
            format='DD/MM/YYYY'
            minDate={dayjs(minSelectableDate)}
            value={nextdueon}
            onChange={newValue => setNextDueOn(newValue)}
            renderInput={(params) => (
              <CustomDatePicker
                {...params}
                error={!!errors.nextdueon}
                helperText={errors.nextdueon}
                onChange={(value) => setNextDueOn(value)}
              />
            )}
          />
        </LocalizationProvider>

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
