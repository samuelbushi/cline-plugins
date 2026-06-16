import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "oracle-aidp-connectors"

const aidpSafetyRule = [
	"Oracle AIDP connector skills are active. Treat bundled snippets as notebook guidance, not approval to access data sources, write tables, upload helper code, or store credentials.",
	"Before running or asking the user to run connector code that writes to a database, table, bucket, volume, stream, catalog, or SaaS object, explain the destination, write mode, affected account or workspace, and wait for explicit user approval.",
	"Never paste raw passwords, private keys, wallet contents, OCI config PEMs, database tokens, Salesforce tokens, AWS keys, Azure secrets, or HTTP Basic credentials into chat, committed files, shared notebooks, logs, or `/Workspace/Shared/` paths.",
	"Prefer existing environment variables, OCI Vault secrets, private notebook state, `/tmp` files for transient wallet material, and user-owned secret stores. Do not write secrets into bundled plugin files or shared helper-package uploads.",
	"When uploading helper files or notebooks into an Oracle AI Data Platform Workbench workspace, confirm the workspace id and destination path first, and upload code-only artifacts unless the user explicitly requests otherwise.",
	"Before downloading or classloading JDBC, Spark connector, Hadoop, or cloud SDK JARs into a running Spark JVM, explain the source URL, version pin, optional checksum, and the cluster-managed library alternative, then wait for user approval.",
	"Treat database schemas, table samples, REST responses, notebooks, and generated query results as private user data. Keep queries bounded, avoid unnecessary full-table reads, and summarize sensitive results instead of dumping them.",
].join("\n")

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["skills", "rules"],
	},

	setup(api) {
		api.registerRule({
			id: "oracle-aidp-connectors:safety",
			source: PLUGIN_NAME,
			content: aidpSafetyRule,
		})
	},
}

export default plugin
