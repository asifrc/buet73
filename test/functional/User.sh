#!/bin/sh
curl --header "Content-Type: application/json"  -X POST 'http://localhost:3000/api/users/' -d '{"fbid": "1234",
"firstName": "Mahbubur",
"lastName": "Choudhury",
"displayName": "Mahbubur Reza Choudhury",
"department": "Electrical Engineering",
"email": "banderson@asifchoudhury.com",
"password": "password1234",
"cpassword": "password1234",
"phone": "1 123 1234",
"address": "2828 82nd St",
"city": "Rapid City",
"stateProv": "South Dakota",
"zip": "57702",
"country": "United States"
}'                                                      }
