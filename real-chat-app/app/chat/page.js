import Server from 'socket.io-client';

const io = Server('http://localhost:3000');

io.on('connect' , ()=>{
    console.log('Connected')
})


export default function Chat(){
    return (
        <div>
            <h1 className='text-2xl text-white'>Chat Page</h1>
        </div>
    )
}