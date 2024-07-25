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
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_GET_PAR, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

// import Switch from '@mui/material/Switch';


const Add = ({setIsAdding,setShow,show,participantId}) => {
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location,setLocation]=useState('')

  const [staff, setStaff] = useState([]);
  const [participant, setParticipant] = useState([]);
  const [participantList,setParticipantList]=useState([])

  const [incidentType, setIncidentType] = useState([]);
  const [incidentTypeLi, setIncidentTypeLi] = useState([]);


  const [description  , setDescription ] = useState('')
  const [eventsPrior , setEventsPrior] = useState('')

  const [actionsTakenStaff ,setActionsTakenStaff]=useState('')
  const [actionsTakenOther ,setActionsTakenOther]=useState('')

  const [anyOtherWitness , setAnyOtherWitness] = useState('');
  const[staffList,setStaffList]=useState([])
 

  const [attachment, setAttachment] = useState([]);

  const [staffOpen, setStaffOpen] = useState(false);
  const [incidentTypeOpen, setIncidentTypeOpen] = useState(false);

  const handleClose = () => {
    setStaffOpen(false); 
    setIncidentTypeOpen(false); 

  };
  useEffect(() => {

    if(!participantId){
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
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setStaffList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }


  const getIncidentType = async()=>{
  let endpoint = 'getAll?table=report_incidet_type&select=report_incidet_id,report_incidet_name,';
  
    let response =await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setIncidentTypeLi(res.messages)
  // console.log(res);
    }
  
  }
  useEffect(() => {
    getIncidentType()
    getStaff();
    getRole();
  }, [])

  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname= convert?.stf_lastname
      // const combine =`${finalStaff} ${lname}`
      const id=convert?.stf_id
      console.log(id);
      setStaff([id])
     

    }
  }, [])
  const handleAdd = e => {
    e.preventDefault();
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
    if (!incidentType) {
      emptyFields.push('Incident type');
    }

    if (!description) {
      emptyFields.push('Description');
      
    } if (!eventsPrior) {
      emptyFields.push('Events prior to incident');
    }
    if (!actionsTakenStaff) {
      emptyFields.push('Actions taken by staff');
    }  
     if (!actionsTakenOther) {
      emptyFields.push('Actions taken by others');
    } 
      if (!anyOtherWitness) {
      emptyFields.push('Any other witness');
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

    const formData = new FormData();
    formData.append('incdnt_staff', staff);
    formData.append('incdnt_date', dateFormat);
    formData.append('incdnt_time', formattedTime);
    formData.append('incdnt_prtcpntid', participant);
    formData.append('incdnt_address', location);
    formData.append('incdnt_type',incidentType);
    formData.append('incdnt_descrptn',description);
    formData.append('incdnt_evntprior',eventsPrior);
    formData.append('incdnt_actnstf',actionsTakenStaff);
    formData.append('incdnt_actnother',actionsTakenOther);
    formData.append('incdnt_witns', anyOtherWitness);
    formData.append('created_at', currentTime); 
    formData.append('company_id', companyId); 

    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
  
  
   
    let endpoint = "insertReporting?table=fms_prtcpnt_incident";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check",data)
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
        <h1>Create Incident</h1>
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
          label="Time"
          onChange={(newValue) => {setTime(newValue) }}
         
        />
         </LocalizationProvider>
         <TextField
          value={location}
          
            label="Location"
            type="text"
            onChange={(e)=>{setLocation(e.target.value)}}
          />
        
        
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
                {selected?.map((value) => 
               {
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
              staffList?.map((item)=>{
             
                return(
                  <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

                )

              })
            }
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


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='incidentType'>Incident Type</InputLabel>
          <Select
            labelId='incidentType'
            id='incidentType'
            value={incidentType}
            label='Incident Type'
            open={incidentTypeOpen}
            onOpen={() => setIncidentTypeOpen(true)} 
            onClose={() => setIncidentTypeOpen(false)} 
            multiple 
            onChange={(e) => {
              setIncidentType(e.target.value);
              handleClose(); // Close the dropdown after selecting an item
            }}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected?.map((value) => 
               {
                const selectedPractitioner = incidentTypeLi.find(item => item?.report_incidet_id === value);
                // console.log(value);
                return (
                  <Chip
                  key={value}
                  label={selectedPractitioner?.report_incidet_name}
                  onDelete={() => handleDelete(value)} // Add onDelete function to remove the selected item
                  sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
                />
                
                )
                })}
              </div>
            )}
          >
            {
              incidentTypeLi?.map((item)=>{
             
                return(
                  <MenuItem key={item?.report_incidet_id} value={item?.report_incidet_id}>{item?.report_incidet_name}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>
        <TextField
          value={description}
            label="Description"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setDescription(e.target.value)}}
          />
            <TextField
          value={eventsPrior}
            label="Events prior to incident"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setEventsPrior(e.target.value)}}
          />
           <TextField
          value={actionsTakenStaff}
            label="Actions taken by staff "
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setActionsTakenStaff(e.target.value)}}
          /> <TextField
          value={actionsTakenOther}
            label="Actions taken by others"
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setActionsTakenOther(e.target.value)}}
          /> <TextField
          value={anyOtherWitness}
            label="Any other witness "
            type="text"
            multiline
            rows={5}
            onChange={(e)=>{setAnyOtherWitness(e.target.value)}}
          />

                <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple  listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>



          
          <Box sx={{width: '100ch',m:1}}>
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