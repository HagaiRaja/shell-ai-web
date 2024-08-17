import { join } from 'path'

export const PRESET_DIR = join(process.cwd(), "public", "preset")
export const URL = (process.env.NEXT_PUBLIC_URL) ? process.env.NEXT_PUBLIC_URL : "http://localhost:3000";