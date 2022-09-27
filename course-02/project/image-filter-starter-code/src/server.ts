import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request, Response } from "express";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const Joi = require('joi');

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const urlSchema = Joi.object({
      image_url: Joi.string().uri().required()
    })

    const { value, err } = await urlSchema.validateAsync(req.query, { allowUnknown: true });

    if (err) {
      return res.status(400).send({
        message: err.message
      });
    }

    const filteredImage: string = await filterImageFromURL(req.query.image_url) as string;
    res.status(200).sendFile(filteredImage, () => {
      deleteLocalFiles([filteredImage]);
    });
  });

  app.get('/', async (req: Request, res: Response) => {
    res.status(200).send({
      status: "Ok",
      message: "try GET image/filteredimage?image_url={{}}"
    });
  });
  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();