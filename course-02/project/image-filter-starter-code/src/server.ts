import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const Joi = require('joi');

  app.get("/filteredimage", async (req, res) => {
    const urlSchema = Joi.object({
      image_url: Joi.string().uri().required()
    })

    const { value, err } = await urlSchema.validateAsync(req.query, { allowUnknown: true });

    if (err) {
      return res.status(400).send({
        message: err.message
      });
    }

    filterImageFromURL(req.query.image_url)
      .then(path => {
        res.sendFile(path, () => {
          deleteLocalFiles([path]);
        });
      })
      .catch(err => {
        return res.status(422).json({
          message: err.message
        });
      });
    res.status(200).send({
      status:"Ok",
      message: "try GET image/filteredimage?image_url={{}}"
    });
  });

app.get('/', async (req, res) => {
  res.status(200).send("Welcome");
});
  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();