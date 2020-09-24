const validateAndConvertNumber = (text) => {
  try{
    const number = Number(text)
    if(number == NaN)
      return undefined
    return number
  }catch(error){
    return undefined
  }
}

export default validateAndConvertNumber