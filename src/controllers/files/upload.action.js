import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { stat } from 'fs/promises';
const fileType = await import('file-type');
import mime from 'mime-types';
import crypto from 'crypto';
import { File } from '../../models'; // Ensure the correct path to your Sequelize model
import { asyncHandler } from '../../middlewares/exception-handler';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = path.join(__dirname, '../../../storage/uploads');
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage }).single('file');

export const uploadFile = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(422).json({ message: err.message });
        }
        
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const filePath = path.join(__dirname, '../../../storage/uploads', file.filename);
        const fileStats = await stat(filePath);
        const type = await fileType.fromFile(filePath);
        
        const hash = crypto.createHash('sha256');
        const fileBuffer = fs.readFileSync(filePath);
        hash.update(fileBuffer);
        const fileHash = hash.digest('hex');

        const metadata = {
            userId: req?.user?.id || null,
            sessionId: req?.sessionID || null,
            originalName: file.originalname,
            filename: file.filename,
            size: fileStats.size,
            mimeType: type ? type.mime : mime.lookup(filePath),
            fileHash,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const storedFile = await File.create(metadata);

        res.json({ message: 'File uploaded successfully', file: storedFile });
    });
});
