import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Box, Stack } from '@mui/system';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { filterDatas } from 'store/actions';
import AuthContext from './Login/AuthContext';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import '../style/document.css'
import dayjs from 'dayjs';

const Filter = ({ setShowFilterFields, columns, combineDataFields }) => {
  const { datae } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([{ field: '', condition: 'is', value: '', nameOfField: '' }]);

  const addRow = () => {
    setRows([...rows, { field: '', condition: 'is', value: '', nameOfField: '' }]);
  };

  const removeRow = (indexToRemove) => {
    if (indexToRemove === 0) {
      setShowFilterFields(false);
    }
    const updatedRows = rows.filter((_, index) => index !== indexToRemove);
    setRows(updatedRows);
  };

  const handleFieldChange = (value, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].field = value;
    updatedRows[rowIndex].nameOfField = columns.find(item => item.field === value)?.headerName || '';
    setRows(updatedRows);
  };

  const handleConditionChange = (value, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].condition = value;
    setRows(updatedRows);
  };

  const handleValueChange = (value, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].value = value;
    setRows(updatedRows);
  };

  const handleDateChange = (value, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].value = value;
    setRows(updatedRows);
  };

  useEffect(() => {
    const getnew = localStorage.getItem("new");
    if (getnew) {
      const d = JSON.parse(getnew);
      setRows(d);
    }
  }, []);

  const closeFilter = () => {
    setShowFilterFields(false);
    localStorage.removeItem("new");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("new", JSON.stringify(rows));
  
    const filterData = combineDataFields.filter((item) => {
      return rows.every((rowData) => {
        const fieldValue = item[rowData.field];
        const filterValue = rowData.value;
        console.log(fieldValue);
        console.log(filterValue);
        
        if (rowData.nameOfField === 'Date' || rowData.nameOfField === 'Time') {
          const formattedFilterValue = rowData.nameOfField === 'Date'
          ? dayjs(filterValue).format("YYYY-MM-DD")
          : dayjs(filterValue).format("HH:mm:ss");
          if (rowData.condition === 'Contains') {
            return typeof fieldValue === 'string' && fieldValue.includes(formattedFilterValue);
          } else if (rowData.condition === 'is') {
            return fieldValue === formattedFilterValue;
          } else if (rowData.condition === 'is not') {
            return fieldValue !== formattedFilterValue;
          }
        } else {
          // Handle non-date/time fields
          if (rowData.condition === 'Contains') {
            if (typeof fieldValue === 'string' && typeof filterValue === 'string') {
              return fieldValue.includes(filterValue);
            }
          } else if (rowData.condition === 'is') {
            return fieldValue === rowData.value;
          } else if (rowData.condition === 'is not') {
            return fieldValue !== rowData.value;
          }
        }
        
        return true; // Default to true if no condition matches
      });
    });
  
    dispatch(filterDatas(filterData));
  };
  

  return (
    <div style={{ width: "100%" }} className='filter_mb'>
      {rows.map((row, rowIndex) => (
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          key={rowIndex}
          marginBottom="10px"
        >
          <Grid item xs={1}>
            <IconButton onClick={() => removeRow(rowIndex)}>
              <RemoveCircleOutlineIcon sx={{ color: "red" }} />
            </IconButton>
          </Grid>
          <Grid item xs={3}>
            <Select
              fullWidth
              value={row.field}
              onChange={(e) => handleFieldChange(e.target.value, rowIndex)}
            >
              {columns
                ?.filter(item => item?.field !== 'action')
                .map((item, index) => (
                  <MenuItem key={index} value={item?.field}>
                    {item?.headerName}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item xs={3}>
            <Select
              fullWidth
              value={row.condition}
              onChange={(e) => handleConditionChange(e.target.value, rowIndex)}
            >
              <MenuItem value="is">is</MenuItem>
              <MenuItem value="is not">is not</MenuItem>
              <MenuItem value="Contains">Contains</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4}>
            {row.nameOfField === "Date" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="filterCFields"
                  label='Date'
                  format='DD/MM/YYYY'
                  value={row.value ? dayjs(row.value) : null}
                  onChange={(newValue) => handleDateChange(newValue, rowIndex)}
                />
              </LocalizationProvider>
            ) : row.nameOfField === "Time" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Time"
                  value={row.value ? dayjs(row.value) : null}
                  onChange={(newValue) => handleValueChange(newValue, rowIndex)}
                />
              </LocalizationProvider>
            ) : (
              <TextField
                fullWidth
                placeholder="Value"
                type="text"
                value={row.value}
                onChange={(e) => handleValueChange(e.target.value, rowIndex)}
              />
            )}
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={addRow}>
              <AddCircleOutlineIcon sx={{ color: "green", marginBottom: "0px" }} />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Box sx={{ width: '100ch', m: 1 }}>
        <Stack direction="row-reverse" spacing={2}>
          <Button variant="outlined" type="button" onClick={handleSubmit}>Apply</Button>
          <Button variant="outlined" color="error" type="button" onClick={closeFilter}>Cancel</Button>
        </Stack>
      </Box>
    </div>
  );
};

export default Filter;
