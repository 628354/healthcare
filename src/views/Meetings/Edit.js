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
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { IMG_BASE_URL,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN} from '../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import Swal from 'sweetalert2';
import { Upload } from 'antd';

const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {
  // const currentDate = new Date();
  console.log(selectedData);
  const id = selectedData.meet_id;
  const [date, setDate] = useState(selectedData.meet_date ? dayjs(selectedData.meet_date) : dayjs())
  const [startTime, setStartTime] = useState(selectedData.meet_strttime)
  const [endTime, setEndTime] = useState(selectedData.meet_endtime)
  const [staff, setStaff] = useState(selectedData.meet_stfid)

  const [meetingType, setMeetingType] = useState(selectedData.meet_meettype)
  const [location, setLocation] = useState(selectedData.meet_location)

  const [purpose, setPurpose] = useState(selectedData.meet_prpose)
  const [attendees, setAttendees] = useState(selectedData.meet_attend)
  const [apologies, setApologies] = useState(selectedData.meet_apologs)
  const [staffList, setStaffList] = useState([])

  const [agenda, setAgenda] = useState(selectedData.meet_agenda)
  const [discussion, setDiscussion] = useState(selectedData.meet_discus)
  const [action, setAction] = useState(selectedData.meet_acton)

  const [typeList, setTypeList] = useState([])
  const [newImage, setNewImage] = useState([])

  const [attachment, setAttachment] = useState(selectedData.image_data)
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  
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

const handleCloseModal =() => {
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
        
        let endpoint = 'deleteSelected?table=fms_meeting_media&field=meeting_id&id=' + id
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
  const getType = async () => {
    try {
      let endpoint = 'getAll?table=meeting_type&select=meeting_type_id,meeting_type_name'

      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const res = await response.json()
        setTypeList(res.messages)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }



  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, [setShow]);



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
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  useEffect(() => {
    getType();
    getStaff();
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
    if (!startTime) {
      emptyFields.push('Start Time');
    } 
    if (!endTime) {
      emptyFields.push('End Time');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!meetingType) {
      emptyFields.push('Meeting Type');
    }
    if (!location) {
      emptyFields.push('Location');
    }if (!purpose) {
      emptyFields.push('Purpose');
    }if (!attendees) {
      emptyFields.push('Attendees ');

    }if (!apologies) {
      emptyFields.push('Apologies');
    }
    if (!agenda) {
      emptyFields.push('Agenda');
    }if (!discussion) {
      emptyFields.push('Discussion');
    }if (!action) {
      emptyFields.push('Action');
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
   
    const formattedDate = date ? date.format('YYYY-MM-DD') : null

    const timeStart = dayjs(startTime).format('HH:mm')
    const timeEnd = dayjs(endTime).format('HH:mm')

    const formData = new FormData()
    formData.append('meet_date', formattedDate)
    formData.append('meet_strttime', timeStart)
    formData.append('meet_endtime', timeEnd)
    formData.append('meet_stfid', staff)
    formData.append('meet_meettype', meetingType)
    formData.append('meet_location', location)
    formData.append('meet_prpose', purpose)
    formData.append('meet_attend', attendees)
    formData.append('meet_apologs', apologies)
    formData.append('meet_agenda', agenda)
    formData.append('meet_discus', discussion)
    formData.append('meet_acton', action)
    formData.append('updated_at', currentTime)

    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = 'updateMeeting?table=fms_meeting&field=meet_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
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
        <h1>Edit Meeting</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            // minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
            value={dayjs(date)}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label='Start Time'
            onChange={newValue => {
              setStartTime(newValue)
            }}
            value={dayjs(startTime, 'HH:mm')}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label='End Time'
            onChange={newValue => {
              setEndTime(newValue)
            }}
            value={dayjs(endTime, 'HH:mm')}

          />
        </LocalizationProvider>

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
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='type'>Meeting type</InputLabel>
          <Select
            labelId='Meetingtype'
            id='Meeting'
            value={meetingType}
            label='Meeting Type'
            onChange={e => setMeetingType(e.target.value)}
          >
            {typeList?.map(item => {
              return (
                <MenuItem key={item?.meeting_type_id} value={item?.meeting_type_id}>
                  {item?.meeting_type_name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <TextField
          value={location}
          multiline
          label='Location'
          type='text'
          onChange={e => {
            setLocation(e.target.value)
          }}
        />

        <TextField
          required
          value={purpose}
          multiline
          rows={4}
          label='Purpose '
          type='text'
          onChange={e => {
            setPurpose(e.target.value)
          }}
        />
        <TextField
          required
          value={attendees}
          multiline
          rows={4}
          label='Attendees'
          type='text'
          onChange={e => {
            setAttendees(e.target.value)
          }}
        />
        <TextField
          required
          multiline
          rows={4}
          value={apologies}
          label='Apologies  '
          type='text'
          onChange={e => {
            setApologies(e.target.value)
          }}
        />
        <TextField
          required
          multiline
          rows={4}
          value={agenda}
          label='Agenda  '
          type='text'
          onChange={e => {
            setAgenda(e.target.value)
          }}
        />

        <TextField
          required
          value={discussion}
          label='Discussion'
          multiline
          rows={4}
          type='text'
          onChange={e => {
            setDiscussion(e.target.value)
          }}
        />
        <TextField
          required
          value={action}
          multiline
          rows={4}
          label='Action  '
          type='text'
          onChange={e => {
            setAction(e.target.value)
          }}
        />

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
              <DeleteIcon onClick={() => handleDeleteImage(fileName.meeting_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
              <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
            </div> :
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
              <DeleteIcon onClick={() => handleDeleteImage(fileName.meeting_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
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
