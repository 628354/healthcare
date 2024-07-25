import React, {useEffect, useState } from 'react'
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
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import { MenuItem } from '@mui/material'
import { BASE_URL, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'

const Add = ({ setIsAdding,setShow}) => {
const oversee=localStorage.getItem('user')
const convert=JSON.parse(oversee)
console.log(convert);
const finalOversee=convert;

const [startDate, setStartDate] = useState('')
const [endDate, setEndDate] = useState('')
const [nextReviewDate, setNextReviewDate] = useState('')
const [participant, setParticipant] = useState('')
const [participantList,setParticipantList]=useState([])
const [documentedBy, setDocumentedBy] = useState({ id: '', name: '' });
const [medicationName, setMedicationName] = useState('')
const [administrationType, setAdministrationType] = useState('')
const [dosage, setDosage] = useState('')
const [frequency, setFrequency] = useState('')
const [isPrescribed, setIsPrescribed] = useState('')
const [notes, setNotes] = useState('')

const [administrationList,setAdminstrationList]=useState([])
    const [isPrescribedList,setIsPrescribedList]=useState([])

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const currentDate = new Date()

    useEffect(() => {

      // if(show){
        setShow(true)
      return () => setShow(false)
    
      // }
      
    }, [setShow])

  const handleAdd = e => {
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

    const checkStartDate = dayjs(`${startDate}` );

    const checkNextDate = dayjs(`${endDate}`);
  if(checkNextDate.isBefore(checkStartDate)){
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: ' Next Review Date cannot be less than start date.',
        showConfirmButton: true
      });
    }
    const formattedstartDate = dayjs(startDate).format('YYYY-MM-DD'); 
    const formatteddueDate = dayjs(endDate).format('YYYY-MM-DD');
    const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');
   
    


    const data = {
  
mreg_prtcpntid:participant,
mreg_stfid:documentedBy?.id,
mreg_strtdate:formattedstartDate,
mreg_enddate:formatteddueDate,
mreg_rvudate:formattedNextDate,
mreg_mediname:medicationName,
mreg_admtype:administrationType,
mreg_dosge:dosage,
mreg_freq:frequency,
mreg_pres:isPrescribed,
mreg_note:notes,
company_id:companyId,
created_at:currentTime


    }

    //function to generateToken

    // console.log(data);

    /* employees.push(newEmployee);
    localStorage.setItem('employees_data', JSON.stringify(employees));
    setEmployees(employees); 
    setIsAdding(false); */
    //let url = process.env.REACT_APP_BASE_URL;

    let endpoint = 'insertData?table=fms_medication_Register'
    console.log(data);
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data)
    response.then(data => {
      // console.log(data)
      //return data;
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

  
  // get user role

  const getRole = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching Participant data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }
    const getStaff= async()=>{
      let endpoint = 'getAll?table=fms_staff_detail&select=stf_id,stf_firstname,stf_lastname';


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
        const matchStaff = res?.messages.find((item)=>item.stf_id === convert.stf_id)
        console.log(matchStaff);
        if(matchStaff){
          setDocumentedBy({ id: matchStaff.stf_id, name: `${matchStaff.stf_firstname} ${matchStaff.stf_lastname}` });
        }
        // setParticipantList(res.messages)
  // console.log(res);
      }

    }
    const getAdminstrationType= async()=>{
      let endpoint = 'getAll?table=administration_type&select=administration_type_id,administration_type_name';


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
        setAdminstrationList(res.messages)
  // console.log(res);
      }

    }
    const getIsprescribedName= async()=>{
      let endpoint = 'getAll?table=is_prescribed&select=is_prescribed_id,is_prescribed_name';


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
        setIsPrescribedList(res.messages)
  // console.log(res);
      }

    }

  useEffect(()=>{
    getRole();
    getAdminstrationType();
    getIsprescribedName();
    getStaff();
  },[])


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
        <h1 style={{ fontSize: '1.285rem', fontWeight: '500', paddingLeft: '8px' }}>Create A Record</h1>
        
        <Box sx={{width:"100%"}}>

        <div style={{ display: 'flex', gap: '10px',width:"96%",marginTop:"14px"}}>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker label="Start date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)} onChange={(newValue)=>{setStartDate(newValue)}} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="End date"  minDate={dayjs(startDate)}  format='DD/MM/YYYY' onChange={(newValue)=>{setEndDate(newValue)}} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Next review date"  format='DD/MM/YYYY'  minDate={dayjs(startDate)} onChange={(newValue)=>{setNextReviewDate(newValue)}} />
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
              participantList?.map((item)=>{
             
                return(
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
            value={documentedBy.id}
            label='Documented By'
            onChange={e => setDocumentedBy({ id: e.target.value, name: e.target.options[e.target.selectedIndex].text })}
          >
            {
            console.log('doc data',documentedBy)}
               {documentedBy.name && <MenuItem value={documentedBy.id}>{documentedBy.name}</MenuItem>}
             
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
      <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}required>
          <InputLabel id='setType'>Administration Type</InputLabel>
          <Select
            labelId='AdministrationType'
            id='AdministrationType'
            value={administrationType}
            label='AdministrationType'
            onChange={e => setAdministrationType(e.target.value)}
          >   {
            administrationList?.map((item)=>{
           
              return(
                <MenuItem key={item?.administration_type_id} value={item?.administration_type_id}>{item?.administration_type_name}</MenuItem>

              )

            })
          }

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
    {
            isPrescribedList?.map((item)=>{
           
              return(
                <MenuItem key={item?.is_prescribed_id} value={item?.is_prescribed_id}>{item?.is_prescribed_name}</MenuItem>

              )

            })
          }

  </Select>
</FormControl>

        <TextField
          required
          label='Notes'
          multiline
          rows={4}
          style={{ width: '50ch', m: 1 }}
          value={notes}
          onChange={e => {
            setNotes(e.target.value)
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
