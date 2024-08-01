import { writeFile } from 'fs/promises'

export function createRandomString(length:number) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function writeToFile(file:File, path:string) {
  try{
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
  
    await writeFile(path, buffer)
    return true;
  }
  catch {
    return false;
  }
}
