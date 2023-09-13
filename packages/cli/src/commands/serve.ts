import path from "path";
import { Command } from "commander";

import { serve } from "local-api";

interface LocalApiError {
  code: string;
}

const isLocalApiError = (err: any): err is LocalApiError => {
  return typeof err.code === "string";
};

export const serveCommand = new Command()
  // [] is the optional argument
  .command("serve [filename]")
  .description("Open a file for editing")
  // <> is the required argument
  .option("-p, --port <number>", "port to run server on", "4005")
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(parseInt(options.port), path.basename(filename), dir);

      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file.`
      );
    } catch (error) {
      if (isLocalApiError(error)) {
        if (error.code === "EADDRINUSE") {
          console.error(
            `Port: ${options.port} is in use. Try running on a different port.`
          );
        }
      } else if (error instanceof Error) {
        console.log("Here's the problem", error.message);
      }
      process.exit(1);
    }
  });
