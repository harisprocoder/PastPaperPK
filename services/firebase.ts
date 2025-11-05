
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, StorageReference } from 'firebase/storage';
import { Paper } from '../types';
import { v4 as uuidv4 } from 'uuid';

// IMPORTANT: Replace with your app's Firebase project configuration.
// It's recommended to use environment variables for this.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let app: FirebaseApp;
try {
    app = initializeApp(firebaseConfig);
} catch (e) {
    console.error("Firebase initialization error. Make sure your environment variables are set.", e);
    // Provide a dummy app object to prevent crashes, and show error in UI.
    app = {} as FirebaseApp;
}

const storage = getStorage(app);

export const uploadPaper = (
  file: File, 
  metadata: Omit<Paper, 'id' | 'path' | 'name'>, 
  onProgress: (progress: number) => void
): Promise<Paper> => {
  return new Promise((resolve, reject) => {
    if (!firebaseConfig.projectId) {
        return reject(new Error("Firebase is not configured. Please set up your environment variables."));
    }
    const filePath = `papers/${metadata.board}/${metadata.class}/${metadata.subject}/${metadata.year}/${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newPaper: Paper = {
            id: uuidv4(),
            name: file.name,
            path: filePath,
            url: downloadURL,
            ...metadata
          };
          resolve(newPaper);
        } catch (error) {
           reject(error);
        }
      }
    );
  });
};

export const listAllPapers = async (): Promise<Paper[]> => {
    if (!firebaseConfig.projectId) {
        throw new Error("Firebase is not configured. Please check your setup.");
    }
    const listRef = ref(storage, 'papers');
    const allPapers: Paper[] = [];

    const processFolder = async (folderRef: StorageReference) => {
        const res = await listAll(folderRef);
        
        for (const itemRef of res.items) {
            // Path format: papers/Board/Class/Subject/Year/filename.pdf
            const pathParts = itemRef.fullPath.split('/');
            if (pathParts.length === 6) {
                const [_, board, pClass, subject, year, name] = pathParts;
                allPapers.push({
                    id: uuidv4(),
                    path: itemRef.fullPath,
                    name,
                    board,
                    class: pClass,
                    subject,
                    year
                });
            }
        }

        for (const prefixRef of res.prefixes) {
            await processFolder(prefixRef);
        }
    };
    
    await processFolder(listRef);
    return allPapers;
};

export const getPaperUrl = (path: string): Promise<string> => {
    const paperRef = ref(storage, path);
    return getDownloadURL(paperRef);
};
