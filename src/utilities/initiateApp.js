import { dbConnection } from "../../database/dbConnection.js";
import { globalResponse } from "./errorHandeling.js";

import * as routers from '../modules/index.routes.js'

export const initiateApp = (app, express) => {
    const port = process.env.PORT 

app.use(express.json())
dbConnection;

app.use('/auth', routers.authRouter)
app.use("/blog",routers.blogsRouter)


app.use('*',(req,res,next) => res.status(404).json({message: '404 not found URL'}))

app.use(globalResponse)



app.get('/', (req,res)=>res.send('Hellow World!'))
app.listen(port, () => console.log(`Application on port ${port}`.random)) 

}