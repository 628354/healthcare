import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Card, CardContent,Typography } from '@mui/material'
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
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IMG_BASE_URL ,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'

const Edit = ({ selectedData, setIsEditing, allowPre, setShow, show,participantId }) => {
  console.log(selectedData);
  const currentDate = new Date();

  const id = selectedData.incdnt_id;
  const [date, setDate] = useState(selectedData.incdnt_date ? dayjs(selectedData.incdnt_date) : null)
  const [time, setTime] = useState(selectedData.incdnt_time)
  const [staff, setStaff] = useState(selectedData.incdnt_staff.split(','));
  const [staffList, setStaffList] = useState([])
  const [location, setLocation] = useState(selectedData.incdnt_address)

  const [participant, setParticipant] = useState(selectedData.incdnt_prtcpntid);
  const [participantList, setParticipantList] = useState([])

  const [incidentType, setIncidentType] = useState(selectedData.incdnt_type.split(','));
  const [incidentTypeLi, setIncidentTypeLi] = useState([]);

  const [description, setDescription] = useState(selectedData.incdnt_descrptn)
  const [eventsPrior, setEventsPrior] = useState(selectedData.incdnt_evntprior)

  const [actionsTakenStaff, setActionsTakenStaff] = useState(selectedData.incdnt_actnstf)
  const [actionsTakenOther, setActionsTakenOther] = useState(selectedData.incdnt_actnother)
  const [anyOtherWitness, setAnyOtherWitness] = useState(selectedData.incdnt_witns);


  const [incidentReportedTo, setIncidentReportedTo] = useState(selectedData.closure_reported_to);

  const [assessmentAndDebriefing, setAssessmentAndDebriefing] = useState(selectedData.closure_assessment);

  const [findingsActionsTaken, setFindingsActionsTaken] = useState(selectedData.closure_find_act_taken);
  const [status, setStatus] = useState(selectedData.closure_status);


  const [attachment, setAttachment] = useState(selectedData.image_data);
  const [newImage, setNewImage] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [staffOpen, setStaffOpen] = useState(false);
  const [incidentTypeOpen, setIncidentTypeOpen] = useState(false);
  const [value, setValue] = React.useState('1');
  // const [addClosureField, setAddClosureField] = useState(false)

  const [closureStaff, setClosureStaff] = useState(selectedData.closure_by)

  const [closureDate, setClosureDate] = useState(selectedData.closure_date ? dayjs(selectedData.closure_date) : null)

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

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  // const handleChange2 = (event, newValue) => {
  //   setValue(newValue);
  // };
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
      console.log(files);
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

 
  const getIncidentType = async () => {
    let endpoint = 'getAll?table=report_incidet_type&select=report_incidet_id,report_incidet_name,';

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
      setIncidentTypeLi(res.messages)
      // console.log(res);
    }

  }
  const getRole = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.participant)
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
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  useEffect(() => {
    getIncidentType();
    getStaff();
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
      console.log(closureStaff);
if(closureStaff == 0){
       setClosureStaff(id)

}


    }
  }, [])
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!staff) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      });
    }


    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const closure = closureDate ? closureDate.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const formattedTime = time ? dayjs(time).format('HH:mm') : null;
    const formData = new FormData();
    formData.append('incdnt_staff', staff);
    formData.append('incdnt_date', dateFormat);
    formData.append('incdnt_time', formattedTime);
    formData.append('incdnt_prtcpntid', participant);
    formData.append('incdnt_address', location);
    formData.append('incdnt_type', incidentType);
    formData.append('incdnt_descrptn', description);
    formData.append('incdnt_evntprior', eventsPrior);
    formData.append('incdnt_actnstf', actionsTakenStaff);
    formData.append('incdnt_actnother', actionsTakenOther);
    formData.append('incdnt_witns', anyOtherWitness);
    formData.append('updated_at', currentTime);
    formData.append('closure_status', status)

    if (status === 'Close') {
      formData.append('closure_reported_to', incidentReportedTo);
      formData.append('closure_assessment', assessmentAndDebriefing);
      formData.append('closure_find_act_taken', findingsActionsTaken);
      formData.append('closure_by', closureStaff);
      formData.append('closure_date', closure);

    } else {
      formData.append('closure_reported_to', incidentReportedTo);
      formData.append('closure_assessment', assessmentAndDebriefing);
      formData.append('closure_find_act_taken', findingsActionsTaken);
      formData.append('closure_by', " ");
      formData.append('closure_date', '0000-00-00');
    }
    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });



    let endpoint = 'updateReporting?table=fms_prtcpnt_incident&field=incdnt_id&id=' + id;
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
      <h1>View Incident</h1>
      <div className="small-container" id='incident'>



        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box >
              <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="Incident" value="1" />
                <ArrowForwardIosIcon className='incident_icon' />
                <Tab label="Closure" value="2" />


              </TabList>
            </Box>
            <TabPanel value="1" className="incident_box">
              <Box

                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '50ch' }
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleUpdate}
              >

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Date'
                    format='DD/MM/YYYY'
                    value={dayjs(date)}
                    onChange={newValue => {
                      setDate(newValue)
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Time"
                    value={dayjs(time, 'HH:mm')}
                    onChange={(newValue) => { setTime(newValue) }}

                  />
                </LocalizationProvider>
                <TextField
                  value={location}

                  label="Location"
                  type="text"
                  onChange={(e) => { setLocation(e.target.value) }}
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
                        {selected?.map((value) => {
                          const selectedPractitioner = staffList.find(item => item?.stf_id === value);
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
                        {selected?.map((value) => {
                          const selectedPractitioner = incidentTypeLi.find(item => item?.report_incidet_id === value);
                          // console.log(value);
                          return (
                            <Chip
                              key={value}
                              label={selectedPractitioner?.report_incidet_name}
                              onDelete={() => handleDelete(value)} 
                              sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
                            />

                          )
                        })}
                      </div>
                    )}
                  >
                    {
                      incidentTypeLi?.map((item) => {
                        //  console.log(item);
                        return (
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
                  onChange={(e) => { setDescription(e.target.value) }}
                />
                <TextField
                  value={eventsPrior}
                  label="Events prior to incident"
                  type="text"
                  multiline
                  rows={5}
                  onChange={(e) => { setEventsPrior(e.target.value) }}
                />
                <TextField
                  value={actionsTakenStaff}
                  label="Actions taken by staff "
                  type="text"
                  multiline
                  rows={5}
                  onChange={(e) => { setActionsTakenStaff(e.target.value) }}
                /> <TextField
                  value={actionsTakenOther}
                  label="Actions taken by others"
                  type="text"
                  multiline
                  rows={5}
                  onChange={(e) => { setActionsTakenOther(e.target.value) }}
                /> <TextField
                  value={anyOtherWitness}
                  label="Any other witness "
                  type="text"
                  multiline
                  rows={5}
                  onChange={(e) => { setAnyOtherWitness(e.target.value) }}
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
            </TabPanel>
            <TabPanel value="2" className="incident_box">
              <Box

                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '50ch' }
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleUpdate}
              >


                <TextField
                  value={incidentReportedTo}
                  multiline
                  rows={5}
                  label="Incident Reported To"
                  type="text"
                  onChange={(e) => { setIncidentReportedTo(e.target.value) }}
                />

                <TextField
                  value={assessmentAndDebriefing}
                  multiline
                  rows={5}
                  label="
              Assessment and Debriefing"
                  type="text"
                  onChange={(e) => { setAssessmentAndDebriefing(e.target.value) }}
                />
                <TextField
                  value={findingsActionsTaken}
                  multiline
                  rows={5}
                  label="
              Findings and actions taken"
                  type="text"
                  onChange={(e) => { setFindingsActionsTaken(e.target.value) }}
                />



                <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                  <InputLabel id='Status'>Status</InputLabel>
                  <Select
                    labelId='Status'
                    id='Status'
                    value={status}
                    label='Status'
                    onChange={e => setStatus(e.target.value)}
                  >

                    <MenuItem value='Open'>Open</MenuItem>
                    <MenuItem value='Close'>Close</MenuItem>



                  </Select>
                </FormControl>

                {
                  status === "Close" ? <>
                    {status === "Close" && (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label='Closure'
                          format='DD/MM/YYYY'
                          minDate={dayjs(currentDate)}
                          value={dayjs(closureDate)}
                          onChange={newValue => {
                            setClosureDate(newValue)
                          }}
                        />
                      </LocalizationProvider>
                    )}
                    <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
                      <InputLabel id='closureStaff'>Closed by</InputLabel>
                      <Select
                        labelId='closureStaff'
                        id='closureStaff'
                        value={closureStaff}
                        label='closureStaff'
                        onChange={(e) => { setClosureStaff(e.target.value) }}

                      >
                        {
                          staffList?.map((item) => {

                            return (
                              <MenuItem style={{ display: 'none' }} key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

                            )

                          })
                        }
                      </Select>
                    </FormControl>


                  </> : ""
                }

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







            </TabPanel>


          </TabContext>
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
