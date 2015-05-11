# operation-transformation
Implementation of basic operation transformation algorithm. Also, world's first real life web application that uses GLU.js.

### Getting started

After cloning repo, run:

    npm install

To install all dependencies. To run local webserver on port `5555` and watch on file changes run

    grunt dev

This will wait until some file has saved. When this happens, it will redeploy webserver.
Now, all we need to do is run backend in new termina. Run

    cd backend
    node collaboration.js

This will start web socket and wait for frontend to connect. Now, opet one or more browsers and
start changing data in tables.