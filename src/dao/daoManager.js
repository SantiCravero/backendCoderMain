const selectedDB = process.env.DBSELECTION

export const getManagerMessage = async () => {
    const ModelMessage = selectedDB === 1 ? await import('./MongoDB/models/Message.js') : await import('./Postgresql/models/Message.js')
    return ModelMessage
}

export const getManagerProducts = async () => {
    const modelProducts = selectedDB === 1 ? await import('./MongoDB/models/Product.js') : await import('./Postgresql/models/Product.js')
    return modelProducts
}