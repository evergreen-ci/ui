#!/usr/bin/env vite-node --script

import { sendEmail } from ".";

process.env.VITE_SCRIPT_MODE = "1";

sendEmail();
