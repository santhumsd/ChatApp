const getMessages=({message,userName})=>{
return{
    text:message,
    userName,
    createdAt:new Date().getTime()
}
}
const getLocation=({coords,userName})=>{
   return{
       url:`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
       userName,
       createdAt:new Date().getTime()
   }
}
module.exports = {
    getMessages,
    getLocation
}
