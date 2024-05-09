# FutPlanner API

FutPlanner API is a API to implement with the app enviroment of the FutPlanner project. 

The futPlanner project aims to 'democratize' soccer player data, giving the trainer the capability to store data of the permformance of his players and view a sumary of the team performance.

This document provides information on how to interact with the API to perform various operations.

### Version 1.0.3

## Table of Contents
- [Getting Started](#getting-started)
- [Content](#content)
- [Methods](#methods)
  - [GET](#get)
  - [POST](#post)
    - [SECURITY](#security)
    - [USERS](#users)
    - [UPLOADS](#uploads)
    - [TRAINERS](#trainers)

## Getting Started

### Base URL
All API requests are made to the following base URL:
`localhost:8080`

## Content
- User logIn
- User TokenKey
- Team management
- Player notification
- Club owner teams configuration

## Methods

Be aware that all calls begin with `/api`. As an example: `localhost:8080/api/logIn`

Post methods use `x-www-form-unencoded`.

The symbol `[]` in parameters means CAN be Null.

### GET

- `/api/clubs`:
  - Display a list of all clubs

### POST

#### SECURITY

- `/api/logIn`:
  - Traditional Log-In
  - Parameters: `username, password`
  - Returns: `user : Object` 

- `/api/logIn/token`:
  - Traditional Token Log-In
  - Parameters: `username, token`
  - Returns: `user : Object`

- `/api/user/changePassword`:
  - Traditional Change Password
  - Parameters: `username, new_password, old_password`
  - Returns: `user : Object`
  
#### USERS

- `/api/newUser`:
  - Create a new user
  - Parameters: `username, password, first_name, last_name, [photo_url], date_of_birth, type`
  - Extra parameters:
    - If `type` = `player`: `team_id, position, shirt_number, nationality`
    - If `type` = `trainer`: `team_id`
    - If `type` = `owner`: `club_id`
  - Returns: `newUser id : Integer`

#### UPLOADS

- `/upload`:
  - Upload a file (.png, .jpg)
  - Parameters: `user_id, token, photo: File, type`
  - Returns: `message : String, imageUrl : String / href Url`

- `/uploads/{imageUrl}`:
  - Get a file (.png, .jpg)
  - Parameters: `imageUrl` on Url
  - Returns: `image : href Url` (.png, .jpg)
  
#### TRAINERS

- `/api/trainer/getTeam`:
  - Get a team
  - Parameters: `user_id, token`
  - Returns: 
  ```
  {
    "id": 1,
    "team_name": "Test Alevin",
    "shield_url": null,
    "sub_category_id": 1,
    "club_id": 1,
    "players": [
        {
            "id": 3,
            "first_name": "Pacido",
            "last_name": "Dofw",
            "photo_url": null,
            "date_of_birth": null,
            "player_id": 1,
            "position": "SUP",
            "shirt_number": null,
            "nationality": null
        },
    ],
    "club": {
        "id": 1,
        "club_name": "Test FC",
        "shield_url": null,
        "owner_id": null
    }
  }
  ```


- `/api/trainer/getPlayerReports`:
  - Get a list of player reports (player_user_id)
  - Parameters: `user_id, token, player_user_id`
  - Returns: 
  ```
  [
    {
        "id": 2,
        "player_id": 1,
        "match_id": 1,
        "general_performance": 9,
        "tactical_performance": 4,
        "passes_quality": 2,
        "ball_control": 4,
        "game_vision": 6,
        "played_time": 43,
        "goals": 2,
        "red_cards": 0,
        "yellow_cards": 0,
        "match": {
            "id": 1,
            "match_date": "2024-03-08T19:33:22.000Z",
            "map_coords": "372429",
            "place_name": "asturias",
            "home_team_id": 1,
            "home_team_name": "Lopezines",
            "away_team_id": null,
            "away_team_name": "Robertines",
            "sub_category_id": 1,
            "evaluated": 0
        }
    }
  ]
  ```


- `/api/trainer/getMatchReports`:
  - Get a match with a list <b>all</b> of player reports
  - Parameters: `user_id, token, match_id`
  - Returns: 
  ```
  {
    "id": 1,
    "match_date": "2024-03-08T19:33:22.000Z",
    "map_coords": "372429",
    "place_name": "asturias",
    "home_team_id": 1,
    "home_team_name": "Lopezines",
    "away_team_id": null,
    "away_team_name": "Robertines",
    "sub_category_id": 1,
    "evaluated": 0,
    "reports": [
        {
            "id": 2,
            "player_id": 1,
            "match_id": 1,
            "general_performance": 9,
            "tactical_performance": 4,
            "passes_quality": 2,
            "ball_control": 4,
            "game_vision": 6,
            "played_time": 43,
            "goals": 2,
            "red_cards": 0,
            "yellow_cards": 0
        }
    ]
  }
  ```
  
- `/api/trainer/getMatches`:
  - Get a list of matches with the user team
  - Parameters: `user_id, token`
  - Returns: 
  ```
  [
    {
        "id": 1,
        "match_date": "2024-03-12T11:22:23.000Z",
        "map_coords": "372429",
        "place_name": "asturias",
        "home_team_id": 2,
        "home_team_name": "Lopezines",
        "away_team_id": null,
        "away_team_name": "Robertines",
        "sub_category_id": 1,
        "evaluated": 0
    }
  ] 
  ```
  
- `/api/trainer/insertReports`:
  - Get a list of matches with the user team
  - Parameters: Custom raw json
  ```
  {
    "user_id": 2,
    "token": null,
    "match_id": 1,
    "reports": [
        {
            "player_id": 1,
            "general_performance": 9, 
            "tactical_performance": 4, 
            "passes_quality": 2, 
            "ball_controll": 4, 
            "game_vision": 6, 
            "played_time": 43, 
            "goals": 2, 
            "red_cards": 0, 
            "yellow_cards": 0
        }
    ]
  }
  ```
  - Returns: List of insert IDs `insert_list : List`
  
- `/api/trainer/insertMatch`:
  - Get a list of matches with the user team
  - Parameters: `user_id, token, match_date, map_coords, place_name, [home_team_id], home_team_name, [away_team_id], away_team_name, sub_category_id`
  - Returns: `insert_id : Integer`