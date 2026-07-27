import { supabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = 'product-images';

export async function saveUploadedImage(imageFile: File | null): Promise<string> {
  if (!imageFile || imageFile.size === 0) return '';

  const fileExtension = imageFile.name.split('.').pop() || 'png';
  const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExtension}`;

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType: imageFile.type || 'image/png',
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload gambar ke Supabase Storage: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteUploadedImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  const parts = imageUrl.split(`/${BUCKET_NAME}/`);
  if (parts.length < 2) return;

  const fileName = parts[1];
  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([fileName]);

  if (error) {
    console.warn(`Gagal menghapus gambar dari Supabase Storage: ${error.message}`);
  }
}
