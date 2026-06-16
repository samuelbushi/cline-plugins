---
name: apollo-mobile-clients
description: >
  Router skill for Apollo mobile client work. Use this skill when the user asks
  about Apollo GraphQL on iOS, Swift, Android, Kotlin, or Kotlin Multiplatform,
  and then load the focused apollo-ios or apollo-kotlin skill.
license: MIT
metadata:
  author: cline
  version: "1.0.0"
---

# Apollo Mobile Clients Router

Use the focused mobile client skills instead of answering from this file alone:

- For Swift, SwiftUI, Xcode, iOS, macOS, watchOS, tvOS, visionOS, SPM, or `apollo-ios-cli`, use `apollo-ios`.
- For Android, Kotlin/JVM, Kotlin Multiplatform, Gradle, or Apollo Kotlin codegen, use `apollo-kotlin`.

If the user's request spans both platforms, compare the shared GraphQL concepts first, then call out the platform-specific setup, codegen, cache, auth, and testing differences from each focused skill.
