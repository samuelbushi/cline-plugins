#!/usr/bin/env bash
set -euo pipefail

git ls-remote --tags https://github.com/apollographql/apollo-kotlin.git | cut -d / -f 3
