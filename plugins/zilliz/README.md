# Zilliz
Zilliz helps Cline work with Zilliz Cloud clusters and Milvus vector databases through `zilliz-cli` workflows.
## Cline Primitives
- Skills: `ask-zilliz` provides general Zilliz Cloud guidance, plan selection, pricing, schema design, SDK usage, troubleshooting, and feature adoption.
- Skills: `zilliz-quickstart` and `zilliz-setup` guide CLI installation, authentication, and cluster context setup.
- Skills: `zilliz-status`, `zilliz-monitoring`, and `zilliz-job` help inspect cluster context, resources, metrics, and async operation status.
- Skills: `zilliz-cluster`, `zilliz-project-region`, `zilliz-on-demand-cluster`, `zilliz-privatelink`, and `zilliz-billing` cover Zilliz Cloud control-plane workflows.
- Skills: `zilliz-collection`, `zilliz-database`, `zilliz-index`, `zilliz-partition`, `zilliz-vector`, `zilliz-user-role`, `zilliz-backup`, `zilliz-import`, and `zilliz-external-collection` cover Milvus data-plane and lifecycle workflows.
- Rules: `zilliz:safety` requires explicit approval for credential changes, destructive operations, writes, and cost-affecting Zilliz actions.
## Requirements
- A Zilliz Cloud account for live cloud operations.
- `zilliz-cli` installed by the user or with explicit user approval.
- Zilliz CLI authentication completed in the user's terminal or environment.
- Appropriate Zilliz project, cluster, database, and role permissions for any requested operation.
## Install
```bash
cline plugin install zilliz
```
For local development from this repository:
```bash
cline plugin install ./plugins/zilliz --cwd .
```
## Example Usage
```text
/zilliz-quickstart Help me install the CLI and pick a cluster context.
/zilliz-status Summarize my current cluster, databases, and collections.
Use the zilliz-vector skill to prepare a safe query against my test collection.
```
## Trust Boundaries
The plugin does not install `zilliz-cli`, authenticate, call Zilliz Cloud, or mutate MCP settings during installation. Runtime CLI commands may read private metadata, vector data, billing details, or mutate live cloud resources, so credential handling, persistent config changes, destructive actions, writes, and cost-affecting operations require explicit user confirmation.
