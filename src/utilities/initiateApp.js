import { dbConnection } from "../../database/dbConnection.js";
import { globalResponse } from "./errorHandeling.js";
import cors from 'cors';
import * as routers from '../modules/index.routes.js';
import { Server } from "socket.io";


export let io;
export const initiateApp = (app, express) => {
    const port = process.env.PORT;

    // Configure CORS to allow requests from your frontend origin
    app.use(cors({
        // origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3002','http://localhost:3003'], // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: true, // Allow cookies and credentials
    }));

    app.use(express.json());
    dbConnection

    // Your routes
    app.use('/auth', routers.authRouter);
    app.use("/blog", routers.blogsRouter);
    app.use("/review", routers.reviewsRouter);
    app.use("/question", routers.questionRouter);
    app.use('/message', routers.messageRouter);
    app.use('/category', routers.categoryRouter);
    app.use('/unit', routers.unitRouter);
    app.use('/reservation', routers.reservationRouter);
    app.use('/newsletter', routers.newsletterRouter);
    app.use('/interested', routers.interstedRouter);
    app.use('/consultation', routers.consultationRouter);

    app.use(globalResponse);

    app.get('/', (req, res) => res.send('Backend is running ✔️')); 

    app.use('*', (req, res, next) => res.status(404).json({ message: '404 not found URL' }));


    const serverApp = app.listen(port, () =>
        console.log(`Application on port ${port}`.random)
    );

    // Socket.IO setup
   io = new Server(serverApp, {
        cors: {
            // origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3002','http://localhost:3003'], // Allow Socket.IO connections from this origin
            methods: ['GET', 'POST'], // Allowed HTTP methods for Socket.IO
            credentials: true, // Allow credentials
        },
    });

    app.set('io', io);
    
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

