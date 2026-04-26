/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const contractPath = path.join(__dirname, "..", "workflow-json-contracts.phase1.json");
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));

const jsCode =
  "const contract = " +
  JSON.stringify(contract) +
  ";\n" +
  "return [{ json: { contract, _meta: { source: 'workflow-json-contracts.phase1.json', version: contract.version } } }];";

const workflow = {
  name: "MCA Phase 1 - Contract loader",
  nodes: [
    {
      parameters: {},
      id: "mca-manual-001",
      name: "When clicking 'Test workflow'",
      type: "n8n-nodes-base.manualTrigger",
      typeVersion: 1,
      position: [0, 0],
    },
    {
      parameters: { jsCode },
      id: "mca-code-load-001",
      name: "Load MCA Contract",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [240, 0],
    },
  ],
  connections: {
    "When clicking 'Test workflow'": {
      main: [[{ node: "Load MCA Contract", type: "main", index: 0 }]],
    },
  },
  pinData: {},
  meta: {
    templateCredsSetupCompleted: true,
  },
  active: false,
  settings: {
    executionOrder: "v1",
  },
};

const out = path.join(__dirname, "..", "n8n-mca-contract-loader.workflow.json");
fs.writeFileSync(out, JSON.stringify(workflow, null, 2), "utf8");
console.log("Wrote", out);
console.log("jsCode length", jsCode.length);
