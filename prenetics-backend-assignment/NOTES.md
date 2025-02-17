# Backend Engineering Challenge Approach

## 1. Initial decision making

// base decisions on mock data in search file
// use swagger as a reference for API design
// update of express validator
// write tests according to existing mock
// create factories for mock data
// re-create tests using factories and real implementation

## 2. Base project setup

In its initial state, the project had a few issues that I first needed to address:

- It did not boot properly due to a problematic Postgres package version
- Integration testing was not set up in any form

## 3. Step by step increments

0a4e7c735f454c2d3236551da44e64e8135cf0d3 - pagination support
30a18c757e17630e5eca6b3f5576846a25410bad - filter by patient name
