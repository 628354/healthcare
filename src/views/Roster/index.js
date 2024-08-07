import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'
import '../../style/document.css'
import moment from 'moment'; // Import moment library for date manipulation
import CloseIcon from '@mui/icons-material/Close';
// import { Typography, Button, IconButton, Checkbox,FormControl, FormHelperText } from '@material-ui/core';
// import CloseIcon from '@material-ui/icons/Close';


// setOptions({
//   // localeJs,
//   // themeJs
// });
import { Box } from '@mui/system';
import { Button, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import Input from '@mui/material/Input';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
// import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';


const Dashboard = () => {

  const staticData = [
    {
      user: "test",
      date: "15/07/2024",
      staff: "44",
      participant: '1',
      sTime: "08:00 AM",
      eTime: "09:00 AM",
      site: "9"
    },
    {
      user: "test 2",
      date: "16/07/2024",
      staff: "45",
      participant: '2',
      sTime: "08:00 AM",
      eTime: "09:00 AM",
      site: "12"

    },
    {
      user: "test 3",
      date: "24/07/2024",
      staff: "46",
      participant: '25',
      sTime: "08:00 AM",
      eTime: "09:00 AM"
    },
    {
      user: "test 4",
      date: "11/07/2024",
      staff: "47",
      participant: '16',
      sTime: "08:00 AM",
      eTime: "09:00 AM"
    },
    {
      user: "test5",
      date: "12/07/2024",
      staff: "47",
      participant: '16',
      sTime: "08:00 AM",
      eTime: "09:00 AM",

    },
  ]
  // roster work start 
  const [data, setData] = useState('Participant');
  const [selectDay, setSelectDay] = useState('Fortnightly');
  const [selectedData, setSelectedData] = useState([]);
  const [startDate, setStartDate] = useState(moment().startOf('week').add(1, 'days'));
  const [endDate, setEndDate] = useState(startDate.clone().add(13, 'days'));
  const [endDate2, setEndDate2] = useState(startDate.clone().add(6, 'days'));
  const [finalStaff, setFinalStaff] = useState(null)
  const [datesWithWeeks, setDatesWithWeeks] = useState([]);

  const [staff, setStaff] = useState('')
  const [staffL, setStaffL] = useState([])
// //console.log(staffL);
  const [participant, setParticipant] = useState('');
  const [participantList, setParticipantList] = useState([])

  const [showPopup, setShowPopup] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const [unavailabilityRepeat, setUnavailabilityRepeat] = useState(false)
  const [availableType, setAvailableType] = useState('')
  const [unavailabilityDate, setUnavailabilityDate] = useState('')

  const [forEveryWD, setForEveryWD] = useState([])
  const [weekName, setWeekName] = useState([])

  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [totalHours, setTotalHours] = useState(null)
  const [rows, setRows] = useState([{ id: Date.now(), startTime: null, service: '' }]);



  const [service, setService] = useState('');
  const [serviceL, setServiceL] = useState([]);

  const navigate = useNavigate();
  
  const handleClickSetting = () => {
    // //console.log('yes');
    navigate('/roster/setting/tab')
  }


  // //console.log( dayjs(startTime).format("HH/mm"));
  // //console.log( endTime - startTime);
  useEffect(() => {
    if (startTime && endTime) {
      const start = startTime.toDate();
      const end = endTime.toDate();
      const diffMs = end - start;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      // //console.log(diffHours);
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      // //console.log(`${diffHours}:${diffMinutes}`);
      setTotalHours(`${diffHours}:${diffMinutes} hrs`)
    }
  }, [startTime, endTime]);








  // const startDate = new Date(`${date.toDateString()} ${startTime}`);
  // const endDate = new Date(`${date.toDateString()} ${endTime}`);

  // // Calculate the difference in milliseconds
  // const timeDifferenceMs = endDate - startDate;

  // // Convert milliseconds to hours
  // const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);


  const daysOfWeek = [
    { label: 'Mon' },
    { label: 'Tue' },
    { label: 'Wed' },
    { label: 'Thu' },
    { label: 'Fri' },
    { label: 'Sat' },
    { label: 'Sun' },
  ];
  const nextDateRange = () => {
    const newStartDate = startDate.startOf('week').add(selectDay === 'Fortnightly' ? 15 : 8, 'days');
    setStartDate(newStartDate);
    setEndDate(newStartDate.clone().add(13, 'days'));
    setEndDate2(newStartDate.clone().add(6, 'days'));
    if (selectDay === 'Fortnightly') {
      generateDatesWithWeeks();
    } else {
      generateDatesWithWeeks2();
    }
  };


  const previousDateRange = () => {
    const newStartDate = startDate.startOf('week').subtract(selectDay === 'Fortnightly' ? 13 : 6, 'days');
    //console.log(newStartDate);

    setStartDate(newStartDate);
    setEndDate(newStartDate.clone().add(13, 'days'));
    setEndDate2(newStartDate.clone().add(6, 'days'));
    if (selectDay === 'Fortnightly') {
      generateDatesWithWeeks();
    } else {
      generateDatesWithWeeks2();
    }
  };

  const generateDatesWithWeeks = useCallback(() => {

    const dates = [];
    let currentDate = startDate.clone();
    //console.log(currentDate);
    //console.log(endDate);
    while (currentDate <= endDate) {
      dates.push({
        date: currentDate.clone(),
        weekName: currentDate.format('dddd'),
      });
      currentDate = currentDate.clone().add(1, 'day');
    }
    setDatesWithWeeks(dates);
  }, [startDate, endDate]);



  const generateDatesWithWeeks2 = useCallback(() => {
    const dates = [];
    let currentDate = startDate.clone();
    while (currentDate <= endDate2) {
      dates.push({
        date: currentDate.clone(),
        weekName: currentDate.format('dddd'),
      });
      currentDate = currentDate.clone().add(1, 'day');
    }
    setDatesWithWeeks(dates);
  }, [startDate, endDate2]);

  useEffect(() => {
    if (selectDay === 'Fortnightly') {
      generateDatesWithWeeks();
    } else {
      generateDatesWithWeeks2();
    }
  }, [selectDay, generateDatesWithWeeks, generateDatesWithWeeks2]);




  const getRole = async () => {
    const data = []

    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant+companyId)
      if (response.status) {
        //console.log(response.messages);
        setParticipantList(response.messages)

        response?.messages?.map((item) => {
          data.push({
            "name": `${item.prtcpnt_firstname} ${item.prtcpnt_lastname}`,
            "id": `${item.prtcpnt_id}.par`
          })
        })
        setSelectedData(data);
        // setParticipantList(response.messages)
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }


  const getStaff = async () => {
    const data = []

    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
      //console.log(response);
      if (response.status) {
        // setStaffList(response.messages)
        //console.log(response.messages);
        response?.messages?.map((item) => {
          data.push({
            "name": `${item.stf_firstname} ${item.stf_lastname}`,
            "id": `${item.stf_id}.staff`
          })
        })
        setSelectedData(data);
        setStaffL(response.messages)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }


  const getSite = async () => {
    const data = []

    let endpoint = 'getAll?table=fms_setting_site&select=site_id,site_name,site_location,site_Participants'

    try {
      let response = await COMMON_GET_FUN(BASE_URL, endpoint)
      if (response.status) {
        //console.log(response.messages);
        response?.messages?.map((item) => {
          //console.log(item);

          data.push({
            "name": `${item.site_name}`,
            "id": `${item.site_id}.site`
          })
        })
      }
      setSelectedData(data)

    } catch (error) {
      console.error("Error fetching data:", error);
    }

  }

  useEffect(() => {
    if (data === "Staff") {
      getStaff();

    } else if (data === "Participant") {
      getRole();

    } else {
      getSite();
    }
  }, [data])

  useEffect(() => {
    getRole();
    getServices();
    getStaff();


  }, [])
  const handleCheckboxChange = (event) => {
    const value = event.target.value;

    if (event.target.checked) {
      setWeekName([...weekName, value])
    } else {
      setWeekName(weekName.filter(item => item !== value))
    }


  };

  const handleCellClick = (id, clickDate, clickSTime) => {
    //console.log(clickSTime);

    if (id.endsWith('.par')) {
      const newString = id.replace('.par', '');
      //console.log(newString);
      setParticipant(newString)
      setStaff('')
    } else if (id.endsWith('.staff')) {
      const newString = id.replace('.staff', '');
      //console.log(newString);
      setStaff(newString)
      setParticipant('')

    } else {
      const newString = id.replace('.site', '');
      // setSelectedData()
      setParticipant('')
      setStaff('')


    }

    setFinalStaff(id)
    setShowPopup(true)

  }
  // roster work end 
  const handleClosePopup = () => {
    setShowPopup(false)
    setUnavailabilityRepeat(false)
    setStartTime(null)
    setEndTime(null)
  }


  const handleAddShift = () => {
    setShowPopup(true)


  }
  //console.log(showDropdown);
  
  const handleShowDropDown = () => {

    setShowDropdown(!showDropdown)
  }

  const handleAddRow = () => {

    setUnavailabilityRepeat(prevValue => !prevValue)
  }


  //  replace end text from id 
  const normalizeId = (id) => {
    if (id.endsWith('.par')) {
      return { par: id.replace(/\.par$/, '') };
    } else if (id.endsWith('.staff')) {
      return { staff: id.replace(/\.staff$/, '') };
    } else if (id.endsWith('.site')) {
      return { site: id.replace(/\.site$/, '') };
    } else {
      return { id };
    }
  };


  //console.log(selectedData);
  const addRow = () => {
    setRows([...rows, { id: Date.now(), startTime: null, service: '' }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const handleStartTimeChange = (id, newValue) => {
    setRows(rows.map(row => row.id === id ? { ...row, startTime: newValue } : row));
  };

  const handleServiceChange = (id, newValue) => {
    setRows(rows.map(row => row.id === id ? { ...row, service: newValue } : row));
  };


  //console.log(rows);
  const getAllFieldData = () => {
    return rows.map(row => ({
      id: row.id,
      startTime: row.startTime,
      service: row.service
    }));
  };

  //console.log(rows);

  const handleSubmit = () => {
    const data = getAllFieldData();
    // //console.log(data); 
  };


  const getServices = async () => {
    let endpoint = 'getAll?table=services&select=services_id,services_name';

    let response = await COMMON_GET_FUN(BASE_URL, endpoint)
    //  //console.log(response);
    if (response.status) {

      setServiceL(response.messages)
    }

  }
  return (
    <div className='container roster_pop' >

      <div className='roster_top_bar'>
        <Box className="roster_main">
          <FormControl className='week_inp_width' >
            <InputLabel id='participant'>Select</InputLabel>

            <Select
              labelId='participant'
              id='participant'
              label='Participant'
              onChange={e => setData(e.target.value)}
              value={data}

            >

              <MenuItem value='Participant'>Participant</MenuItem>
              <MenuItem value='Staff'>Staff</MenuItem>
              <MenuItem value='Site'>Site</MenuItem>



            </Select>
          </FormControl>
          <FormControl className='week_inp_width' required>
            <InputLabel id='select'>Select</InputLabel>
            <Select
              labelId='select'
              id='select'
              label='select'
              onChange={e => setSelectDay(e.target.value)}
              value={selectDay}
            >

              <MenuItem value='Weekly'>Weekly</MenuItem>
              <MenuItem value='Fortnightly'>Fortnightly</MenuItem>

            </Select>
          </FormControl>

          <section className='sc-AxhCb eSwYtm week_inp_width'>
            {selectDay === 'Fortnightly' ? (
              <div className='weekBox'>
                <button type='button' className='week_btn' onClick={previousDateRange}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0, 0%, 80%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <div className='d-flex justify-content-center'>{`${startDate.format('DD MMM')} to ${endDate.format('DD MMM')}`}</div>
                <button type='button' className='week_btn' onClick={nextDateRange}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0, 0%, 80%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className='weekBox'>
                <button type='button' className='week_btn' onClick={previousDateRange}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0, 0%, 80%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <div className='d-flex justify-content-center'>{`${startDate.format('DD MMM')} to ${endDate2.format('DD MMM')}`}</div>
                <button type='button' className='week_btn' onClick={nextDateRange}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(0, 0%, 80%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </section>



        </Box>

        <div className='right_menu'>
          <div className='right_btn'>
            <Button variant="contained" onClick={handleAddShift}><AddIcon />Add Shift</Button>
          </div>
          <div className=''>
            <div className='right_icon' onClick={handleShowDropDown}><MoreVertIcon /></div>

          </div>
          {
            showDropdown ? 
            
            <div className='roter_dropdown' onClickAway={handleShowDropDown}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                  <List className='dropdown_ul'>
                    <ListItem disablePadding className='dropdown_li' onClick={handleClickSetting}>
                      <ListItemButton className='dropdown_li_btn'>
                        <ListItemIcon >
                          <SettingsIcon  />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                      </ListItemButton>
                    </ListItem>

                    {/* <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItemButton>
            </ListItem> */}
                  </List>
                </nav>
              </Box>
            </div> : ""
          }


        </div>
      </div>


      {/* <div>
        {datesWithWeeks.map((item, index) => (
          <div key={index}>
            <span>{item.weekName} </span> 
            <span>{item.date.format('DD MMM YYYY')}</span>
          
          </div>
        ))}
      </div>  */}
      <TableContainer sx={{ border: " 1px solid #ddd", marginBottom: "30px" }}>
        <Table sx={{ minWidth: 650, border: " 1px solid #ddd" }} aria-label="simple table">
          <TableHead className='tha'>
            <TableRow sx={{ border: " 1px solid #ddd" }} >
              <TableCell className='table_header' sx={{ border: " 1px solid #ddd" }}>
                <FormControl id='roster_search' variant="standard">
                  <Input

                    placeholder={`${data} Name`}

                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon className='no45' />
                      </InputAdornment>
                    }
                  />
                </FormControl>


              </TableCell>

              {datesWithWeeks.map((item, index) => {

                const weekName = item.weekName.substring(0, 3);

                return (
                  <TableCell className={`table_header ${item.date.date() == moment().date() ? "r_current_date" : ""}`} sx={{ border: " 1px solid #ddd" }} key={index}><span className='ttdsag'>{weekName} </span> <span>{item.date.format('DD MMM')}</span><div className='roster_h_icon'><AccessTimeIcon sx={{ fontSize: '0.8rem' }} /></div></TableCell>
                )
              })}

            </TableRow>
          </TableHead>
          <TableBody style={{ background: "white" }}>
            {
              selectedData?.map((item) => {
                //console.log(item)
                const normalizedItemId = normalizeId(item.id);
                // //console.log(Object.keys(normalizedItemId));

                return (
                  <TableRow key={item.id} sx={{ border: "1px solid #ddd" }}>
                    <TableCell sx={{ border: "1px solid #ddd" }} className='table_data'>{item.name}</TableCell>

                    {datesWithWeeks.map((dateItem, index) => {
                      const tableCurrentDate = dateItem.date.format('DD/MM/YYYY')
                      //  //console.log(d);
                      //  staticItems?.participant === normalizedItemId &&
                      //  // staticItem?.staff === normalizeId(item.staffId) &&
                      //  // staticItem?.site === normalizeId(item.site) &&

                      //  staticItems.date === dateItem.date
                      const staticItem = staticData.find((staticItems) => {
                        // //console.log(staticItems);
                        //  const getType = Object.keys(normalizedItemId)
                        //  //console.log(Object.keys(normalizedItemId)[0]);
                        // //console.log(staticItems?.date);
                        // //console.log(tableCurrentDate);
                        // const staticItemDate = moment(staticItems.date); 
                        // //console.log(Object.keys(normalizedItemId)[0] == 'par' && data === "Participant");
                        // //console.log(Object.keys(normalizedItemId)[0] == 'staff'&& data === "Staff");
                        // //console.log(Object.keys(normalizedItemId)[0] == 'site' && data === "Site");

                        if (Object.keys(normalizedItemId)[0] == 'par' && data === "Participant") {

                          return staticItems?.participant == normalizedItemId.par && staticItems?.date === tableCurrentDate
                        } else if (Object.keys(normalizedItemId)[0] == 'staff' && data === "Staff") {

                          return staticItems?.staff == normalizedItemId.staff && staticItems?.date === tableCurrentDate
                        } else if (Object.keys(normalizedItemId)[0] == 'site' && data === "Site") {

                          return staticItems?.site == normalizedItemId.site && staticItems?.date === tableCurrentDate
                        }


                      });
                      // //console.log(staticItem);
                      return (
                        <TableCell
                          className='table_cell'
                          onClick={() => handleCellClick(item.id, dateItem.date, item)}
                          sx={{ border: "1px solid #ddd" }}
                          key={index}
                        >

                          {staticItem && (
                            <div className='table_inner_div'>
                              <div className='table_user'>
                                <div>
                                  {staticItem.sTime} {staticItem.eTime}
                                </div>
                                <div className='table_user_D'><span><PersonIcon /></span><span>{data == 'Participant' ? staticItem.user : staticItem.participant}</span></div>



                              </div>
                            </div>
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>

      {
        showPopup ?

          <div className='modal-overlay'>
            <Box className="modal-content">



              <div className="modal-header">
                <Typography variant="h5" className="modal-title">
                  Add Shift
                </Typography>
                <IconButton aria-label="Close" onClick={handleClosePopup}  >
                  <CloseIcon />
                </IconButton>
              </div>

              <form className="popup_form">
                <div className="shiftModal modal-body">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="form-group">
                        <LocalizationProvider dateAdapter={AdapterDayjs} className="test23" >
                          <DatePicker
                            label='Date'
                            className="popup_picker"
                            format='DD/MM/YYYY'
                          // value={cellClickDate}

                          />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            label="Start Time"
                            onChange={(newValue) => { setStartTime(newValue) }}
                            className="popup_picker"
                          />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                          <TimePicker
                            className="popup_picker"
                            label="End Time"
                            onChange={(newValue) => { setEndTime(newValue) }}

                          />
                        </LocalizationProvider>
                        {
                          endTime && startTime ? <div className='popup_t_hours'>
                            <p>Total Time</p>
                            <span className='popup_t_hour'>

                              {totalHours ? totalHours : ""}
                            </span>
                          </div> : ""
                        }


                        <div className="custom-field-error"></div>
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <div className="form-group ">
                        <FormControl className="popup_user" required>
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
                                //console.log(item);
                                return (
                                  <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

                                )

                              })
                            }
                          </Select>
                        </FormControl>

                        <FormControl className="popup_user" required>
                          <InputLabel id='Staff'>Staff</InputLabel>
                          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
                            {staffL?.map(item => {
                              // //console.log(item);
                              return (
                                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                                  {item?.stf_firstname} {item?.stf_lastname}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>

                      </div>
                    </div>

                    {
                      endTime && startTime ? <>
                        <div className='roster_services'>
                          Services

                        </div>
                        <div className='services_cont_parent'>
                          {rows.map((row, index) => (
                            <div className="col-sm-12 services_cont_main" key={row.id}>
                              <IconButton onClick={() => removeRow(row.id)}>
                                <RemoveCircleOutlineIcon sx={{ color: "red" }} />
                              </IconButton>
                              <div className="form-group services_cont">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <TimePicker
                                    label="Start Time"
                                    value={startTime}
                                    onChange={(newValue) => handleStartTimeChange(row.id, newValue)}
                                  />
                                </LocalizationProvider>
                                <FormControl className="popup_user" required>
                                  <InputLabel id='services'>Service</InputLabel>
                                  <Select
                                    labelId='Service'
                                    id='Service'
                                    value={row.service}
                                    label='Service'
                                    onChange={(e) => handleServiceChange(row.id, e.target.value)}
                                  >
                                    {serviceL?.map((item) => (
                                      <MenuItem key={item?.services_id} value={item?.services_id}>
                                        {item?.services_name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                              <IconButton onClick={addRow}>
                                <AddCircleOutlineIcon sx={{ color: "green", marginBottom: "0px" }} />
                              </IconButton>
                            </div>
                          ))}

                        </div>
                      </> : ""
                    }

                    <div className="col-sm-12">
                      <div className="form-group">
                        <TextField
                          id="notes"
                          name="notes"
                          label='Notes'
                          className="form-control"
                          variant="outlined"
                          sx={{ padding: '10px', marginTop: "10px" }}
                          fullWidth
                        />
                        <div className="custom-field-error"></div>
                      </div>
                    </div>


                    <div className="col-sm-12">
                      <div className="form-group" style={{ padding: '10px' }}>
                        <FormGroup>
                          <FormControlLabel
                            label='Repeat unavailability'
                            control={unavailabilityDate === 1 ? <Switch defaultChecked /> : <Switch />}

                            value={unavailabilityRepeat}

                            onClick={handleAddRow}

                          />
                        </FormGroup>
                      </div>
                    </div>
                    {
                      unavailabilityRepeat ? (
                        <div className="col-sm-12">
                          <div className="form-group" style={{ padding: '10px' }}>
                            <div className='custom_Radio' style={{ display: 'flex', justifyContent: 'end' }}>
                              <FormControl component="fieldset">
                                <RadioGroup
                                  aria-label="relation-type"
                                  name="relationType"
                                  style={{ display: 'flex', flexDirection: 'row' }}
                                  onChange={e => {
                                    setAvailableType(e.target.value)
                                  }}
                                >
                                  <FormControlLabel value="Ends on" control={<Radio />} label="Ends on" />
                                  <FormControlLabel value="Occurrences" control={<Radio />} label="Occurrences" />
                                </RadioGroup>
                              </FormControl></div>
                            <div style={{ display: 'flex', gap: '27px', marginLeft: "7px", marginTop: "14px", marginBottom: "20px" }}>

                              <TextField
                                style={{ width: '30ch' }}
                                type='number'
                                required
                                label='For every '
                              // value={forEvery}
                              // onChange={e => {
                              //   setForEvery(e.target.value)
                              // }}
                              />

                              <FormControl sx={{ width: '30ch' }}>
                                <InputLabel id='forEveryWD'>Select Day/Week</InputLabel>
                                <Select

                                  labelId='forEveryWD'
                                  id='select-one-label'
                                  value={forEveryWD}
                                  label='Select Day/Week'
                                  onChange={e => {
                                    setForEveryWD(e.target.value)
                                  }}
                                >
                                  <MenuItem value="Day">Day</MenuItem>
                                  <MenuItem value="Week">Week</MenuItem>
                                </Select>

                              </FormControl>
                              {availableType === "Ends on" ?
                                <LocalizationProvider dateAdapter={AdapterDayjs} className="endsON">
                                  <DatePicker
                                    style={{ width: '30ch' }}
                                    className="endsON"
                                    label='Ends On'
                                    // minDate={dayjs(endsOnDate)}
                                    format='DD/MM/YYYY'
                                  // value={dayjs(endsOnDate)}
                                  // onChange={newValue => {
                                  //   setEndsOnDate(newValue)
                                  // }}
                                  />
                                </LocalizationProvider>
                                : <TextField
                                  style={{ width: '30ch' }}
                                  type='number'
                                  required

                                // defaultValue={occurrences}
                                // onChange={e => {
                                //   setOccurrences(e.target.value)
                                // }}
                                />}




                            </div></div>
                        </div>


                      ) : null



                    }

                    {
                      forEveryWD === "Week" && unavailabilityRepeat ?
                        <Grid container direction="row" justifyContent="start" alignItems="center" >
                          {daysOfWeek.map((item, index) => {
                            // //console.log(item);
                            return (
                              <>
                                <FormControlLabel key={index}
                                  control={<Checkbox
                                    value={item.label}

                                    onChange={handleCheckboxChange}
                                  />}
                                  label={item.label}
                                  labelPlacement="top"
                                />
                              </>
                            )
                          })}



                        </Grid> : null
                    }
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="d-flex justify-content-end">
                    <Button type="reset" variant="outlined" color="primary" className="waves-effect mr-1 btn btn-outline-primary" style={{ marginRight: '10px' }}>
                      Save draft
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className="waves-effect btn btn-primary">
                      Publish
                    </Button>
                  </div>
                </div>
              </form>
            </Box>
          </div>




          : ""
      }


    </div>
  )
}

export default Dashboard
