'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;
  const image = formData.get('image') as File;

  let image_url = '';

  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: image.type,
      });
    
    if (error) {
      console.error('Storage error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
      
    image_url = publicUrl;
  }

  const { error } = await supabase
    .from('products')
    .insert([{ name, description, price, category, image_url }]);

  if (error) {
    console.error('DB error:', error);
    throw new Error(`Failed to create product: ${error.message}`);
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const category = formData.get('category') as string;
  const image = formData.get('image') as File;
  const existingImageUrl = formData.get('existing_image_url') as string;

  let image_url = existingImageUrl;

  if (image && image.size > 0) {
    // Delete old image if it exists
    if (existingImageUrl) {
      const urlParts = existingImageUrl.split('/');
      const oldFileName = urlParts[urlParts.length - 1];
      if (oldFileName) {
        await supabase.storage.from('products').remove([oldFileName]);
      }
    }

    const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: image.type,
      });
    
    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
      
    image_url = publicUrl;
  }

  const { error } = await supabase
    .from('products')
    .update({ name, description, price, category, image_url })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function verifyAdminLogin(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_session', 'true', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/' 
    });
    return { success: true };
  } else {
    return { error: 'بيانات الدخول غير صحيحة' };
  }
}

export async function logoutAdmin() {
  cookies().delete('admin_session');
}

export async function deleteProduct(id: string, imageUrl: string | null) {
  if (imageUrl) {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    if (fileName) {
      await supabase.storage.from('products').remove([fileName]);
    }
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function updateOrder(id: string, customer_name: string | null, customer_address: string | null, status: string) {
  const { error } = await supabase.from('orders').update({
    customer_name,
    customer_address,
    status
  }).eq('id', id);

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  
  if (error) {
    throw new Error(`Failed to delete order: ${error.message}`);
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function trackOrder(orderId: string) {
  const id = orderId.replace('#', '').trim();
  
  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id)
    .single();

  if (error || !data) {
    return { success: false };
  }

  return { success: true, status: data.status };
}
