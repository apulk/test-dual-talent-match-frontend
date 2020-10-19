import React, { Suspense, useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
 
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'recompose'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import LeftDrawer from '../../components/leftDrawer';
import Student from '../../components/students';
import { GET_STUDENTS, GET_STUDENT_BY_ID } from '../../queries/getStudents';
import { useMutation, useQuery } from '@apollo/client';
import StudentDrawer from '../../components/students/StudentDrawer'
import  ADD_STUDENT_MUTATION from '../../mutations/addStudentMutation'
import { CREATE_STUDENT, GET_ALL_STUDENTS, UPDATE_STUDENT } from '../../utils/ActionTypes';
import { studentData } from '../../actions'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import * as moment from 'moment'
import axios from 'axios'
import { TextField } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { cloneDeep } from 'lodash'

const drawerWidth = 240;

const Dashboard = (props) => {
  const classes = useStyles();
  const [ open, setOpen ] = useState(true);
  const [eventLoading, setEventLoading] = useState(false)
  const [ studentDrawer, setStudentDrawer] = useState(false);
  const [ isUploadFile, setIsUploadFile ] = useState(false)
  const [ item, setItem ] = useState()
  const [ addStudent ] = useMutation(ADD_STUDENT_MUTATION);
  const [ fileUrl, setFileUrl ] = useState(null)
  const onStudentClick = (values) => {
    setItem(values.data)
    setStudentDrawer(true);
  }
  const studentMutation = (data,isNew) => {
    addStudent({ variables: { input: data } }).then(async result=>{
      if(result) {
          if(isNew) 
          props.studentData(CREATE_STUDENT,result.data.addStudent)
          else 
          props.studentData(UPDATE_STUDENT,result.data.addStudent)
          setStudentDrawer(false)
      }
    })
  }
  const toggleTaskDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setStudentDrawer(open);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { loading, error, data, refetch } = useQuery(localStorage.getItem('type')==="admin" ? GET_STUDENTS: GET_STUDENT_BY_ID,{
    variables: {id: localStorage.getItem('student_id')}
  });
  const fileUpload = (e) => {
    var bodyFormData = new FormData();
        if (e.target.files.length) {
            let file = e.target.files[0]
            bodyFormData.append('file', file);
            bodyFormData.append("upload_preset", "llkgirbp"); 
            bodyFormData.append("api_key", "442877651763164");
            bodyFormData.append("timestamp", (Date.now() / 1000) | 0);
            axios.post("https://api.cloudinary.com/v1_1/djb13uboo/image/upload", bodyFormData, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            })
            .then(response => {
                setFileUrl(response.data.url)
            })
            .catch(err => console.log("There has been ERROR: " + err))
        }
  }
  const fileSubmit = (e) => {
    e.preventDefault()
    let student = cloneDeep(props.allStudents[0])
    delete student.__typename
    delete student.class
    student.file = fileUrl
    student.birthdate = moment(student.birthdate).format("YYYY-MM-DD")
    student.file_no = e.target.file_no.value
    studentMutation(student,false)
  }
   
  useEffect(() => {
    if(!loading)
    props.studentData(GET_ALL_STUDENTS,data && localStorage.getItem('type')==="admin" ? data.students : data.getStudentById)
  }, [loading,data])
  if (loading) return 'Loading...';
  if (error) return `Error! ${error}`;
  return (
    <div className={classes.root}>
      <LeftDrawer />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} ></div>
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} md={12} lg={12}>
            {
              localStorage.getItem('type') === "student" ? 
                props.allStudents.map((t,i)=>
                <>
                  <Card className={classes.root} key={i}>
                    <CardContent>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {t.gender}
                      </Typography>
                      <Typography variant="h5" component="h2">
                        {t.name}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Class: {t.class_id}
                      </Typography>
                      <Typography variant="body2" component="p">
                         {moment(t.birthdate).format("DD-MM-YYYY")}
                        <br />
                         Address: {t.street+", "+t.city,t.state,t.country,t.zipcode,t.country}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={()=>setIsUploadFile(true)}> Upload Files </Button>
                    </CardActions>
                    <br />
                    <CardContent>
                    <Typography variant="body2" component="p">
                      {
                        t.file && <img src={t.file} width="100px" height="100px" />
                      }
                      {
                        t.file_no && 'Adhar/PAN no: ' + t.file_no
                      }
                    </Typography>
                    </CardContent>
                  </Card>
                 {
                    isUploadFile &&
                    <Card>
                    <Grid item xs={12} md={12} lg={12} className={classes.paper}>
                      <form onSubmit={(e)=>fileSubmit(e)} className={classes.paper}>
                      <div className={classes.pos} style={{marginBottom: '20px'}}>
                        <input type="file" name="file" id="selectedFile" style={{ display: 'none' }} onChange={fileUpload}  />
                        <Button
                            onClick={() => document.getElementById('selectedFile').click()}
                            variant="outlined"
                            startIcon={<Publish />}
                        >
                            Upload a file
                        </Button>
                      </div>
                      <TextField
                          name="file_no"
                          size="small"
                          id="file_no"
                          label="Adhar/PAN No"
                          multiline
                          variant="outlined"
                          fullWidth
                          className={classes.pos}
                          
                        />
                        {
                          fileUrl &&
                      <Button size="small" type="submit" variant="outlined" color="primary"> Submit </Button>

                        }
                      </form>
                    </Grid>
                    </Card>
                 } 
                  </>
                )

              :
              <>
              <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onStudentClick}
            >
              Add Student
            </Button>
            <Student  items={props.allStudents && props.allStudents} onStudentClick={onStudentClick}/>
            <StudentDrawer  addStudent={studentMutation} taskDrawer={studentDrawer} item={item} toggleDrawer={toggleTaskDrawer} className={clsx(classes.container, classes.taskDrawer)} />
          
              </>
            }
            </Grid>
        </Container>
        <Backdrop className={classes.backdrop} open={eventLoading}  >
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>
    </div>
  );
}

export default compose(
  
  connect(state => ({
    allStudents: state.students.allStudents
  }), { studentData })
)(Dashboard)


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  taskDrawer: {
    width: '50vw'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
 
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  pos: {
    marginBottom: '20px'
  },
  fixedHeight: {
    height: 240,
  },
}));
