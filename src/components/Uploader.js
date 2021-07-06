import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Uploader.css'
import { Card, Typography, LinearProgress, Box, Button, Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PublicIcon from '@material-ui/icons/Public';



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    
    options : {
        padding: theme.spacing(2),
        margin : theme.spacing(3),
        background : '#424242'
    },

    audioPlayer : {
        margin : theme.spacing(3)
    },

    predictWrapper : {
        marginBottom: theme.spacing(2)
    },

    upload : {
        margin : theme.spacing(3)
    },

    chips: {
        marginBottom : theme.spacing(2) 
    },

    chipGreen  : {
        background : '#4caf50'
    }

  }));


export default function Uploader(props) {

    const classes = useStyles()

    const [fileName, setfileName] = useState(" ")
    const [uploaded, setuploaded] = useState(false)
    const [file, setfile] = useState(null)
    const [prediction, setprediction] = useState(" ")
    const [processing, setprocessing] = useState(false)
    const [url, seturl] = useState(" ")
    const [mounted, setmounted] = useState(false)
    const [percentages, setprecentages] = useState([])

    


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

    const api = 'http://localhost:5000/'

    var fileInputName = React.createRef();

    function handleSubmit(e) {
        e.preventDefault()
        setprediction(" ")
        setuploaded(false)

        setprocessing(true)
        let formData = new FormData()
        formData.append('name', fileName)
        formData.append('audio', file)
        console.log(formData)

        axios.post(api, formData, {
            headers : {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            setprocessing(false)
            console.log(response)
            setprecentages(response.data[0])
            
            // props.setOutput(response.data)
            //fileInputName.current.value=null
        })
        .catch((error) => {
            setprocessing(false)
            console.log(error)
            setprecentages([])
            setprediction("error")
            props.setOutput("Error")
        })         
    }

   const handleFileInput = (e) => {
        setmounted(true)
        const fileData = e.target.files[0]
        setfile(fileData)
        setfileName(e.target.files[0].name)
        setuploaded(true)
        seturl(URL.createObjectURL(fileData)) 
    }
    
    return (
        <div>
        <Card className={classes.options} alignItems="center">

        {/* <Box className="uploader-title-wrapper">
            <Typography variant="h4" component="h5">UPLOAD</Typography>
          </Box> */}


            {uploaded && <Chip className={classes.chipGreen} label={`File Uploaded : ${fileName}`} />}

            {processing && <div> <Chip className={classes.chips} label="File sent for processing...." />
                                    <LinearProgress color="primary" /></div>}
            
            <Box className="form-wrapper">
                <form onSubmit={handleSubmit} encType='multipart/form-data' className="form">
                        <Button className={classes.upload} variant="contained" component="label">
                        Upload Audio
                        <input  type="file" 
                                accept="audio/wav" 
                                onChange={handleFileInput} 
                                ref={fileInputName} 
                                capture
                                hidden>

                        </input>
                    </Button>

                    {mounted &&<div className="player-wrapper"><audio className="audio-tag" src={url} controls /></div> }

                 {   file!==null &&
                    <Box className={classes.predictWrapper}>
                     <Button type="submit" color="primary" variant="contained" startIcon={<PublicIcon />} disabled={processing}>Predict</Button>
                    </Box>

            }


                    {/* <button type="submit">Predict</button> */}
                </form>
            </Box>

            
            
            {/* {
                prediction && (prediction!=="error") &&
                <h1>{prediction}</h1>
            } */}
            </Card>
        </div>
    )
}
