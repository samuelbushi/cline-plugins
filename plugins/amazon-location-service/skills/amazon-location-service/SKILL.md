---
name: amazon-location-service
description: Build Amazon Location Service features in AWS applications, including MapLibre maps, static maps, address autocomplete, geocoding, places search, routes, route matrices, isolines, geofences, tracking, SDK usage, and authorization choices. Use when the user is working with Amazon Location Service or wants AWS-backed location features.
---

# Amazon Location Service

Use this skill for AWS-backed geospatial work: maps, places search, geocoding, routing, geofencing, tracking, and browser or server-side SDK integration.

Do not use it for Google Maps, Mapbox, OpenStreetMap, or generic GIS work unless the user is migrating that app to Amazon Location Service.

## Default Choices

- Use resourceless Maps, Places, and Routes APIs when possible. They avoid pre-created map, place index, and route calculator resources.
- Use Amazon Location API keys for public browser or mobile Maps, Places, and Routes calls.
- Use IAM credentials for server-side calls and resource management.
- Use Cognito when the app needs browser or mobile access to geofencing, tracking, or other AWS resources that require temporary AWS credentials.
- Use `[longitude, latitude]` coordinate order. This matches GeoJSON and Amazon Location API conventions.
- Use the Standard map style unless the user asks for another style.
- Prefer the bundled `@aws/amazon-location-client` package for simple browser apps. Prefer modular AWS SDK v3 clients for React, build-tool, and server-side projects.

## API Selection

- Address type-ahead: `geo-places:Autocomplete`.
- Details after a selected suggestion: `geo-places:GetPlace`.
- Validate a complete typed address: `geo-places:Geocode`.
- Convert coordinates to an address: `geo-places:ReverseGeocode`.
- General search such as "coffee near Seattle": `geo-places:SearchText`.
- Nearby search around a coordinate: `geo-places:SearchNearby`.
- Place and POI prediction from partial or misspelled input: `geo-places:Suggest`.
- Interactive maps: MapLibre with Amazon Location map tiles.
- Static thumbnails or email images: static map image APIs.
- Point to point routing: `geo-routes:CalculateRoutes`.
- Many origins and destinations: `geo-routes:CalculateRouteMatrix`.
- Service areas by time or distance: `geo-routes:CalculateIsolines`.
- Waypoint ordering: `geo-routes:OptimizeWaypoints`.
- GPS trace alignment: `geo-routes:SnapToRoads`.
- Geofence entry and exit events: Amazon Location geofence collections.
- Device current and historical positions: Amazon Location trackers.

## MapLibre Setup

For browser maps, initialize MapLibre with the direct style descriptor URL. Do not fetch the style descriptor first through a separate SDK call.

```ts
import maplibregl from "maplibre-gl"

const region = "us-east-1"
const apiKey = process.env.NEXT_PUBLIC_AMAZON_LOCATION_API_KEY

const map = new maplibregl.Map({
	container: "map",
	style: `https://maps.geo.${region}.amazonaws.com/v2/styles/Standard/descriptor?key=${apiKey}`,
	center: [-122.335167, 47.608013],
	zoom: 12,
	validateStyle: false,
})
```

Always set `validateStyle: false` for Amazon Location styles. Use public API keys only when they are properly restricted to expected actions, referrers, apps, and regions.

## Permissions

For API keys with resourceless operations, use Amazon Location action names, not SDK package names and not legacy `geo:` actions.

Recommended API key actions:

- Maps: `geo-maps:GetTile`, `geo-maps:GetStaticMap`
- Places: `geo-places:Autocomplete`, `geo-places:Geocode`, `geo-places:ReverseGeocode`, `geo-places:SearchText`, `geo-places:SearchNearby`, `geo-places:Suggest`, `geo-places:GetPlace`
- Routes: `geo-routes:CalculateRoutes`, `geo-routes:CalculateRouteMatrix`, `geo-routes:CalculateIsolines`, `geo-routes:OptimizeWaypoints`, `geo-routes:SnapToRoads`

When writing IAM policy examples, scope actions and resources to the user's stated app, account, and region. If the user is unsure, start with read-only discovery through AWS MCP or the AWS CLI before proposing broader permissions.

## Common Mistakes

- Displaying `Title` from autocomplete results. Use `Address.Label` for user-facing address text.
- Treating address fields as flat strings. `Address.Region`, `Address.Country`, and similar fields are nested objects.
- Mixing legacy resource-based actions with resourceless APIs.
- Using latitude and longitude order in APIs that expect longitude first.
- Verifying an address on every keystroke. Use autocomplete while typing, then `GetPlace` after selection or `Geocode` after the user submits a complete address.
- Requesting expensive place details for every search result. Only request additional features such as contacts or opening hours when the UI needs them.

## AWS MCP Use

This plugin registers `aws-mcp` through `mcp-proxy-for-aws`. Use it when the user wants live AWS documentation, regional availability, API reference details, or direct AWS API inspection.

AWS MCP calls run with the user's local AWS credentials. Before making changes, confirm the target AWS account, region, and resource names. Prefer read-only discovery first, then ask for explicit confirmation before creating, deleting, or changing AWS resources, geofences, trackers, API keys, or IAM policies.

The plugin captures `AWS_REGION` or `AWS_DEFAULT_REGION` during installation and passes it to the proxy as `--metadata AWS_REGION=<region>`. If the wrong operation region is configured, ask the user to reinstall the plugin with the desired region set or edit the plugin-owned MCP settings entry.

If MCP authentication fails, check that `uvx` is installed, AWS credentials are configured, the current role has permissions for the requested AWS APIs, and the configured operation region is correct.
