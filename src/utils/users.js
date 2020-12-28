//addUser,removeUser,getUser,getUserInRoom

const users=[]//the users variable is holding the address of the array so we can change the array value even its const
const addUser=({id,userName,room})=>{
    //clean the data
    userName=userName.trim().toLowerCase();
    room=room.trim().toLowerCase();

    //validate the data
    if(!userName || !room){//if any one is empty then exicute this code
       return{
           error:"username and room are required!"
       }
    }
    //check for existing user
      const existingUser=users.find((user)=>user.userName===userName && user.room===room)
    //validate userName
    if(existingUser)
    {
        return{
            error:"userName is in use"
        }
    }
    const user={id,userName,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1)
    {
        return users.splice(index,1)[0]//after removing 1 element in the array it will return the removed element in array so we are using[0] to convert into object by taking first element in the removed array
    }
    
}

const getUser=(id)=>{
    return users.find(user=>user.id===id)
}
const getUsersInRoom=(room)=>{
 //clean the data
 room=room.trim().toLowerCase()
 return users.filter((user)=>user.room===room)
}


// const user={id:12,userName:"   santhu    ",room:"   sanju    "}
// addUser(user)
// console.log(users)
// console.log(getUser(12))
// console.log(getUsersInRoom("anju"))
// console.log(removeUser(12))
console.log(users)
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}