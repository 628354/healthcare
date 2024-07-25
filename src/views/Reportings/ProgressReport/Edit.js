import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../../style/document.css'
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import Swal from 'sweetalert2';
import { Upload } from 'antd';
import { IMG_BASE_URL ,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import SummarizeIcon from '@mui/icons-material/Summarize';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const Edit = ({ selectedData, setIsEditing, allowPre,setShow }) => {
  // const currentDate = new Date();

  const id = selectedData.report_id;
  const [date, setDate] = useState(selectedData.start_date? dayjs(selectedData.start_date): null)
  const [endDate, setEndDate] = useState(selectedData.end_date? dayjs(selectedData.end_date): null)

  const [documentOn, setDocumentOn] = useState(selectedData.documented_on? dayjs(selectedData.documented_on): null)

  const [staff, setStaff] = useState(selectedData.staff_id);
  const[staffList,setStaffList]=useState([])

  const [participant, setParticipant] = useState(selectedData.participant_id);
  const [participantList,setParticipantList]=useState([])

  const [progressNotes , setProgressNotes] = useState(selectedData.progress_notes);
  const [behaviourOfConcerns , setBehaviourOfConcerns] = useState(selectedData.behaviour_of_concerns)
  const [diet, setDiet ] = useState(selectedData.diet)

  const [fluids ,setFluids ]=useState(selectedData.fluids)
  const [activities , setActivities ] = useState(selectedData.activities);
  const [chokingObservations,setChokingObservations]=useState(selectedData.choking_observations)
  const [appointments,setAppointment]=useState(selectedData.appointments)
  const [staffId,setStaffId]=useState(null)

  const [staffAdministered ,setStaffAdministered]=useState(selectedData.staff_administered)
  const [ndisGoal ,setNdisGoal]=useState(selectedData.ndsi_goal_setting)

  const [independentS ,setIndependentS]=useState(selectedData.independent_skills)

  const [communityAccess ,setCommunityAccess]=useState(selectedData.community_access)

 
  const [attachment, setAttachment] = useState(selectedData.image_data);
const[newImage,setNewImage]=useState([])
const [selectedImage, setSelectedImage] = useState(null);
const [showModal, setShowModal] = useState(false);
const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)

  const [startIndex, setStartIndex] = useState(0);

   const moveLeft = (e) => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 4);
    }
  };

  const moveRight = (e) => {

    if (startIndex + 4 < attachment.length) {
      setStartIndex(prev => prev + 4);
    }
  };

useEffect(() => {
  if (selectedData) {
    const updateData = selectedData && selectedData.updated_at

    if (updateData) {
      const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
      const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = updateTime.substr(0, 5);
      const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
      setUpdateDate(final)
    }
    const createData = selectedData.created_at

    if (createData) {
      const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
      const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
      const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
      const formattedCreateTime = createTime.substr(0, 5);
      const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
      setCreateDate(final)
    }
  }
}, [selectedData]);


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
      
      let endpoint = 'deleteSelected?table=fms_reporting_media&field=report_id&id=' + id
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


  const handleClickImage = index => {
    console.log(index);
    setSelectedImage(index)
  }

  const handleDownloadImage = fileName => {
    const link = document.createElement('a')
    link.href = `${IMG_BASE_URL}${fileName?.image}`
    link.download = fileName?.image
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const handleViewImage = (fileName) => {
    setShowModal(true);
  };

 
  const handleCloseModal = (e) => {
    setShowModal(false)
  }


  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setNewImage(fileList);
  };


 useEffect(() => {
  setShow(true);
  return () => setShow(false); 
}, [setShow]);

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
    let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
    if(response.status) {  
      setStaffList(response.messages)
     
    } else {
      throw new Error('Network response was not ok.')
    }
  } catch (error) {
    console.error('Error fetching staff data:', error)
  }
}

useEffect(() => {
  getStaff();
  getRole();
}, [])

 useEffect(() => {
  setShow(true);
  return () => setShow(false); 
}, [setShow]);




  const handleUpdate = (e) => {
    e.preventDefault();
    const emptyFields = [];
    if (!date) {
      emptyFields.push('Start Date');
    }
    if (!endDate) {
      emptyFields.push('End date');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    } if (!progressNotes) {
      emptyFields.push('Progress notes');
    }
    if (!behaviourOfConcerns) {
      emptyFields.push('Behaviour of concerns');
    }

    if (!diet) {
      emptyFields.push('Diet ');
      
    } if (!fluids) {
      emptyFields.push('Fluids');
    }
    if (!activities) {
      emptyFields.push('Activities');
    }
    if (!documentOn) {
      emptyFields.push('Documented on');
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
    const nextDate = endDate ? endDate.format('YYYY-MM-DD') : null
    const documentOnF = documentOn ? documentOn.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();
    formData.append('staff_id', staff);
    formData.append('start_date', dateFormat);
    formData.append('end_date', nextDate);
    formData.append('participant_id', participant);
    formData.append('documented_on', documentOnF);
    formData.append('progress_notes', progressNotes);
    formData.append('behaviour_of_concerns',behaviourOfConcerns);
    formData.append('diet',diet);
    formData.append('fluids',fluids);
    formData.append('activities',activities);
    formData.append('choking_observations', chokingObservations);
    formData.append('appointments',appointments);
    formData.append('staff_administered', staffAdministered);
    formData.append('ndsi_goal_setting',ndisGoal);
    formData.append('independent_skills', independentS);
    formData.append('community_access', communityAccess);
    formData.append('updated_at', currentTime);



    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

  

    let endpoint = 'updateReporting?table=fms_progress_report&field=report_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      // console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        });
      }
    });
  };


  return (

    <>
        <div className="small-container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleUpdate}
      >
        <h1>Edit Progress Report</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Start Date'
            value={date}
            format='DD/MM/YYYY'
          
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>
       
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='End Date'
            format='DD/MM/YYYY'
            value={endDate}

            minDate={dayjs(date)}
            onChange={newValue => {
              setEndDate(newValue)
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Document On'
            format='DD/MM/YYYY'
            value={documentOn}

           
            onChange={newValue => {
              setDocumentOn(newValue)
            }}
          />
        </LocalizationProvider>
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
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
          {staffList?.map(item => {
              return (
                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                  {item?.stf_firstname} {item?.stf_lastname}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

      
        <TextField
          value={progressNotes}
          multiline
          rows={4}
            label="Progress Notes"
            type="text"
            onChange={(e)=>{setProgressNotes(e.target.value)}}
          />
          
         
		<TextField
          value={behaviourOfConcerns}
            multiline
            rows={4}
            label="Behaviour of concerns "
            type="text"
            onChange={(e)=>{setBehaviourOfConcerns(e.target.value)}}
          />
          <TextField
          value={diet}
            multiline
            rows={4}
            label="Diet"
            type="text"
            onChange={(e)=>{setDiet(e.target.value)}}
          />
           <TextField
          value={fluids}
            multiline
            rows={4}
            label="Fluids"
            type="text"
            onChange={(e)=>{setFluids(e.target.value)}}
          />
           <TextField
          value={activities}
            multiline
            rows={4}
            label="Activities"
            type="text"
            onChange={(e)=>{setActivities(e.target.value)}}
          />
           <TextField
          value={chokingObservations}
            multiline
            rows={4}
            label="Choking observations"
            type="text"
            onChange={(e)=>{setChokingObservations(e.target.value)}}
          />
           <TextField
          value={appointments}
            multiline
            rows={4}
            label="Appointments or Family visits"
            type="text"
            onChange={(e)=>{setAppointment(e.target.value)}}
          />
          <TextField
          value={staffAdministered}
            multiline
            rows={4}
            label="Staff administered medication"
            type="text"
            onChange={(e)=>{setStaffAdministered(e.target.value)}}
          />

<TextField
          value={ndisGoal}
            multiline
            rows={4}
            label="NDIS goal setting"
            type="text"
            onChange={(e)=>{setNdisGoal(e.target.value)}}
          />

<TextField
          value={independentS}
            multiline
            rows={4}
            label="Independent skills"
            type="text"
            onChange={(e)=>{setIndependentS(e.target.value)}}
          />

<TextField
          value={communityAccess}
            multiline
            rows={4}
            label="Community access"
            type="text"
            onChange={(e)=>{setCommunityAccess(e.target.value)}}
          />


<Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
        <Button size='small'>Click here or Drag and drop a file in this area</Button>
      </Upload>

    {attachment.length>0?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <ArrowBackIosIcon className="slider_btns"onClick={moveLeft} type='button' disabled={startIndex === 0} />
        <div className='testt' style={{ display: 'flex',gap:"15px",width:'100%', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        {Array.isArray(attachment) && attachment.slice(startIndex, startIndex + 4).map((fileName, index) => {
          console.log(fileName);
          const nameOfFile = fileName?.image?.replace(/\d+/g, '');

          return (
            <div className='cus_child_div' key={index} style={{ width: '200px', position: 'relative' }}>
              {fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ? (
        
                <div className='ddf' onClick={() => handleClickImage(index)}  >
                  
                  <p style={{ alignContent:'center',width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' ,textAlign:"center"}} className="Cus_file_Txt">
                
                <SummarizeIcon sx={{fontSize:'30px'}}/><br/>
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
                      <DeleteIcon onClick={() => handleDeleteImage(fileName.report_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
                      <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
                    </div> :
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
                      <DeleteIcon onClick={() => handleDeleteImage(fileName.report_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
                      <VisibilityIcon onClick={() => handleViewImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }} />
                      <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
                    </div>
        
                  }
        
                </>
        
        
              )}
            </div>
        
          )
        })}
        </div>
       <ArrowForwardIosIcon className="slider_btns"onClick={moveRight}  type='button'  disabled={startIndex + 4 >= attachment.length}/>
      </div>:""}  

      {showModal && ( 
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
      <img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
      <button type='button' onClick={handleCloseModal} style={{ marginTop: '10px' }}>Close</button>
    </div>
  </div>
)}
    
  
    




        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse">
            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </Button>
            {allowPre.edit ? (
              <Button variant="outlined" type="submit">
                Update
              </Button>
            ) : (
              ''
            )}
          </Stack>
        </Box>
      </Box>
    </div>
    
    
    <Card className='update_card' >
        <CardContent className='updateChild' >
          <div className="uppercase">
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>

  );
};

export default Edit;
