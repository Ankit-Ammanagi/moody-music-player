var ImageKit = require("imagekit");


var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URLENDPOINT
});

function uploadFile(file,folder){
    return new Promise((res,rej)=>{
        imagekit.upload({
            file:file.buffer,
            fileName: file.originalname,
            folder:folder
        },(error,result)=>{
            if(error) rej(error);
            else res(result);
        })
    })
}

async function uploadFiles(files) {
    let audio = await uploadFile(files.audio[0],"moodyPlayer/audios");
    let audioImage = await uploadFile(files.audioImage[0],"moodyPlayer/images")

    console.log(audio,audioImage)

    return {audio,audioImage};
}

module.exports = uploadFiles;