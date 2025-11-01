import { Server } from "http";
import app from "./app";

async function main() {
  const server: Server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}

main();
