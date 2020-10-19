import React, { useState, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import { TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as moment from 'moment'


const useStyles = makeStyles({
    root: {
        maxWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
function Student(props) {
    const classes = useStyles();
    const [ birthdate1, setBirthdate1 ] = useState(null)
    const [ birthdate2, setBirthdate2 ] = useState(null)
    const [ data, setData ] = useState()
    const [ filterName, setFilterName ] = useState(null)
    const { items } = props
    const columns = [
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'gender', headerName: 'Gender', width: 130 },
        { field: 'school', headerName: 'School', width: 130 },
        { field: 'class_id', headerName: 'Class', width: 130 },
        { field: 'birthdate', headerName: 'Birthdate', width: 130 },
      ];
    useEffect(()=>{
        if(items && items.length>0) {
            setData(items)
        }
    },[items])
    useEffect(() => {
        if(birthdate1 && birthdate2) {
            setData(t=> t.filter(d=> { 
                return new Date(d.birthdate) >= new Date(birthdate1)   &&  new Date(d.birthdate) <=  new Date(birthdate2) }))
        }
    }, [birthdate1, birthdate2])
    useEffect(() => {
        let txtValue
        if(filterName) {
            
            setData(t=> t.filter(d=> {
                txtValue = d.name ;
                if (txtValue.toUpperCase().indexOf(filterName.toUpperCase()) > -1) {
                    return d
                } 
            }))
        }
        else {
            setData(items)
        }
    }, [filterName])
    return (
        <div>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                Students List
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
                Filter by: Birthdate range 
                <div>
                <TextField
                    size="small"
                    id="birthdate1"
                    label="from birthdate range"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e)=> setBirthdate1(e.target.value)}
                />
                <TextField
                    size="small"
                    id="birthdate2"
                    label="To birthdate range"
                    type="date"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e)=> setBirthdate2(e.target.value)}
                />

                </div>
                <div>
                    Filter by name: 
                    <TextField
                        size="small"
                        id="name"
                        label="Search by name"
                        multiline
                        variant="outlined"
                        fullWidth
                        className={classes.pos}
                        onChange={(e)=>setFilterName(e.target.value)}
                    />
                </div>
            </Typography>
            
            {
                data && data.length>0 &&
                <div style={{ height: 600, width: '100%', backgroundColor: "#fff" }}>
                    <DataGrid rows={data && data.map(t=> ({...t, birthdate:moment(t.birthdate).format("YYYY-MM-DD")}))} columns={columns} onRowClick={(e) => props.onStudentClick(e) }  />
                </div>
            }
            
        </div>
    )
}

export default Student
