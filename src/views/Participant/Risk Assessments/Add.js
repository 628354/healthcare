import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// css import 
// import '../../../../style/document.css'
import { Upload } from 'antd';
import dayjs from 'dayjs';
import { BASE_URL, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo';
// import { useSelector } from 'react-redux';
// import { UploadOutlined } from '@ant-design/icons';


const Add = ({setIsAdding,setShow }) => {

  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const currentDate = new Date()
  
  const [date, setDate] = useState('');
  const [participant, setParticipant] = useState('');
  const [participantList,setParticipantList]=useState([])
  const [levelOfRisk, setLevelOfRisk] = useState('');
  const [likelihood , setLikelihood] = useState('');
  const [consequences,setConsequences]=useState('');
  const [personOverseeing,setPersonOverseeing]=useState('');
  const [personOverseeingList,setPersonOverseeingList]=useState([]);
  const [riskDescription , setRiskDescription] = useState('');
  const [mitigationStrategy , setMitigationStrategy] = useState('');  
  const [monitoringStrategy , setMonitoringStrategy] = useState('');
  const [assessmentType , setAssessmentType] = useState('');
  const [nextReviewDate, setNextReviewDate] = useState('')
  const [attachment, setAttachment] = useState([]);

 const minSelectableDate = dayjs(date).add(1, 'day');

  useEffect(()=>{
    const oversee=localStorage.getItem('user')

  if (oversee) {
    const convert=JSON.parse(oversee)
    const finalStaff=convert?.stf_id;
    setPersonOverseeing(finalStaff);
  }

    
  },[])
  
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
// get oversee

const getOversee= async()=>{
  try {
    let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
    if(response.status) {  
      setPersonOverseeingList(response.messages)
     
    } else {
      throw new Error('Network response was not ok.')
    }
  } catch (error) {
    console.error('Error fetching staff data:', error)
    // Handle the error as needed, such as showing a message to the user.
  }
}

useEffect(()=>{
getRole();
getOversee()
},[])



const handleChange = (e) => {
  const files = e.fileList;
  console.log(files);
  const fileList = [];
  for (let i = 0; i < files.length; i++) {
    fileList.push(files[i].originFileObj);
  }
  setAttachment(fileList);
};



  const handleAdd = e => {
    e.preventDefault();
   
    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
    if (!levelOfRisk) {
      emptyFields.push('Time');
    }
    if (!likelihood) {
      emptyFields.push('Subject');
    }
    if (!consequences) {
      emptyFields.push('Participant');
    }
    if (!personOverseeing) {
      emptyFields.push('person Overseeing');
    }
    if (!participant) {
      emptyFields.push('participant');
    }
    if (!riskDescription) {
      emptyFields.push('risk Description');
    } if (!mitigationStrategy) {
      emptyFields.push('mitigation Strategy');
    } if (!monitoringStrategy) {
      emptyFields.push('monitoring Strategy');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const checkStartDate = dayjs(`${date}` );

    const checkNextDate = dayjs(`${nextReviewDate}`);
  if(checkNextDate.isBefore(checkStartDate)){
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: ' Next Review Date cannot be less than start date.',
        showConfirmButton: true
      });
    }
const formattedDate = dayjs(date).format('YYYY-MM-DD'); 
const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');
 
    
 
    const formData = new FormData();
    formData.append('rsk_date', formattedDate);
    formData.append('rsk_level', levelOfRisk);
    formData.append('rsk_prtcpntid', participant);
    formData.append('rsk_lvlihod', likelihood);
    formData.append('rsk_consqnces', consequences);
    formData.append('rsk_ovrsee',personOverseeing);
    formData.append('rsk_dscrptn',riskDescription);
    formData.append('rsk_mitistrgy', mitigationStrategy);
    formData.append('rsk_monistrgy', monitoringStrategy);
    formData.append('rsk_asstyp',assessmentType);
    formData.append('rsk_rvudate',formattedNextDate);
    formData.append('company_id',companyId);
    formData.append('created_at', currentTime);

    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
    
    let endpoint = 'insertMedia?table=fms_riskAssessment';
    let response = COMMON_UPDATE_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(false);
          }else{
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
         <h1>Create Participant Risk Assessment</h1>

         <LocalizationProvider dateAdapter={AdapterDayjs}   >
          <DatePicker label="Date" format='DD/MM/YYYY'  minDate={dayjs(currentDate)} onChange={(newValue) => {setDate(newValue) }} />
        </LocalizationProvider>
     
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='setType'>Level of risk</InputLabel>
          <Select
            labelId='Levelofrisk '
            id='Levelofrisks'
            value={levelOfRisk}
            label='Level of risk'
            onChange={e => setLevelOfRisk(e.target.value)}
          >  <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>

          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='setType'>Likelihood</InputLabel>
          <Select
            labelId='Likelihood'
            id='Likelihoods'
            value={likelihood}
            label='Likelihood'
            onChange={e => setLikelihood(e.target.value)}
          >  <MenuItem value="Rare">Rare</MenuItem>
          <MenuItem value="Unlikely">Unlikely</MenuItem>
          <MenuItem value="Possible">Possible</MenuItem>
          <MenuItem value="Likely">Likely</MenuItem>
          <MenuItem value="Almost Certain">Almost Certain</MenuItem>


          </Select>
        </FormControl>
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='setType'>Consequences</InputLabel>
          <Select
            labelId='Consequences '
            id='Consequence'
            value={consequences}
            label='Consequences'
            onChange={e => setConsequences(e.target.value)}
          >  <MenuItem value="Minimal">Minimal</MenuItem>
          <MenuItem value="Minor">Minor</MenuItem>
          <MenuItem value="Moderate">Moderate</MenuItem>
          <MenuItem value="Significant">Significant</MenuItem>
          <MenuItem value="ASevere">Severe</MenuItem>


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
          <InputLabel id='PersonOverseeing'>Person overseeing</InputLabel>
          <Select
            labelId='PersonOverseeings'
            id='Personoverseeing'
            value={personOverseeing}
            label='Person Overseeing'
            onChange={e => setPersonOverseeing(e.target.value)}
          >
            {
              personOverseeingList?.map((item)=>{
             
                return(
                
                  <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

                )

              })
            }
          </Select>
        </FormControl>

        <TextField
         
          required
          label='Risk description'
          value={riskDescription}
          onChange={e => {
            setRiskDescription(e.target.value)
          }}
        />
         <TextField
          
          required
          label='Mitigation strategy'
          value={mitigationStrategy}
          onChange={e => {
            setMitigationStrategy(e.target.value)
          }}
        />


        <TextField
          
          required
          label='Monitoring strategy'
          value={monitoringStrategy}
          onChange={e => {
            setMonitoringStrategy(e.target.value)
          }}
        />
<FormControl  sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='setType'>Assessment type</InputLabel>
          <Select
            labelId='Assessmenttype '
            id='AssessmenTtype'
            value={assessmentType}
            label='Assessment type'
            onChange={e => setAssessmentType(e.target.value)}
          >  <MenuItem value="Environmental Risk">Environmental Risk</MenuItem>
          <MenuItem value="Participant Risk">Participant Risk</MenuItem>

          </Select>
        </FormControl>

     
       
		
<LocalizationProvider dateAdapter={AdapterDayjs}  sx={{ width: '50ch', m: 1 }}>
            <DatePicker label="Next review date"  format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)}  onChange={(newValue)=>{setNextReviewDate(newValue)}} />
          </LocalizationProvider>
			
          <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
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

