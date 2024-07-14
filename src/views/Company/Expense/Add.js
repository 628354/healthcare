import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Upload } from 'antd';
import dayjs from 'dayjs';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo';

// import Switch from '@mui/material/Switch';


const Add = ({ setIsAdding, setShow }) => {


  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [staff, setStaff] = useState('');
  // const [staffList, setStaffList] = useState([])

  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])
  const [totalExpense, setTotalExpense] = useState('');
  const [description, setDescription] = useState('')
  const [staffId, setStaffId] = useState(null)
  const [paidBy, setPaidBy] = useState('');
  const [attachment, setAttachment] = useState([]);


  useEffect(() => {
    setShow(true)
    return () => setShow(false)
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
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  useEffect(() => {

    getRole();
  }, [])
  useEffect(() => {
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
    e.preventDefault();

    const emptyFields = [];
   
    if (!date) {
      emptyFields.push('Date');
    }

    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!totalExpense) {
      emptyFields.push('Total Expense');
    }
    if (!description) {
      emptyFields.push('Description');
    }
    if (!paidBy) {
      emptyFields.push('Paid By');
    }
    if (!attachment) {
      emptyFields.push('Attechment');
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
    const formData = new FormData();
    formData.append('expn_stfid', staffId);
    formData.append('expn_date', dateFormat);
    formData.append('expn_prtcpntid', participant);
    formData.append('expn_totlexpn', totalExpense);
    formData.append('expn_dscptn', description);
    formData.append('expn_paid', paidBy);
    formData.append('created_at', currentTime);
    formData.append('company_id', companyId);


    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    
    let endpoint = "insertCompany?table=fms_expenses";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check", data)
      //return data;
      console.log(data);
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
        <h1>Create Expense</h1>
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


        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
            <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
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
              participantList?.map((item) => {

                return (
                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
        <TextField
          value={totalExpense}
          label="Total Expense"
          type="text"
          onChange={(e) => { setTotalExpense(e.target.value) }}
        />

        <TextField
          value={description}
          multiline
          rows={4}
          label="Description"
          type="text"
          onChange={(e) => { setDescription(e.target.value) }}
        />

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='PaidBy '>Paid By </InputLabel>
          <Select labelId='PaidBy' id='PaidBy' value={paidBy} label='Paid By' onChange={e => setPaidBy(e.target.value)}>
            <MenuItem value='Staff'>Staff</MenuItem>
            <MenuItem value='Company'>Company</MenuItem>
            <MenuItem value='Participant'>Participant</MenuItem>

          </Select>
        </FormControl>
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