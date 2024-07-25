import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { Upload } from 'antd';
import Chip from '@mui/material/Chip';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import '../../../style/document.css'
// import Switch from '@mui/material/Switch';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

const Add = ({ setIsAdding, setShow, show, participantId }) => {


  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [startTime, setstartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalKm, setTotalKm] = useState('');
  const [vehicle , setVehicle ] = useState('');
  const [staff, setStaff] = useState([]);
  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])
  const [notes, setNotes] = useState('')
  const [activities, setActivities] = useState({})
  const [staffList, setStaffList] = useState([])
  // const [staffId,setStaffId]=useState(null)

  const [companyID, setCompanyID] = useState(null)

  const [employees, setEmployees] = useState([]);

  const [attachment, setAttachment] = useState([]);

  const [staffOpen, setStaffOpen] = useState(false);




  const handleDynamicFieldChange = (fieldId, value, label) => {
    setActivities(prevState => ({
      ...prevState,

      [fieldId]: {
        value: value,
        name: label
      }
    }));
  };
  const handleClose = () => {
    setStaffOpen(false);

  };
  useEffect(() => {

    if (!participantId) {
      setShow(true)
      return () => setShow(false)

    }

  }, [setShow])

  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj);
    }
    setAttachment(fileList);
  };

  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      console.log(id);
      setCompanyID(id)

    }
  }, [])

  const getFields = async () => {
    try {

      const url = `${BASE_URL}getWhereAll?table=custom_fields&field=company_id&value=${companyID}`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        console.log(data);

        setEmployees(data.messages)

      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const getRole = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant)
      if (response.status) {
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
      if (response.status) {
        console.log(response.messages);
        setStaffList(response.messages) 

      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  useEffect(() => {
    if (companyID) {
      getFields();
    }


  }, [companyID])

  useEffect(() => {
    // getFields();
    getStaff();
    getRole();
  }, [])
  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      // const combine =`${finalStaff} ${lname}`
      const id = convert?.stf_id
      console.log(id);
      setStaff([id])
      // setStaffId(id)

    }
  }, [])
  // console.log(staff);
  const handleAdd = e => {
    e.preventDefault();
    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
    if (!startTime) {
      emptyFields.push('Shift start time');
    }
    if (!endTime) {
      emptyFields.push('Shift end time');
    }
    if (!notes) {
      emptyFields.push('Notes');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!totalKm) {
      emptyFields.push('Total K.M.');
      
    }
    if (!vehicle) {
      emptyFields.push('Vehicle');
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
    const formattedTime = startTime ? dayjs(startTime).format('HH:mm') : null;
    const formattedEndTime = endTime ? dayjs(endTime).format('HH:mm') : null;
    const customFieldData = [];

    // Loop through each custom field
    employees.forEach(data => {
      const fieldValue = activities[data.custom_fields_id]?.value || '';
      customFieldData.push({
        fieldId: data.custom_fields_id,
        value: fieldValue,
        label: data.custom_fields_label
      });
    });

    const customFieldJson = JSON.stringify(customFieldData);
    const formData = new FormData();
    formData.append('prgs_staff', staff);
    formData.append('prgs_date', dateFormat);
    formData.append('prgs_strttime', formattedTime);
    formData.append('prgs_prtcpntid', participant);
    formData.append('prgs_endtime', formattedEndTime);
    formData.append('prgs_note', notes);
    formData.append('prgs_actvty', customFieldJson);
    formData.append('created_at', currentTime);
    formData.append('company_id', companyId);
    formData.append('total_km', totalKm);
    formData.append('vehicle', vehicle);
    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = "insertReporting?table=fms_prtcpnt_prgsnote";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {

      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdding(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true,
        });
      }
    });

  };




  return (
    <div className="small-container">

      <Box
        component="form"

        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
        <h1>Create Progress Notes</h1>
        <Box className="obDiv">
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker label="Date" format='DD/MM/YYYY'onChange={(newValue) => { setDate(newValue) }} minDate={dayjs(currentDate)} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="Start Time"
              onChange={(newValue) => { setstartTime(newValue) }}

            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label="End Time"
              onChange={(newValue) => { setEndTime(newValue) }}

            />
          </LocalizationProvider>

        </Box>

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
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select
            labelId='Staff'
            id='Staff'
            value={staff}
            label='Staff'
            open={staffOpen}
            onOpen={() => setStaffOpen(true)}
            onClose={() => setStaffOpen(false)}
            multiple
            onChange={(e) => {
              setStaff(e.target.value);
              handleClose();
            }}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected?.map((value) => {
                  const selectedPractitioner = staffList.find(item => item?.stf_id === value);
                  // console.log(value);
                  return (
                    <Chip
                      key={value}
                      label={selectedPractitioner?.stf_firstname}
                      onDelete={() => handleDelete(value)}
                      sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
                    />

                  )
                })}
              </div>
            )}
          >
            {
              staffList?.map((item) => {

                return (
                  <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>


        <TextField
          value={totalKm}
            label="Total K.M."
            type="text"
            onChange={(e)=>{setTotalKm(e.target.value)}}
          />   
            <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='Vehicle '>Vehicle</InputLabel>
          <Select
            labelId='Vehicle'
            id='Vehicle'
            value={vehicle}
            label='Vehicle'
            onChange={e => setVehicle(e.target.value)}
          >
          
                  <MenuItem value='Company'>Company</MenuItem>
                  <MenuItem value='Private'>Private</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>



             
          </Select>
        </FormControl>



        <TextField
          value={notes}
          label="Notes"
          type="text"
          multiline
          rows={5}
          onChange={(e) => { setNotes(e.target.value) }}
        />
        

        {Array.isArray(employees) &&
          employees?.map((data, index) => {
            console.log(data);

            return (
              <> <TextField
                key={data?.custom_fields_id}
                value={activities[data?.custom_fields_id]?.value || ''}
                label={data.custom_fields_label}
                type="text"
                multiline
                rows={5}
                onChange={(e) => handleDynamicFieldChange(data?.custom_fields_id, e.target.value, data.custom_fields_label)}
              /></>
            )
          })
        }

        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse"
            spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
            <Button variant="outlined" type="submit" >Submit</Button>

          </Stack>
        </Box>
      </Box>
    </div>
  );
};


export default Add;