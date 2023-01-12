// import { extname } from "path";

// export const storage = diskStorage({
//     destination: "./uploads",
//     filename: (req, file, callback) => {
//       callback(null, generateFilename(file));
//     }
//   });

//   function generateFilename(file) {
//     return `${Date.now()}.${extname(file.originalname)}`;
//   }

// function diskStorage(arg0: { destination: string; filename: (req: any, file: any, callback: any) => void; }) {
//     throw new Error("Function not implemented.");
// }

// import {} from ''
const multer = require('multer');
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp/my-uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
