import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import Select from '@mui/material/Select'

import Swal from 'sweetalert2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { BASE_URL, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

const Edit = ({ selectedMediaction, setIsEditing, allowPre,setShow}) => {
  console.log(selectedMediaction);
  const id = selectedMediaction.mreg_id;
  const [startDate, setStartDate] = useState(selectedMediaction.mreg_strtdate ? dayjs(selectedMediaction.mreg_strtdate) : null)
  const [endDate, setEndDate] = useState(selectedMediaction.mreg_enddate ? dayjs(selectedMediaction.mreg_enddate) : null)
  const [nextReviewDate, setNextReviewDate] = useState(selectedMediaction.mreg_rvudate ? dayjs(selectedMediaction.mreg_rvudate) : null)
  const [participant, setParticipant] = useState(selectedMediaction.mreg_prtcpntid)
  const [participantList, setParticipantList] = useState([])
  const [documentedBy, setDocumentedBy] = useState(selectedMediaction.mreg_stfid)
  const [medicationName, setMedicationName] = useState(selectedMediaction.mreg_mediname)
  const [administrationType, setAdministrationType] = useState(selectedMediaction.mreg_admtype)
  const [dosage, setDosage] = useState(selectedMediaction.mreg_dosge)
  const [frequency, setFrequency] = useState(selectedMediaction.mreg_freq)
  const [isPrescribed, setIsPrescribed] = useState(selectedMediaction.mreg_pres)
  const [notes, setNotes] = useState(selectedMediaction.mreg_note)

  const [administrationList, setAdminstrationList] = useState([])
  const [isPrescribedList, setIsPrescribedList] = useState([])

  const [staffList, setStaffList] = useState([])
  const [updateDate, setUpdateDate] = useState(null)
  const [createDate, setCreateDate] = useState(null)
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  useEffect(() => {
    if (selectedMediaction) {
      const updateData = selectedMediaction && selectedMediaction.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedMediaction.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedMediaction]);
  useEffect(() => {

    // if(show){
      setShow(true)
    return () => setShow(false)
  
    // }
    
  }, [setShow])
  // get user role

  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if (response.status) {
        setParticipantList(response.messages)

      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching Participant data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  const getAdminstrationType = async () => {
    let endpoint = 'getAll?table=administration_type&select=administration_type_id,administration_type_name';


    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setAdminstrationList(res.messages)
      // console.log(res);
    }

  }
  const getIsprescribedName = async () => {
    let endpoint = 'getAll?table=is_prescribed&select=is_prescribed_id,is_prescribed_name';


    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setIsPrescribedList(res.messages)
      // console.log(res);
    }

  }
  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if (response.status) {
        setStaffList(response.messages)

      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  };


  useEffect(() => {
    getRole();
    getAdminstrationType();
    getIsprescribedName();
    getStaff()
  }, [])

  const handleUpdate = e => {
    e.preventDefault()

    const emptyFields = [];

    if (!startDate) {
      emptyFields.push('Start Date');
    }
    if (!participant) {
      emptyFields.push('participant');
    }
    if (!documentedBy) {
      emptyFields.push('Document By');
    }
    if (!medicationName) {
      emptyFields.push('Medication Name');
    }
    if (!administrationType) {
      emptyFields.push('Administration Type');
    }
    if (!dosage) {
      emptyFields.push('Dosage');
    }
    if (!frequency) {
      emptyFields.push('Frequency');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const checkStartDate = dayjs(`${startDate}`);

    const checkNextDate = dayjs(`${endDate}`);
    if (checkNextDate.isBefore(checkStartDate)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: ' Next Review Date cannot be less than start date.',
        showConfirmButton: true
      });
    }
    const startDateFormat = startDate ? startDate.format('YYYY-MM-DD') : null

    const dueDateFormat = endDate ? endDate.format('YYYY-MM-DD') : null
    const nextReviewDateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null

    const formData = new FormData()
    formData.append('mreg_prtcpntid', participant)
    formData.append('mreg_stfid', documentedBy)
    formData.append('mreg_strtdate', startDateFormat)
    formData.append('mreg_enddate', dueDateFormat)
    formData.append('mreg_rvudate', nextReviewDateFormat)
    formData.append('mreg_mediname', medicationName)
    formData.append('mreg_admtype', administrationType)
    formData.append('mreg_dosge', dosage)
    formData.append('mreg_freq', frequency)
    formData.append('mreg_pres', isPrescribed)
    formData.append('mreg_note', notes)
    formData.append('updated_at', currentTime)



    let endpoint = `updateAll?table=fms_medication_Register&field=mreg_id &id=${id}`;
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, formData)
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
          <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Edit a record</h1>

          <Box sx={{ width: "100%" }}>

            <div style={{ display: 'flex', gap: '10px', width: "95%", marginTop: "14px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Start date" format='DD/MM/YYYY' value={dayjs(startDate)} onChange={(newValue) => { setStartDate(newValue) }} />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="End date" format='DD/MM/YYYY' value={dayjs(endDate)} minDate={dayjs(startDate)} onChange={(newValue) => { setEndDate(newValue) }} />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Next review date" format='DD/MM/YYYY' value={dayjs(nextReviewDate)} minDate={dayjs(startDate)} onChange={(newValue) => { setNextReviewDate(newValue) }} />
              </LocalizationProvider>


            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
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
                    participantList?.map((item) => {

                      return (
                        <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                      )

                    })
                  }
                </Select>
              </FormControl>

              <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                <InputLabel id='DocumentedBy'>Documented By</InputLabel>
                <Select
                  labelId='DocumentedBy'
                  id='DocumentedBy'
                  value={documentedBy}
                  label='Documented By'
                  onChange={e => setDocumentedBy(e.target.value)}
                >
                  <MenuItem value={documentedBy}>{documentedBy}</MenuItem>

                  {staffList.map(staff => (
                    <MenuItem key={staff.stf_id} value={staff.stf_id}>
                      {`${staff.stf_firstname} ${staff.stf_lastname}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>







            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <TextField
                required
                label='Medication Name'
                value={medicationName}
                onChange={e => {
                  setMedicationName(e.target.value)
                }}
              />
              <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                <InputLabel id='setType'>Administration Type</InputLabel>
                <Select
                  labelId='AdministrationType'
                  id='AdministrationType'
                  value={administrationType}
                  label='AdministrationType'
                  onChange={e => setAdministrationType(e.target.value)}
                >
                  {administrationList?.map(item => (
                    <MenuItem key={item?.administration_type_id} value={item?.administration_type_id}>
                      {item?.administration_type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


            </div>


            <div style={{ display: 'flex', gap: '10px' }}>
              <TextField
                required
                label='Dosage'

                value={dosage}
                onChange={e => {
                  setDosage(e.target.value)
                }}
              />

              <TextField

                required
                label='Frequency'
                value={frequency}
                onChange={e => {
                  setFrequency(e.target.value)
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>

              <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                <InputLabel id='status'>Is Prescribed</InputLabel>
                <Select
                  labelId='IsPrescribed'
                  id='IsPrescribed'
                  value={isPrescribed}
                  label='IsPrescribed'
                  onChange={e => setIsPrescribed(e.target.value)}
                >
                  {isPrescribedList?.map(item => (
                    <MenuItem key={item?.is_prescribed_id} value={item?.is_prescribed_id}>
                      {item?.is_prescribed_name}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>

              <TextField
                required
                label='Notes'
                multiline
                rows={4}
                value={notes}
                onChange={e => {
                  setNotes(e.target.value)
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

                allowPre?.edit ? <Button variant="outlined" type="submit" >Update</Button> : ""
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
