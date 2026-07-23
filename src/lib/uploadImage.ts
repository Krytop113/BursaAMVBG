import path from 'path';
import fs from 'fs/promises';

export async function saveUploadedImage(imageFile: File | null): Promise<string> {
  if (!imageFile || imageFile.size === 0) {
    return '';
  }

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileExtension = imageFile.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}
