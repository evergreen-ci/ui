import { ServerOptions } from "vite";
import dns from "dns";
import * as fs from "fs";
import path from "path";

const sslKeyName = "localhost-key.pem";
const sslCertName = "localhost-cert.pem";

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
    try {
      if (!appURL) {
        console.error("appURL is required when useHTTPS is true.");
        throw new Error("Configuration error");
      }
      const hostURL = appURL.replace(/https?:\/\//, "");
      // Validate that the app url resolves to 127.0.0.1
      dns.lookup(hostURL, (err, address) => {
        if (err || address !== "127.0.0.1") {
          console.error(`
    ***************************************************************
    *                                                             *
    *  ERROR: "${hostURL}" must resolve to       *
    *  127.0.0.1. Did you update your /etc/hosts file?            *
    *                                                             *
    ***************************************************************
      `);
          throw new Error("Configuration error");
        }
      });

      // Validate the SSL certificates exist
      if (
        !fs.existsSync(path.resolve(sslKeyName)) ||
        !fs.existsSync(path.resolve(sslCertName))
      ) {
        console.error(`
    *******************************************************************************************************
    *                                                                                                     *
    *  ERROR: ${sslKeyName} or ${sslCertName} is missing. Did you run                             *
    *  'mkcert -key-file ${sslKeyName} -cert-file ${sslCertName} ${hostURL}'?  *
    *                                                                                                     *
    *******************************************************************************************************
      `);
        throw new Error("Configuration error");
      }

      serverConfig = {
        host: hostURL,
        port: httpsPort,
        https: {
          key: fs.readFileSync(path.resolve(sslKeyName)),
          cert: fs.readFileSync(path.resolve(sslCertName)),
        },
      };
    } catch (error) {
      console.error(`
        \x1b[31m***************************************************************\x1b[0m
        \x1b[31m*                                                             *\x1b[0m
        \x1b[31m*  ERROR: Remote environment setup failed.                    *\x1b[0m
        \x1b[31m*  Defaulting to local environment setup.                     *\x1b[0m
        \x1b[31m*                                                             *\x1b[0m
        \x1b[31m***************************************************************\x1b[0m
      `);
    }
  }
  return serverConfig;
};

export { generateBaseHTTPSViteServerConfig };
