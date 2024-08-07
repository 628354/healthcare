import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
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
import Chip from '@mui/material/Chip';
import { IMG_BASE_URL ,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import AuthContext from 'views/Login/AuthContext';

const Edit = ({ selectedData, setIsEditing, allowPre,setShow,show,participantId}) => {

  const {companyId}=useContext(AuthContext)
const converData=JSON.parse(selectedData.prgs_actvty)
  const id = selectedData.prgs_id;
  const [date, setDate] = useState(selectedData.prgs_date? dayjs(selectedData.prgs_date): null)
  const [startTime, setstartTime] = useState(selectedData.prgs_strttime ? dayjs(selectedData.prgs_strttime, 'HH:mm') : null);
  const [endTime, setEndTime] = useState(selectedData.prgs_endtime ? dayjs(selectedData.prgs_endtime, 'HH:mm') : null);
  
  const [staff, setStaff] = useState(selectedData.prgs_staff.split(','));
  const[staffList,setStaffList]=useState([])

  const [participant, setParticipant] = useState(selectedData.prgs_prtcpntid);
  const [participantList,setParticipantList]=useState([])
  const [notes,setNotes]=useState(selectedData.prgs_note)
  const [activities, setActivities] = useState(JSON.parse(selectedData?.prgs_actvty) || []);

  const [attachment, setAttachment] = useState(selectedData.image_data);
const[newImage,setNewImage]=useState([])
const [selectedImage, setSelectedImage] = useState(null);
const [showModal, setShowModal] = useState(false);
// const [employees, setEmployees] = useState([]);
const [staffOpen, setStaffOpen] = useState(false);
const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)

const [totalKm, setTotalKm] = useState(selectedData.total_km);
const [vehicle , setVehicle ] = useState(selectedData.vehicle)

  const handleClose = () => {
    setStaffOpen(false);
 

  };
  const isFutureDate = (date) => {
    return dayjs(date).isAfter(dayjs().startOf('day'));
  };
  useEffect(() => {
    if (selectedData) {
      const updateData = selectedData && selectedData.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedData.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedData]);
  
  
  const handleDeleteImage = (id,index) => {
    //console.log(index);
    //console.log(id);
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
        //console.log(response);
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
  
   
    const handleCloseModal = () => {
      setShowModal(false)
    }
  
  
    const handleChange = (e) => {
      const files = e.fileList;
      //console.log(files);
      const fileList = [];
      for (let i = 0; i < files.length; i++) {
        fileList.push(files[i].originFileObj); 
      }
      setNewImage(fileList);
    };
  useEffect(() => {
    if(!participantId){
      setShow(true)
    return () => setShow(false)
  
    }
    
  }, [setShow])

  const getRole = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant+companyId)
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
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
      if(response.status) {  
        setStaffList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }

useEffect(() => {
  getStaff();
  getRole();
}, [])

const handleDynamicFieldChange = (fieldId, value, label) => {
  setActivities(prevActivities => {
    return prevActivities.map(activity => {
      if (activity.fieldId === fieldId) {
        return {
          ...activity,
          value: value,
          label: label
        };
      }
      return activity;
    });
  });
};



  const handleUpdate = (e) => {
    e.preventDefault();
    const emptyFields = [];

    if (!date || isFutureDate(date)) {
      emptyFields.push('Date (must not be in the future)');
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
    const customFieldData = Object.keys(activities).map(key => ({
      fieldId: key,
      value: activities[key].value,
      label: activities[key].name
    }));
    const customFieldJson = JSON.stringify(customFieldData);
    const formData = new FormData();
    formData.append('prgs_staff', staff);
    formData.append('prgs_date', dateFormat);
    formData.append('prgs_strttime', formattedTime);
    formData.append('prgs_prtcpntid', participant);
    formData.append('prgs_endtime', formattedEndTime);
    formData.append('prgs_note',notes);
    formData.append('prgs_actvty',customFieldJson);
    formData.append('updated_at', currentTime);
    formData.append('total_km', totalKm);
    formData.append('vehicle', vehicle);

  
    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

  

    let endpoint = 'updateReporting?table=fms_prtcpnt_prgsnote&field=prgs_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
   
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
        <h1>Edit Shift Progress Notes</h1>
        <Box className="obDiv">
<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Date" format='DD/MM/YYYY' onChange={(newValue) => {setDate(newValue) }} value={date} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
        value={startTime}
          label="Start Time"
          onChange={(newValue) => {setstartTime(newValue) }}
         
        />
         </LocalizationProvider>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
        value={endTime}
          label="End Time"
          onChange={(newValue) => {setEndTime(newValue) }}
         
        />
         </LocalizationProvider>

</Box>
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
              handleClose(); // Close the dropdown after selecting an item
            }}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected?.map((value) => 
               {
                const selectedPractitioner = staffList.find(item => item?.stf_id === value);
                // //console.log(value);
                return (
                  <Chip
                  key={value}
                  label={selectedPractitioner?.stf_firstname}
                  onDelete={() => handleDelete(value)} // Add onDelete function to remove the selected item
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
        <TextField
           
           value={totalKm}
           label="Total K.M."
           type="text"
           onChange={(e) => { setTotalKm(e.target.value) }}
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
            onChange={(e)=>{setNotes(e.target.value)}}
          />
      
 
  {activities.map((data, index) => {
          //console.log(data);
  return (
    <TextField
      key={data.fieldId}
      // value={data.value || ''}
      value={data.value}
      label={data.label}
      type="text"
      multiline
      rows={5}
      onChange={(e) => handleDynamicFieldChange(data.fieldId, e.target.value, data.label)}
    />
  );
})}
           

           <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
        <Button size='small'>Click here or Drag and drop a file in this area</Button>
      </Upload>

      <div className='cus_parent_div' style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

{Array.isArray(attachment) && attachment.map((fileName, index) => {
  //console.log(fileName);
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
{showModal && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
      <img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
      <button onClick={handleCloseModal} style={{ marginTop: '10px' }}>Close</button>
    </div>
  </div>
)}

</div>


        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
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
