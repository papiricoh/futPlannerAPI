# FutPlanner API

FutPlanner API is a API to complement the app of FutPlanner. 
This document provides information on how to interact with the API to perform various operations.

### Version 0.1.0

## Table of Contents
- [Getting Started](#getting-started)
- [Content](#content)
- [Methods](#methods)
  - [GET](#get)
  - [POST](#post)

## Getting Started

### Base URL
All API requests are made to the following base URL:
localhost:8080

## Content
- User logIn
- User TokenKey
- Team management
- Player notification
- Club owner teams configuration

## Methods

Be aware that all calls begin with `/api`. As an example: `localhost:8080/api/logIn`
Post methods use `x-www-form-unencoded`.

### GET

- `/api/clubs`:
  - Display a list of all clubs

### POST

- `/api/newUser`:
  - Create a new user
  - Parameters: `username, password, first_name, last_name, photo_url, date_of_birth`
  - Returns: `newUser id : Integer`
- `/api/logIn`:
  - Traditional Log-In
  - Parameters: `username, password`
  - Returns: `user : Object`