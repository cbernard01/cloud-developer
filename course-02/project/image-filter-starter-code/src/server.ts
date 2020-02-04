import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter Image endpoint
  // Receives an image URL query string and returns a formatted image file
  app.get("/filteredimage", async (req, res)=>{
    // Get Query string image_url
    const image_url =  req.query.image_url;

    // Validate that the image_url query string is present
    // if not present respond with error and status 400
    if (!image_url) return res.status(400).send("Please provide image url.");

    // Filter image with utils/filterImageFromURL method:
    // if no errors respond with resulting image and status 200
    // if error, catch error and respond with error and status 400
    // NOTE: I modified the filterImageFromURL function so that
    // I could catch the Jimp errors and reject the promise.
    await filterImageFromURL(image_url).then(path => {
      // Respond with resulting image and status 200
      res.status(200).sendFile(path);
      // After receiving response "close" notification delete image file
      // NOTE: I modified the deleteLocalFunction function so that
      // I could delete the image file after every response.
      // This required me to remove the Array to accept a single file string.
      res.on("close", () => {deleteLocalFiles(path)});
    }).catch(error => {
      // Console log error for AWS monitoring and log collection.
      console.log(error);
      // Promise rejection respond with error and status 400
      return res.status(400).send("Something went wrong.");
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
