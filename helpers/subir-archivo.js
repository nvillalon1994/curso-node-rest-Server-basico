const path =require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivos=(files,extensionesValidas =['png','jpg','jpeg','gif'],carpeta ="")=>{
    
    return new Promise((resolve,reject)=>{
        
        const { archivo } = files;
        const nombreCortado=archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1]
        
        //validar extensiones
        
    
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no esta permitada. El archivo tiene que estar en alguno de los siguientes formatos ${extensionesValidas}`)
            
        }
        const nombreTemporal =uuidv4() + "." + extension;
        const uploadPath = path.join(__dirname, "../uploads/",carpeta , nombreTemporal)
        
        archivo.mv(uploadPath, function (err) {
            if (err) {
                
            return reject(err);
            }
    
            resolve(nombreTemporal);
        });
    })


    
}

module.exports={
    subirArchivos
}