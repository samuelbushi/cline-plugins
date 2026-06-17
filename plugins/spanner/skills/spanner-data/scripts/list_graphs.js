#!/usr/bin/env node

// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { spawn } = require("child_process");
const path = require('path');
const fs = require('fs');
const os = require('os');

const toolName = "list_graphs";
const configArgs = ["--prebuilt", "spanner"];

const OPTIONAL_VARS_TO_OMIT_IF_EMPTY = [
    'SPANNER_DIALECT',
];

const ENV_FILE_ALLOWLIST = new Set([
	'SPANNER_PROJECT',
	'SPANNER_INSTANCE',
	'SPANNER_DATABASE',
	'SPANNER_DIALECT',
	'GOOGLE_APPLICATION_CREDENTIALS',
]);


function loadEnvFile(env, filePath) {
	if (!fs.existsSync(filePath)) {
		return;
	}

	const envContent = fs.readFileSync(filePath, "utf-8");
	for (const line of envContent.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) {
			continue;
		}

		const splitIdx = trimmed.indexOf("=");
		if (splitIdx === -1) {
			continue;
		}

		const key = trimmed.slice(0, splitIdx).trim();
		if (!ENV_FILE_ALLOWLIST.has(key)) {
			continue;
		}

		let value = trimmed.slice(splitIdx + 1).trim();
		value = value.replace(/(^['"]|['"]$)/g, "");
		if (env[key] === undefined) {
			env[key] = value;
		}
	}
}

function mergeEnvVars(env) {
	for (const fileName of [".env", ".env.local"]) {
		loadEnvFile(env, path.resolve(process.cwd(), fileName));
	}
}

function prepareEnvironment() {
	const env = { ...process.env };
	const userAgent = "skills-cline";
	mergeEnvVars(env);
	
	OPTIONAL_VARS_TO_OMIT_IF_EMPTY.forEach(varName => {
		if (env[varName] === "") {
			delete env[varName];
		}
	});

	return { env, userAgent };
}

function main() {
    const { env, userAgent } = prepareEnvironment();
    const args = process.argv.slice(2);
		
		const command = os.platform() === 'win32' ? 'npx.cmd' : 'npx';
		const processedArgs = os.platform() === 'win32' ? args.map(arg => arg.includes('"') ? '"' + arg.replace(/"/g, '""') + '"' : arg) : args;
		const npxArgs = ["--yes", "@toolbox-sdk/server@1.1.0", "--log-level", "error", ...configArgs, "invoke", toolName, "--user-agent-metadata", userAgent, ...processedArgs];

		const child = spawn(command, npxArgs, { shell: os.platform() === 'win32', stdio: 'inherit', env });
		

    child.on('close', (code) => {
        process.exit(code);
    });

    child.on('error', (err) => {
        console.error("Error executing toolbox:", err);
        process.exit(1);
    });
}

main();
