import ImageKit from 'imagekit';

var imagekit = new ImageKit({
    publicKey : process.env.PUBLIC_IMAGEKIT_KEY,
    privateKey : process.env.PRIVATE_IMAGEKIT_KEY,
    urlEndpoint : process.env.URL_ENDPOINT
});


export const destroyImage = async (fileId) => {
    try {
      const result = await imagekit.deleteFile(fileId);  // Delete the file using its fileId
      // console.log('File deleted:', result);
      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete image from ImageKit');
    }
  };
export default imagekit;
