import { dbConnection } from "../../database/dbConnection.js";
import { globalResponse } from "./errorHandeling.js";
import cors from 'cors'

import * as routers from '../modules/index.routes.js'
import { Server } from "socket.io";



export const initiateApp = (app, express) => {
    const port = process.env.PORT 
    app.use(cors())


app.use(express.json())
dbConnection;

app.use('/auth', routers.authRouter)
app.use("/blog",routers.blogsRouter)
app.use("/review",routers.reviewsRouter)
app.use("/question",routers.questionRouter)
app.use('/message', routers.messageRouter)
app.use('/category', routers.categoryRouter)
app.use('/unit', routers.unitRouter)
app.use('/reservation', routers.reservationRouter)
app.use('/newsletter', routers.newsletterRouter)
 

app.use(globalResponse)



app.use('*',(req,res,next) => res.status(404).json({message: '404 not found URL'}))


app.get('/', (req,res)=>res.send('Hellow World!'))
const serverApp = app.listen(port, () => 
    console.log(`Application on port ${port}`.random)) 

const io = new Server(serverApp)

io.on('connection',(socket)=>{
    console.log({socketId:socket.id});
})
}



