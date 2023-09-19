import express from "express";

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  router.get("/cells", async (req, res) => {
    // make sure the cell storage file exists
    // if it does not exists, add in a default list of cells
    // read the file
    // parse a list of cells out of it
    // send list of celsl back to browser
  });
  router.post("/cells", async (req, res) => {
    // make sure the file exists
    //  if not, create it
    // take the list of cells from the request object
    // serializer them
    // write this cells into the file
  });

  return router;
};
