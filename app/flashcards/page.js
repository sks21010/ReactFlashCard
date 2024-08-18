'use client'
import {useUser} from '@clerk/next.js'
import {useEffect, useState} from 'react'

import {CollectionReference, doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '@/firebase'
