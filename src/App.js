import logo from './logo.svg';
import './App.css';
import LiveRecorder from  './components/LiveRecorder'
import Uploader from './components/Uploader'
import PredictionCard from './components/PredictionCard'
import {Container, Box, Typography, Grid, Paper, AppBar, Toolbar, Slide, Divider} from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MicIcon from '@material-ui/icons/Mic';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import grey from '@material-ui/core/colors/grey';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
    flexGrow: 1,
    margin: theme.spacing(3),
    height: 550,
    width: 600,
    background: "#424242"
  },

  predictionPaper : {
    background : "#eeeeee"
  },

  togglers : {
    paddingTop: theme.spacing(3),
    marginBottom: -100,
    display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center"
  },

  record : {
    marginRight: theme.spacing(2),
    color: "#fff"
  },

  upload : {
    marginLeft: theme.spacing(2),
    color: "#fff"
  },

  toggleButtons : {
    backgroundColor: "#424242",
    '&:hover' : {
      backgroundColor: "#3f51b5"

    }
  },

  toggleIcons : {
    color: "#eeeeee",
    
  },

  textColorsPrimary : {        
    color: "#fff",
},

textColorsSecondary :{
    color: "#ffffff",
    opacity: 0.7

},
divider: {
  backgroundColor: "#eeeeee"
}
}));


function App() {

  const classes = useStyles();

  const [prediction, setprediction] = React.useState("")
  const [percentages, setpercentages] = React.useState([])
  const [toggle, settoggle] = React.useState("record")  //True is recorder

  function handlePredictionChange(value) {
    setprediction(value)
  }

  function handlePercentageChange(value) {
    setpercentages(value)
  }

  function handleSwitch() {
    if(toggle==="record"){
      settoggle("upload")
    }

    if(toggle==="upload")
    {
      settoggle("record")
    }
  }


  return (
    <React.Fragment>
      <Box className="App">
    <Grid container spacing ="1">

      <Grid item xs="12">
        <Box className="App-header">
        <AppBar position="static">
          <Toolbar>
          <Typography variant="h5" >Urban Sound Classification</Typography>
          </Toolbar>
        </AppBar>
          
        </Box>
      </Grid>
      <Grid item xs="6">
        {/* <Paper component="div"  className={classes.control} elevation={1} square>
        {prediction !== null &&
        <Paper component="div" className={classes.predictionPaper} elevation={3}>
        <Typography variant="h3" component="h3">{prediction}</Typography>
        </Paper>
        }
        </Paper>
       */}

       <PredictionCard prediction={prediction} percentages={percentages} />

      </Grid>

      <Grid item xs="6" container spacing="1" className={classes.root}>

     {/* <FormControlLabel
          control={<Switch color="primary" checked={!toggle} onChange={handleSwitch} />}
          label="Record/Upload" labelPlacement="bottom"
        /> */}

        <Grid item xs="12">
        <Box className={classes.togglers}>
        <Typography variant="h5" component="h5" className={classes.record}>Record</Typography>
        <ToggleButtonGroup value="record" exclusive onChange={handleSwitch} size="large">
            
          <Tooltip title="Record" arrow>
          <ToggleButton value={"record"} className={classes.toggleButtons} > 
            <MicIcon className={classes.toggleIcons} />
          </ToggleButton>
          </Tooltip>

          <Tooltip title="Upload" arrow >            
          <ToggleButton value={"upload"} className={classes.toggleButtons}>
            <CloudUploadIcon className={classes.toggleIcons} />
          </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
        <Typography variant="h5" component="h5" className={classes.upload}>Upload</Typography>
        </Box>
      </Grid>

      <Grid item xs="12">
      <Container>
          <Slide direction="up" in={toggle==="record"} mountOnEnter unmountOnExit >
          
          <Box className="recorer-wrapper">
           <Box className="recorder-title-wrapper">
            <Typography variant="h5" component="h5" className={classes.textColorsPrimary} >Record an environmental sound</Typography>
            <Divider className={classes.divider} />
          </Box>
          <LiveRecorder setOutput={handlePredictionChange} setPredictions={handlePercentageChange}/>
        </Box>
          

          </Slide>

          {/* <Grid item xs="12">
            <Typography variant="h4" component="h5">OR</Typography>
          </Grid> */}

          <Slide direction="up" in={toggle==="upload"} mountOnEnter unmountOnExit>
          
          <Box className="uploader-wrapper">
           <Box className="uploader-title-wrapper">
            <Typography variant="h5" component="h5" className={classes.textColorsPrimary}>Upload a .WAV audio file</Typography>
            <Divider className={classes.divider} />
          </Box>
          <Uploader setOutput={handlePredictionChange} setPredictions={handlePercentageChange} />
        </Box>
          
          </Slide>
          </Container>
          </Grid>


      </Grid> 
      </Grid>
    </Box>
      
      


        


        
    
    </React.Fragment>
    
  );
}

export default App;
