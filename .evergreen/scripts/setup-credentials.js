import { setupCredentials } from "@evg-ui/deploy-utils"; 

const dirname = process.cwd()
const target = process.argv[2]

setupCredentials(dirname, target);
