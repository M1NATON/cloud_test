export const convert = (a) => {
    let len = a.toString().length
    let i

    if(len <= 3) {
        i = `${parseFloat(a).toFixed(2)} байт`
        return i
    }
     else if(len <=6){
        i = `${parseFloat(a/1024).toFixed(2)} кб`
        return i
    }
    else if(len <=7){
        // i = `${Math.ceil((a/1024)/1024)} мб`
        i = `${parseFloat((a/1024)/1024).toFixed(2)} мб`
        return i
    }

}

