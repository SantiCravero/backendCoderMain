export const generateAddProductToCartErrorInfo = (pid) => {
    return `El producto solicitado no existe en la base de datos, id ingresado: ${pid}`
  }
  
  export const generateAddProductErrorInfo = (product) => {
    return `Uno o más campos están incompletos:
    - title         y se recibio: ${typeof product.title}
    - description   y se recibio: ${typeof product.description}
    - code          y se recibio: ${typeof product.code}
    - price         y se recibio: ${typeof product.number}
    - stock         y se recibio: ${typeof product.stock}
    - category      y se recibio: ${typeof product.category}
    - thumbnails    y se recibio: ${typeof product.thumbnails}
      `
  }
