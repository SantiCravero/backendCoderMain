const selectedDB = process.env.DBSELECTION

export const getManagerMessage = async () => {
    const modelMessage = selectedDB == 1 ? await import('./MongoDB/models/Message.js') : await import('./Postgresql/models/Message.js')
    return modelMessage
}

export const getManagerProducts = async () => {
    const modelProducts = selectedDB == 1 ? await import('./MongoDB/models/Product.js') : await import('./Postgresql/models/Product.js')
    return modelProducts
}