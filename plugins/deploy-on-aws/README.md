# Deploy on AWS

Deploy on AWS helps Cline analyze an application, choose AWS services, estimate monthly cost, generate infrastructure as code, and create validated AWS architecture diagrams.

## What It Adds

- Skills for AWS deployment planning, Elastic Beanstalk workflows, and draw.io architecture diagram generation.
- AWS Knowledge MCP for service guidance and architecture documentation.
- AWS Pricing MCP for region-aware pricing lookups before infrastructure is generated.
- AWS IaC MCP for CloudFormation, CDK, and Terraform guidance.
- `validate_aws_drawio`, a Cline tool that validates generated `.drawio` files with bundled AWS4 shape checks and returns an optional app.diagrams.net preview URL.

## Requirements

- AWS credentials and appropriate account permissions are required before Cline can run AWS CLI, CDK, Terraform, or deployment commands.
- `uvx` is required when Cline starts the AWS Pricing or AWS IaC MCP servers. Startup may download and execute the pinned MCP packages `awslabs.aws-pricing-mcp-server@1.0.31` and `awslabs.aws-iac-mcp-server@1.0.19`.
- Python 3 and `defusedxml>=0.7.1` are required for the draw.io validator tool.
- Optional exports to PNG, SVG, or PDF require the draw.io desktop CLI.

The plugin does not deploy infrastructure, install Python packages, open a browser, or make AWS account changes at install time. Deployment commands and other mutating AWS actions should be reviewed with the user before execution.
