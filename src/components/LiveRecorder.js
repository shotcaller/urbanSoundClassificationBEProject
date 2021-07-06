import React, {useState, useEffect} from 'react'
import Recorder from 'recorder-js'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import {Typography, Fab, Box, Container, Tooltip, Card, Button,LinearProgress,  Chip, Divider} from '@material-ui/core'
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import PublicIcon from '@material-ui/icons/Public';
import { red, grey } from '@material-ui/core/colors';




const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    
    options : {
        padding: theme.spacing(2),
        margin : theme.spacing(3),
        background : '#424242'
    },

    recordButton : {
        background : '#f44336',
        //padding : theme.spacing(3),
        margin : theme.spacing(3),
        '&:hover': {
            background: "#ef9a9a",
            zIndex : 3
        }
    },

    stopButton : {
        backgroundColor: grey,
        //padding : theme.spacing(3),
        margin : theme.spacing(3)
    },

    audioPlayer : {
        margin : theme.spacing(3)
    },

    predictWrapper : {
        marginBottom: theme.spacing(2)
    },

    chips: {
        marginBottom : theme.spacing(2) 
    }

  }));



export default function LiveRecorder(props) {

    const classes = useStyles()

    const [isRecording, setisRecording] = useState(false)
    const [blobData, setblobData] = useState(null)
   // const [timer, settimer] = useState(0)
    const [blobURL, setblobURL] = useState("")
    const [recorder, setrecorder] = useState(new Recorder(new(window.AudioContext || window.webkitAudioContext)()))
    const [prediction, setprediction] = useState("")
    const [processing, setprocessing] = useState(false)
    const [percentages, setpercentages] = useState([])
    //const recorder = new Recorder(new(window.AudioContext || window.webkitAudioContext)())

    const api = 'http://localhost:5000/'

    useEffect(() => {
        console.log(recorder)
        navigator.mediaDevices.getUserMedia({audio: true})
                .then(stream =>{ 
                    recorder.init(stream) 
                    console.log("success")
                })
                .catch(err => console.log('Uh oh... unable to get stream...', err))

    },[])

    useEffect(() => {
        if(percentages.length!==0){

            const labels = ["Air Conditioner", "Car Horn", "Children Playing", "Dog Bark", "Drilling",
          "Engine Idling", "Gunshot", "Jackhammer", "Siren", "Street Music" ]

            props.setPredictions(percentages)
            
            setprediction(labels[percentages.indexOf(Math.max(...percentages))])

        }
    }, [percentages])

    useEffect(() => {

        props.setOutput(prediction)
        
    }, [prediction])


        function startRecording() {
            recorder.start()
              .then(() =>{
                setisRecording(true);
              })
              .catch(err => console.log("Error while recording: ", err)) 
          }

        function stopRecording() {
            recorder.stop()
              .then(({blob, buffer}) => {
                
                if(blob.size === 44)
                {
                    console.log("Error in blob")
                    console.log(blob)
                    setisRecording(false)
                    return
                }

                console.log(blob)
                console.log(buffer)
                setblobData(blob);
                setblobURL(URL.createObjectURL(blob))
                setisRecording(false)
                //settimer(0)
                // buffer is an AudioBuffer
              });
          }

        function download() {
            Recorder.download(blobData, 'my-audio-file'); // downloads a .wav file
          }

        function handleSubmit() {

            setprediction("")
            setprocessing(true)

            let formData = new FormData()
            formData.append('name', "recordedAudio.wav")
            formData.append('audio', blobData)
            console.log(formData)

            axios.post(api, formData, {
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                setprocessing(false)
                console.log(response)
                // setprediction(response.data)
                // props.setOutput(response.data)
                setpercentages(response.data[0])

                //fileInputName.current.value=null
            })
            .catch((error) => {
                setprocessing(false)
                console.log(error)
                setpercentages([])
                setprediction("error")
                props.setOutput("Error")
        })
    

    }





    return (
        <div>
        {/* <label>
        Toggle
        <input type="checkbox" onClick={setinit(!init)} />
        </label> */}
        
        
            
            <Box className={classes.recorderWrapper}>
                <Card className={classes.options} alignItems="center">

                {/* <Box className="recorder-title-wrapper">
                        <Typography variant="h4" component="h5">RECORD</Typography>
                </Box> */}


                {
                    isRecording && 
                    <div className="timer-wrapper">
                        <Chip label="Recording.." />
                    </div>
                }

        {processing && 
            <Box>
            <Chip className={classes.chips} label="File sent for processing...." />
            <LinearProgress color="primary" />
            </Box>
            }



                <Tooltip title="Record" >
                <Fab className={classes.recordButton} onClick={startRecording} disabled={isRecording} >
                    <MicIcon />
                </Fab>
                </Tooltip>

                <Tooltip title="Stop">
                <Fab className={classes.stopButton} onClick={stopRecording} >
                    <StopIcon />
                </Fab>
                </Tooltip>
                

            {
                blobData != null && 
                <Container className={classes.audioPlayer}> 
                    <audio style={{color: '#3f51b5'}} src={blobURL} controls className="audio-tag" />
                </Container>
            }
            

            {
                blobData !== null && 
                <Box className={classes.predictWrapper}>
                    <Button color="primary" variant="contained" startIcon={<PublicIcon />} onClick={handleSubmit}>Predict</Button>
                </Box>
            }
                
            {/* {
                prediction && (prediction!=="error") &&
                <Box><Divider />
                <h2>{prediction}</h2>
                </Box>
            } */}
            </Card>
            </Box>
        </div>
    )
}
