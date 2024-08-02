import { resolve } from 'path'

export const PRESET_DIR = resolve(process.env.NEXT_PUBLIC_ROOT_PATH ?? "", "public/preset");
export const URL = process.env.NEXT_PUBLIC_URL;