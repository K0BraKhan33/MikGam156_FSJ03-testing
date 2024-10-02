import { db } from '../../firebase.js'; // Adjust the path to your firebase.js
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

export default async function handler(req, res) {
    try {
        // Reference to the 'categories' collection in Firestore
        const categoriesRef = collection(db, 'categories');
        console.log(categoriesRef)
        
        // Get all documents in the 'categories' collection
        const snapshot = await getDocs(categoriesRef);
    
        // Extract the data from each document
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        // Return the categories as a JSON response
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}