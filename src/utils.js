import { unlink } from 'fs/promises';

export const removeFile = async (path) => {
  try {
    await unlink(path);
  } catch (error) {
    console.log(error, `remove file ${path} error`);
  }
};