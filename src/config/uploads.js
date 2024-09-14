export default {
    uploadFiles: {
        folder: 'uploadFiles',
        isIdRequired: false,
        maxSize: 52428800,
        fileSupported: /jpeg|jpg|png|pdf|xlsx|xls/,
        mimeTypeSupported:
            'image/jpeg|image/png|pdf|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application/vnd.ms-excel',
    },
}
