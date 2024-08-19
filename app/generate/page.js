'use client'

import { useState } from 'react'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import {doc, collection, setDoc, getDoc, writeBatch} from 'firebase/firestore'
import {db} from '@/firebase';
import { AppBar, Container, Toolbar, Typography,  Button, Box, Card, CardContent, Grid, TextField, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material"



export default function Generate() {
  const [text, setText] = useState('')
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter()

  const handleSubmit = async () => {
     fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
    .then((res) => res.json())
    .then((data) => setFlashcards(data))

  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id],
    }))

}

const handleOpen = () => {
    setOpen(true)
}

const handleClose = () => {
    setOpen(false)
}

// const saveFlashcards = async () => {
//     if (!name) {
//       alert('Please enter a name')
//       return
//     }
  
   
//       const userDocRef = doc(collection(db, 'users'), user.id)
//       const docSnap = await getDoc(userDocRef)
  
//       const batch = writeBatch(db)
  
//       if (docSnap.exists()) {
//         const collections = docSnap.data().flashcards || []
//             if(collections.find((f) => f.name === name )) {
//                 alert("Flashcard collection with the same name already exists. ")
//                 return
//             }
//             else {
//                 collections.push({name})
//                 batch.set(userDocRef, { flashcards: collections }, {merge:true})
//             }
        
//         }
//       else {
//         batch.set(userDocRef, { flashcardSets: [{ name}] })
//       }

//       const colRef = collection(userDocRef, name)
//       flashcards.forEach((flashcard) => {
//         const cardDocRef = doc(colRef)
//         batch.set(cardDocRef, flashcard)
//       })

//       await batch.commit()
//       handleClose()
//       router.push('/flashcards')
  
// }

const saveFlashcards = async () => {
  if (!name.trim()) {
    alert('Please enter a name');
    return;
  }
  setIsSaving(true);
    try {
        const userDocRef = doc(collection(db, "users"), user.id);
        const userDocSnap = await getDoc(userDocRef);

        const batch = writeBatch(db);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const updatedSets = [
                ...(userData.flashcardSets || []),
                { name, flashcards }
            ];
            batch.update(userDocRef, { flashcardSets: updatedSets });
        } else {
            batch.set(userDocRef, { flashcardSets: [{ name, flashcards }] });
        }

        const setDocRef = doc(collection(userDocRef, "flashcardSets"), name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(setDocRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();

        alert("Flashcards saved successfully!");
        handleClose();
        setName("");
        router.push('/flashcards');
    } catch (error) {
        console.error("Error saving flashcards:", error);
        alert("An error occurred while saving flashcards. Please try again.");
    } finally {
        setIsSaving(false);
    }
}



  
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      

      {flashcards.length > 0 && (
        <Box sx={{mt: 4}}>
          <Typography variant="h5">Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index)
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          },

                          "& > div > div": {
                            position: "absolute",
                            width: "100%",
                            height: "200px",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box"
                            
                          },

                          "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                          }

                          

                        }} 
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                          <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>

                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{mt: 4, display: "flex", justifyContent: "center"}}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>

        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection
          </DialogContentText>
          <TextField autoFocus amrgin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)} variant="outlined"></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>

  )
  
}