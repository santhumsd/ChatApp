const socket = io()
const $messageForm=document.querySelector('#message-form');
const $messageFormInput=document.querySelector('input');
const $messageFormButton=document.querySelector('#submit');
const $messageTemplate=document.querySelector('#message-template').innerHTML;
const $messages=document.getElementById('messages');
//const $sidebarTemplate=document.getElementById("#sidebar-template");
console.log($messages)

const {userName,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
console.log(userName,room)
socket.on('countUpdated', (count) => {
    console.log('The count has been updated!', count)
})

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })
const autoScroll=()=>{
    //new message element
const newMessage=$messages.lastElementChild
//height of the new message
const newMessageStyles=getComputedStyle(newMessage);
const newMessageMargin=parseInt(newMessageStyles.marginBottom)
const newMessgeHeight=newMessage.offsetHeight+newMessageMargin;
console.log(newMessgeHeight,"newMessgeHeight")
//visible height
const visibleHeight=$messages.offsetHeight;
console.log(visibleHeight,"visibleHeight")
//height of messages container
const containerHeight=$messages.scrollHeight;
console.log(containerHeight,"containerHeight")

//how far have i scrolled?
const scrollOffset=$messages.scrollTop+visibleHeight;
console.log(scrollOffset,"scrollOffset")

if(containerHeight-newMessgeHeight<=scrollOffset){
$messages.scrollTop=$messages.scrollHeight
console.log($messages.scrollTop,"$messages.scrollTop")
}
}
socket.on('message',({text,createdAt,userName})=>{
    const markup = `<div class="message"> 
                           <p>
                          <span class="message__name">${userName}</span>  
                          <span class="message__meta">${moment(createdAt).format('hh:mm A')}</span>
                           </p> 
                           <p>${text}</p>
                    </div>`;
    $messages.insertAdjacentHTML('beforeend', markup)
    autoScroll();
    console.log(text )
})
socket.on('locationMessage',({url,createdAt,userName})=>{
    const markup = `<div class="message"> 
                      <p>
                          <span class="message__name">${userName}</span>  
                          <span class="message__meta">${moment(createdAt).format("hh:mm A")}</span>
                     </p> 
                     <p><a href=${url} target="_blank" >My current location</a></p>
                  </div>`;
    $messages.insertAdjacentHTML('beforeend', markup);
    autoScroll();
    console.log({url,createdAt} )
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const message=e.target.elements.message.value
    $messageFormButton.setAttribute('disabled','disabled')
    socket.emit('formdata',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')   
        $messageFormInput.value="";
        $messageFormInput.focus()
        if(error) return console.log(error)
        console.log('message dilivered')
    })
    
})

socket.on("serverformdata",(value)=>{
console.log("form data",value)
  document.getElementById('san').innerHTML=value
})

socket.on("NewUser",()=>{
    console.log("A new user added to the chat")
})
socket.on('exit',()=>{
    console.log('the user is logged out from the chat')
})
const $locationDoc=document.querySelector("#send-location");
$locationDoc.addEventListener('click',(e)=>{
e.preventDefault();

if(!navigator.geolocation){
    return alert("you browser does not support the location access")
}
$locationDoc.setAttribute('disabled','disabled');
navigator.geolocation.getCurrentPosition((position)=>{
          socket.emit('sendLocation',{
                                      latitude:position.coords.latitude,
                                      longitude:position.coords.longitude
                                      },(error)=>{
                                        $locationDoc.removeAttribute('disabled');
                                            if(error){
                                                return console.log(error)
                                            }
                                            console.log("location shared successfully")
                                      })
            
         // console.log(position)
          
    })

})
socket.emit('join',{userName,room},(error)=>{
    if(error)
    {
        console.log(error)
        alert(error)
        location.href='/'
    }
   
})

socket.on('roomData',({users,room})=>{
    const liList=users.map(element => ("<li>"+element.userName+"</li>"));
    const markup=`<h2 class="room-title">${room}</h2>  
                    <h3 class="list-title">Users</h3>
                    <ul class="users">
                     ${liList}
                    </ul>`
          document.querySelector('#sidebar').innerHTML=markup
console.log(room,users)
})
socket.on("location",(coords)=>{
    console.log('A user location info',coords)
})

const throtle=(fn,delay)=>{
    let bool=true;
    return ()=>{
       if(bool)
       {
           fn();
           bool=false;
         setTimeout(() => {
             bool=true;
         }, delay);
       }
       else{
           return;
       }
    }
}
const debounce=(fn,delay)=>{
    let setId;
    return ()=>{
          clearTimeout(setId)   
          setId=setTimeout(() => {
            fn();
          }, delay);
         
      }
}
// document.getElementById('san').addEventListener('click',debounce(()=>{
//     console.log("i have a guts to click you")
//   },1000))


  const san=(a,b)=>{
    console.log('the value will be',a+b) 
 }

const x=(a,b,callback)=>{
     setTimeout(()=>{callback(a,b)},0) 
}
x(3,4,san)
console.log("man is self made")


const promise= async ()=>{
    console.log("promise created")
   

}
console.log(promise())
promise.then(()=>{
    console.log("success")
})
promise.catch(()=>{
    console.log("failue")
})
console.log(promise)