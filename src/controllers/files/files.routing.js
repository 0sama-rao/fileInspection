import { upload } from './upload.action'

import { asyncHandler } from '../../middlewares/exception-handler'
// import authenticate from '../../middlewares/authenticate'

module.exports = {
    '/': {
        post: {
            // middlewares: [authenticate],
            action: asyncHandler(upload),
        },
    },
}
