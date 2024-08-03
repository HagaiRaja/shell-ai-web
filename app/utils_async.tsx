import { writeFile } from 'fs/promises'

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
