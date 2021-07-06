import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import {Typography, Container, Box, Divider} from '@material-ui/core';
import ReactCardFlip from 'react-card-flip';
import LinearProgress from '@material-ui/core/LinearProgress';



const useStyles = makeStyles((theme) => ({
    root: {
    
      maxheight: 700,
      maxWidth: 450,
      backgroundColor: "#424242",
      padding: theme.spacing(0),
      margin: "auto",
      minWidth: 450,
      minHeight: 600
      
    },

    textColorsPrimary : {        
            color: "#fff",
        },

        textColorsSecondary :{
            color: "#ffffff",
            opacity: 0.7
    
        },

    media: {
        height: 450
    },

    text: {
        textAlign: "left"
    },
    divider: {
        backgroundColor: "#eeeeee",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
      }
  }));

export default function PredictionCard(props) {

    const [prediction, setprediction] = React.useState("Welcome")
    const [flipped, isflipped] = React.useState(false)

    const labels = ["Air Conditioner", "Car Horn", "Children Playing", "Dog Bark", "Drilling",
               "Engine Idling", "Gunshot", "Jackhammer", "Siren", "Street Music"]

    const descriptions = ["Seems like the sound of an air conditioner nearby. Someone must be enjoying the cool air.","Heard a car horn. Be careful and keep a safe distance.",
                            "Seems like children are playing near you. They must be having a lot of fun.", "Heard a dog or multiple dogs barking near you. Don't panic and keep calm.",
                            "A sound of drilling can be heard. Someone must be repairing something.", "Sounds like an engine idling. Vehicles must be parked near you.",
                            "GUNSHOTS HEARD! Get cover and call for an emergency. Try to keep a safe distance from the site of shooting.", "Sounds like a jackhammer digging nearby. Must be a construction site nearby.",
                            "Heard a wail of siren from around you. Seems like someone needs help nearby.", "Street music can be heard. Seems like good music. Must be good musicians."]

    const welcomeDescription = "Analyse and predict environmental sounds in seconds! Record or upload any environmental sound."

    const rootDir = process.env.PUBLIC_URL

    React.useEffect(()=>{
        if(props.prediction==="" || props.prediction===" ")
        {
            setprediction("Welcome")
        }
        else
        {
            setprediction(props.prediction)
        }

    },[props])

    function LinearProgressWithLabel(props) {
        return (
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
              <Typography className={classes.textColorsPrimary} variant="body2" color="textSecondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }

    const classes = useStyles()

    function handleFlip() {
        isflipped(!flipped)
    }

    const percentages = props.percentages.map((percentage,index) => {
        return(
        <li>
            <Typography className={classes.textColorsSecondary}>{labels[index]}</Typography>
            <LinearProgressWithLabel value={percentage*100} />

        </li>
        )
    })

    return (
        <div>
            <ReactCardFlip isFlipped={flipped}>
            <Card className={classes.root} outlined>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        component="img"
                        alt={prediction}
                        // image="https://via.placeholder.com/450"
                        image={`../../images/${prediction.replace(" ","")}.jpg`}
                        title={prediction} />
                    
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="h2" className={`${classes.textColorsPrimary} ${classes.text}`}>
                            {/* {(props.prediction==="" || props.prediction===" ")
                                ?
                            "Welcome":props.prediction}
                             */}
                             {prediction}

                            
                        </Typography>
                        <Typography variant="body2" className={`${classes.textColorsSecondary} ${classes.text}`} component="p">
                             {/* Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica */}
                            {prediction==="Welcome"?welcomeDescription:descriptions[labels.indexOf(prediction)] }
                         </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                <React.Fragment>
                    <Button variant="contained"  color="primary" onClick={handleFlip} disabled={prediction==="Welcome"}>
                        Learn More
                    </Button>
                    {/* <Button color="primary">
                        Learn More
                    </Button> */}
                    </React.Fragment>
                </CardActions>
            </Card>

            <Card className={classes.root} outlined>
                <CardContent>
                <Typography style={{textAlign:"left"}} className={classes.textColorsPrimary} component="h3" variant="h3">
                    ANALYSIS
                </Typography>
                <Divider className={classes.divider} />
                    <ul style={{listStyle:"none"}}>
                        {percentages}
                    </ul>
                </CardContent>
                <CardActions>
                
                    <Button variant="contained"  color="primary" onClick={handleFlip}>
                        Back
                    </Button>
                
                </CardActions>
            </Card>
            </ReactCardFlip>
            
        </div>
    )
}
