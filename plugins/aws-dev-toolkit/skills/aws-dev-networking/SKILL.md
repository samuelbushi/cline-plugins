---
name: aws-dev-networking
description: Design and troubleshoot AWS networking across VPCs, subnets, security groups, NACLs, VPC endpoints, Transit Gateway, DNS, CDN, and hybrid connectivity.
---

# AWS Dev Networking

Use this skill for VPC design, connectivity debugging, DNS, load balancing, CloudFront, Transit Gateway, VPC endpoints, NAT cost, and hybrid networking.

Safety rules:

- Ask before inspecting live network resources, reading flow logs, changing routes, updating security groups, modifying DNS, or touching load balancers.
- Treat CIDRs, DNS names, account IDs, route tables, peering details, and connectivity diagrams as sensitive.
- Do not open inbound access, change routes, update NACLs, or alter DNS without explicit confirmation and rollback.
- Verify current quotas, endpoint support, and service-specific network behavior with `awsknowledge` when needed.

Workflow:

1. Clarify source, destination, protocol, port, VPCs, accounts, regions, and whether the problem is design or troubleshooting.
2. For design, choose CIDR ranges, subnet tiers, routing domains, endpoint strategy, egress model, DNS, and inspection points.
3. For troubleshooting, check security groups, NACLs, route tables, endpoint policies, DNS resolution, load balancer target health, and flow logs in that order.
4. Call out NAT Gateway and cross-AZ data transfer costs early.
5. Prefer VPC endpoints for private AWS service access and least-privilege endpoint policies when practical.
6. Summarize the packet path and the exact control blocking it.

Networking fixes often have broad blast radius. Keep changes narrow and reversible.
