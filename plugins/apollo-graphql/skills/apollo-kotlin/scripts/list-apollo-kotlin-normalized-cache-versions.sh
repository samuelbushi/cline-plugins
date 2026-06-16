#!/usr/bin/env bash
set -euo pipefail

git ls-remote --tags https://github.com/apollographql/apollo-kotlin-normalized-cache.git | cut -d / -f 3
