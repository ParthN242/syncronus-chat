import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

const uploadImage = async (image) => {
  const result = await cloudinary.uploader.upload(
    `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
    {
      folder: "syncronus-chat/profile-image",
      resource_type: "auto",
      public_id: uuid(),
    },
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
  return result;
};

export default uploadImage;
