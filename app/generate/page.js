'use client'

import { useState } from 'react'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { AppBar, Container, Toolbar, Typography,  Button, Box, Grid, TextField} from "@mui/material"



export default function Generate() {
  const [text, setText] = useState('')
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
     fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
    .then((res) => res.json())
    .then(data > setFlashcards(data))

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

const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }
  
   
      const userDocRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(db)
  
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
            if(collections.find((f) => f.name === name )) {
                alert("Flashcard collection with the same name already exists. ")
                return
            }
            else {
                collections.push({name})
                batch.set(userDocRef, { flashcards: collections }, {merge:true})
            }
        
        }
      else {
        batch.set(userDocRef, { flashcardSets: [{ name}] })
      }

      const colRef = collection(userDocRef, name)
      flashcards.forEach((flashcard) => {
        const cardDocREf = doc(colRef)
        batch.set(cardDocREf)
      })

      await batch.commit()
      handleClose()
      router.push('/flashcards')
  
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
      
      {/* We'll add flashcard display here */}
    </Container>

  )
  
}