---
name: duckdb-spatial
description: Analyze spatial data with DuckDB. Use when the user mentions coordinates, lat/lng, distances, maps, addresses, nearby places, GeoJSON, Shapefile, GeoPackage, GeoParquet, GPX, or Overture Maps.
---

# DuckDB Spatial

Use DuckDB's spatial extension for geographic files, coordinate questions, distance calculations, and public Overture Maps data.

## Setup

```sql
INSTALL spatial;
LOAD spatial;
SET geometry_always_xy = true;
```

Use `geometry_always_xy = true` so coordinates are interpreted as longitude, latitude.

For remote data:

```sql
INSTALL httpfs;
LOAD httpfs;
```

## Common tasks

| Need | Pattern |
| --- | --- |
| Read GeoJSON, Shapefile, GeoPackage | `ST_Read('file.geojson')` |
| Convert to GeoJSON | `COPY (...) TO 'result.geojson' WITH (FORMAT GDAL, DRIVER 'GeoJSON')` |
| Distance between lon/lat points | `ST_Distance_Spheroid(ST_Point(lon1, lat1)::POINT_2D, ST_Point(lon2, lat2)::POINT_2D)` |
| Points in polygons | `ST_Contains(polygon_geom, point_geom)` |
| Spatial file schema | `DESCRIBE FROM ST_Read('file.gpkg')` |

## Overture Maps

Overture Maps provides public GeoParquet on S3. Use the STAC catalog to find the current release, then query only the needed theme/type path.

Load remote access:

```sql
LOAD httpfs;
LOAD spatial;
CREATE SECRET (TYPE S3, PROVIDER config, REGION 'us-west-2');
```

Always filter on `bbox` columns before spatial functions so Parquet predicate pushdown reduces data transfer:

```sql
FROM read_parquet('s3://overturemaps-us-west-2/release/<release>/theme=places/type=place/*')
WHERE bbox.xmin BETWEEN -74.01 AND -73.96
  AND bbox.ymin BETWEEN 40.72 AND 40.77
LIMIT 20;
```

## Safety

- Ask before writing converted spatial files.
- Warn before broad Overture or object-storage scans.
- Use meters for distance output and describe assumptions.
- If no results are found, widen the bounding box before changing the category or query intent.
