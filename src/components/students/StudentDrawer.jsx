import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { Publish } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import * as moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import ArchiveIcon from '@material-ui/icons/Archive';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useQuery } from '@apollo/client';
import { GET_SCHOOLS } from '../../queries/getSchools';

let uuid = uuidv4();
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
    pos: {
        marginBottom: theme.spacing(2)
    },
    mg2: {
        marginLeft: theme.spacing(1)
    },
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    fileDefault: {
        display: 'inline-block',
        width: '100%',
        padding: '120px 0 0 0',
        height: '100px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        background: "url('https://cdn1.iconfinder.com/data/icons/hawcons/32/698394-icon-130-cloud-upload-512.png') center center no-repeat #e4e4e4",
        borderRadius: '20px',
        backgroundSize: '60px 60px'
    }
}));
const StudentDrawer = (props) => {
    // let todayDate = new Date()
    const classes = useStyles();
    const { className, toggleDrawer, taskDrawer, item } = props
    
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: item?.name || "",
            birthdate: item && item.birthdate ? moment(item.birthdate).format("YYYY-MM-DD"): "",
            gender: item?.gender || "",
            school_id: item?.school_id || "",
            class_id: item?.class_id || "",
            street: item?.street || "",
            city: item?.city || "",
            state: item?.state || "",
            zipcode: item?.zipcode || "",
            country: item?.country || "",
            email: item?.email || "",
            mobile: item?.mobile || "",
            school: item?.school || "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(6, 'Must be minimum 6 characters')
                .required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            delete values.class
            let isNew  
            values.id = item ? item.id : uuidv4()

            isNew = item!=undefined ? false : true
            await resetForm()
            await props.addStudent(values,isNew)
            await props.toggleDrawer(false)
        },
    });
    //Delete,complete,archive a task
    const actionOnTask = (type) => {
        props.updateOnTask(type, item, item.id)
        props.clearItem()
    }
    const { loading, error, data, refetch } = useQuery(GET_SCHOOLS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error}`;
   
    return (
        <Drawer
            className=""
            anchor={"right"}
            open={taskDrawer}
            onClose={toggleDrawer(false)}
        >
            <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                <div className={className} style={{ position: 'relative' }}>
                    <div className="" style={{ padding: '0px 20px 20px' }} >
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                justify="center" style={{ display: 'flex' }}>
                                <Button variant="contained" type="submit" className={classes.mg2} color="primary">Submit</Button>
                            </Grid>
                        </Grid>
                    </div>
                    <Divider />
                    <div className={classes.paper}>
                        <TextField
                            size="small"
                            error={formik.touched.name && formik.errors.name}
                            id="name"
                            label="Name"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            helperText={formik.touched.name && formik.errors.name ? (
                                formik.errors.name
                            ) : null}
                        />
                        <TextField
                            size="small"
                            id="birthdate"
                            label="birthdate"
                            type="date"
                            name="birthdate"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.birthdate}
                            className={classes.pos}
                        />
                        <TextField
                            size="small"
                            id="gender"
                            label="gender"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.gender}
                        />
                         
                        <FormControl variant="outlined" className={classes.pos}>
                            <InputLabel id="school-label">School</InputLabel>
                            <Select
                                labelId="school-label"
                                id="school"
                                defaultValue={formik.values.school_id}
                                name="school_id"
                                value={formik.values.school_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="School"
                                size="small"
                            >
                                {
                                    data && data.schools.length>0 &&  
                                    data.schools.map((t,i)=> 
                                        <MenuItem value={t.id} key={i} selected={t.id===formik.values.school_id}>{t.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className={classes.pos}>
                            <InputLabel id="class-label">Class</InputLabel>
                            <Select
                                labelId="class-label"
                                id="class_id"
                                name="class_id"
                                value={formik.values.class_id}
                                defaultValue={formik.values.class_id}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Class"
                            >
                                <MenuItem value={"X"}>X</MenuItem>
                                <MenuItem value={"IX"}>IX</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            id="street"
                            label="street"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.street}
                        />
                        <TextField
                            size="small"
                            id="city"
                            label="city"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                        />
                        <TextField
                            size="small"
                            id="state"
                            label="state"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.state}
                        />
                        <TextField
                            size="small"
                            id="zipcode"
                            label="zipcode"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.zipcode}
                        />
                        <TextField
                            size="small"
                            id="country"
                            label="country"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.country}
                        />
                        <TextField
                            size="small"
                            id="email"
                            label="email"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        <TextField
                            size="small"
                            id="mobile"
                            label="mobile"
                            multiline
                            variant="outlined"
                            fullWidth
                            className={classes.pos}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.mobile}
                        /> 
                        
                    </div>
                </div>
            </form>
        </Drawer >

    )
}

export default compose(
    
)(StudentDrawer)
