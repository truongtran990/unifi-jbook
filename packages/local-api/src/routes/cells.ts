import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

interface LocalApiError {
  code: string;
}
const isLocalApiError = (err: any): err is LocalApiError => {
  return typeof err.code === "string";
};

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      // make sure the cell storage file exists
      // if it does not exists, add in a default list of cells
      // read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (error) {
      /* if read the file throws an error
        -> inspect the error, see if it says that the file doesn't exist 
      */
      if (isLocalApiError(error)) {
        if (error.code === "ENOENT") {
          // add code to create a file and add default cells
          await fs.writeFile(fullPath, "[]", "utf-8");
          res.send([]);
        }
      } else {
        // re throw the error
        throw error;
      }
    }

    // parse a list of cells out of it
    // send list of celsl back to browser
  });
  router.post("/cells", async (req, res) => {
    // make sure the file exists

    // if not, create it
    // take the list of cells from the request object
    // serializer them
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
    // write this cells into the file
  });

  return router;
};
