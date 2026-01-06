
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload an image to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage (e.g., 'services/image.jpg')
 * @returns Promise resolving to the public download URL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
    if (!storage) throw new Error('Storage not initialized');

    // Create a reference to the file
    const storageRef = ref(storage, path);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const url = await getDownloadURL(storageRef);
    return url;
}

/**
 * Delete an image from Firebase Storage
 * @param url The download URL or storage path of the image
 */
export async function deleteImage(url: string): Promise<void> {
    if (!storage) throw new Error('Storage not initialized');

    // Create a reference to the file
    // If it's a URL, ref() can sometimes parse it, but it's safer to pass the storage reference if known.
    // For now, assuming we might need to handle URL -> Ref usage or just pass the path relative to root.
    // If passing full URL to ref(), it works in newer SDK versions.

    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
}
