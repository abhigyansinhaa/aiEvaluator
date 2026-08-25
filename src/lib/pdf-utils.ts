/**
 * Utility functions to convert uploaded files (Images / PDFs) to base64 Data URLs
 */

export async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mimeType = file.type || 'image/png';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function processUploadedFiles(files: File[]): Promise<string[]> {
  const images: string[] = [];

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const base64 = await fileToBase64(file);
      images.push(base64);
    } else if (file.type === 'application/pdf') {
      // For PDFs in Node server environment, we can process base64 or render pages
      const base64 = await fileToBase64(file);
      images.push(base64);
    } else {
      const base64 = await fileToBase64(file);
      images.push(base64);
    }
  }

  return images;
}
