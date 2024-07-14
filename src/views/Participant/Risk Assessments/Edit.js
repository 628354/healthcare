import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
// import '../../../../style/document.css'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import Select from '@mui/material/Select'
import { Upload } from 'antd'
import '../../../style/document.css'

import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { BASE_URL, COMMON_GET_PAR,COMMON_GET_FUN , COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST, IMG_BASE_URL } from 'helper/ApiInfo'

import { Card, CardContent,Typography } from '@mui/material'  
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

const Edit = ({ selectedRisk, setIsEditing,setShow}) => {
  const id = selectedRisk.rsk_id;   
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [date, setDate] = useState(selectedRisk.rsk_date? dayjs(selectedRisk.rsk_date): null);
  const [participant, setParticipant] = useState(selectedRisk.rsk_prtcpntid);
  const [participantList,setParticipantList]=useState([])
  const [levelOfRisk, setLevelOfRisk] = useState(selectedRisk.rsk_level);
  const [likelihood , setLikelihood] = useState(selectedRisk.rsk_lvlihod);
  const [consequences,setConsequences]=useState(selectedRisk.rsk_consqnces);
  const [personOverseeing,setPersonOverseeing]=useState(selectedRisk.rsk_ovrsee);
  const [personOverseeingList,setPersonOverseeingList]=useState([]);
  const [riskDescription , setRiskDescription] = useState(selectedRisk.rsk_dscrptn);
  const [mitigationStrategy , setMitigationStrategy] = useState(selectedRisk.rsk_mitistrgy);  
  const [monitoringStrategy , setMonitoringStrategy] = useState(selectedRisk.rsk_monistrgy);
  const [assessmentType , setAssessmentType] = useState(selectedRisk.rsk_asstyp);
  const [nextReviewDate, setNextReviewDate] = useState(selectedRisk.rsk_rvudate === "0000-00-00"? '':selectedRisk.rsk_rvudate)
  const [attachment, setAttachment] = useState(selectedRisk.image_data);

  const minSelectableDate = dayjs(date).add(1, 'day');

  const[newImage,setNewImage]=useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
 
  const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)
 

useEffect(() => {

  // if(show){
    setShow(true)
  return () => setShow(false)

  // }
  
}, [setShow])

useEffect(() => {
  if (selectedRisk) {
    const updateData = selectedRisk && selectedRisk.updated_at

    if (updateData) {
      const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
      const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = updateTime.substr(0, 5);
      const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
      setUpdateDate(final)
    }
    const createData = selectedRisk.created_at

    if (createData) {
      const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
      const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
      const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
      const formattedCreateTime = createTime.substr(0, 5);
      const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
      setCreateDate(final)
    }
  }
}, [selectedRisk]);

  const handleClickImage = (index) => {
    setSelectedImage(index);
  };
  const handleDownloadImage = (fileName) => {
    
    const imageUrl = `https://tactytechnology.com/mycarepoint/upload/admin/users/${fileName.image}`;
    const fileName2= imageUrl.split("/").pop();
    console.log(fileName2);
    const aTag =document.createElement('a')
    aTag.href=imageUrl
    aTag.setAttribute("download",fileName.image)
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();


  
};

  const handleViewImage = (fileName) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setNewImage(fileList);
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
  
  

 
  const handleUpdate = e => {
    e.preventDefault()

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
      emptyFields.push('Satff');
    }
    if (!participant) {
      emptyFields.push('Satff');
    }
    if (!riskDescription) {
      emptyFields.push('Satff');
    } if (!mitigationStrategy) {
      emptyFields.push('Satff');
    } if (!monitoringStrategy) {
      emptyFields.push('Satff');
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
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const newdateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null


   
    const formData = new FormData();
    formData.append('rsk_date', dateFormat);
    formData.append('rsk_level', levelOfRisk);
    formData.append('rsk_prtcpntid', participant);
    formData.append('rsk_lvlihod', likelihood);
    formData.append('rsk_consqnces', consequences);
    formData.append('rsk_ovrsee',personOverseeing);
    formData.append('rsk_dscrptn',riskDescription);
    formData.append('rsk_mitistrgy', mitigationStrategy);
    formData.append('rsk_monistrgy', monitoringStrategy);
    formData.append('rsk_asstyp',assessmentType);
    formData.append('rsk_rvudate',newdateFormat);
    formData.append('updated_at', currentTime);

    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = 'updateParticipant?table=fms_riskAssessment&field=rsk_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      // console.log(data,"hbhjjk");
      //return data;
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
 const handleDeleteImage = (id,index) => {
    console.log(index);
    console.log(id);
    const updatedAttachment = attachment.filter((_, i) => i !== index);
    setAttachment(updatedAttachment); // Update attachment state
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.value) {
        
        let endpoint = 'deleteSelected?table=fms_participant_media&field=media_id&id=' + id
        let response = COMMON_GET_FUN(BASE_URL, endpoint)
        console.log(response);
        response.then(data => {
          if (data.status) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `Record data has been deleted.`,
              showConfirmButton: false,
              timer: 1500
            })
           
          }
        })

    
      }
    })
  }
  return (

    <>
   <div className="small-container">

<Box
  component="form"
 
  sx={{
    '& .MuiTextField-root': { m: 1, width: '50ch' },
    //bgcolor:'#FFFFFF'
  }}
  noValidate
  autoComplete="off"
  onSubmit={handleUpdate}
>
   <h1>Edit Participant Risk Assessment</h1>

   <LocalizationProvider dateAdapter={AdapterDayjs}   >
    <DatePicker label="Date" value={dayjs(date)} format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} />
  </LocalizationProvider>

  <FormControl   sx={{ width: '50ch', m: 1 }} required>
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

  <FormControl  sx={{ width: '50ch', m: 1 }} required>
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
  <FormControl  sx={{ width: '50ch', m: 1 }} required>
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
  
  
  <FormControl  sx={{ width: '50ch', m: 1 }} required>
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
  <FormControl  sx={{ width: '50ch', m: 1 }} required>
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
<FormControl   sx={{ width: '50ch', m: 1 }} required>
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


 

<LocalizationProvider dateAdapter={AdapterDayjs}   >
      <DatePicker label="Next review date" value={dayjs(nextReviewDate)} minDate={dayjs(minSelectableDate)}  format='DD/MM/YYYY' onChange={(newValue)=>{setNextReviewDate(newValue)}} />
    </LocalizationProvider>


   
 
    <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
<Button size='small'>Click here or Drag and drop a file in this area</Button>
</Upload>

  <div className='cus_parent_div' style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

{Array.isArray(attachment) && attachment.map((fileName, index) => {
console.log(fileName);
const nameOfFile = fileName?.image?.replace(/\d+/g, '')
return (
<div className='cus_child_div' key={index} style={{ width: '180px', position: 'relative' }}>
{fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ? (

<div className='ddf' onClick={() => handleClickImage(index)}  ><p style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' ,textAlign:"center"}} className="Cus_file_Txt">
  {nameOfFile}
</p></div>
) : (
<img
  src={`${IMG_BASE_URL}${fileName.image}`}
  alt='Attachment Preview'
  style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
  onClick={() => handleClickImage(index)}
/>
)}
{selectedImage === index && (
<>
  {fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ?
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
      <DeleteIcon onClick={() => handleDeleteImage(fileName.media_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
      <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
    </div> :
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
      <DeleteIcon onClick={() => handleDeleteImage(fileName.media_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
      <VisibilityIcon onClick={() => handleViewImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }} />
      <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
    </div>

  }

</>


)}
</div>

)
})}
{showModal && (
<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
<img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
<button onClick={handleCloseModal} style={{ marginTop: '10px' }}>Close</button>
</div>
</div>
)}

</div>

    
    
    <Box sx={{width: '100ch',m:1}}>
        <Stack direction="row-reverse"
              spacing={2}>
          <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
          <Button variant="outlined" type="submit" >Submit</Button>
          
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
