import parentModule from "parent-module";
import { ServerOptions } from "vite";
import dns from "dns";
import * as fs from "fs";
import path from "path";

type BaseHTTPSViteServerConfigOptions = {
  appURL: string;
  port: number;
  httpsPort: number;
  useHTTPS: boolean;
};
/**
 * `generateBaseHTTPSViteServerConfig` is a utility function that generates a base Vite server configuration.
 * It will generate a server configuration based on the environment variables.
 * If the environment is set to remote, it will validate that the app environment is set up correctly.
 * It will also validate that the SSL certificates are present.
 * @param options - Configuration options.
 * @param options.appURL - The URL the app is running on.
 * @param options.port - The port the app should run on.
 * @param options.httpsPort - The port the app should run on when using HTTPS.
 * @param options.useHTTPS - Whether or not to use HTTPS.
 * @returns - The server configuration.
 */
const generateBaseHTTPSViteServerConfig = ({
  appURL = "",
  httpsPort = 8443,
  port = 3000,
  useHTTPS = false,
}: BaseHTTPSViteServerConfigOptions): ServerOptions => {
  let serverConfig: ServerOptions = {
    host: "localhost",
    port: port,
  };

  const isViteInDevMode = process.env.NODE_ENV === "development";

  // If we are running in a remote environment, we need to validate that we have the correct setup
  if (isViteInDevMode && useHTTPS) {
    const hostURL = appURL.replace(/https?:\/\//, "");
    // Validate that the app url resolves to 127.0.0.1
    dns.lookup(hostURL, (err, address) => {
      if (err || address !== "127.0.0.1") {
        console.error(`
    ***************************************************************
    *                                                             *
    *  ERROR: ${hostURL} must resolve to       *
    *  127.0.0.1. Did you update your /etc/hosts file?            *
    *                                                             *
    ***************************************************************
      `);
        process.exit(1);
      }
    });

    const dirNameOfParentModule = path.dirname(parentModule() || "");

    // Validate the SSL certificates exist
    if (
      !fs.existsSync(path.resolve("localhost-key.pem")) ||
      !fs.existsSync(path.resolve("localhost-cert.pem"))
    ) {
      console.log(path.resolve("localhost-cert.pem"));
      console.log(path.resolve(dirNameOfParentModule, "localhost-key.pem"));
      console.log(path.resolve(dirNameOfParentModule, "localhost-cert.pem"));
      console.error(`
    *******************************************************************************************************
    *                                                                                                     *
    *  ERROR: localhost-key.pem is missing. Did you run                                                   *
    *  'mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem ${hostURL}'?                 *
    *                                                                                                     *
    *******************************************************************************************************
      `);
      process.exit(1);
    }

    serverConfig = {
      host: hostURL,
      port: httpsPort,
      https: {
        key: fs.readFileSync(path.resolve("localhost-key.pem")),
        cert: fs.readFileSync(path.resolve("localhost-cert.pem")),
      },
    };
  }
  return serverConfig;
};

export { generateBaseHTTPSViteServerConfig };
